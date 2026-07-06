import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { 
  TrendingDown, 
  Plus, 
  Trash2, 
  X, 
  Loader2, 
  Calendar,
  Layers,
  Search
} from 'lucide-react';

const formatCurrency = (val: number, cur: string) => {
  const locale = cur === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: cur || 'USD',
    maximumFractionDigits: 0
  }).format(val);
};

export default function Expenses() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    category: 'Hosting',
    amount: '',
    currency: 'USD',
    date: '',
    notes: ''
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<any>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/expenses');
      
      // Filter locally
      let filtered = data;
      if (categoryFilter) {
        filtered = filtered.filter((e: any) => e.category === categoryFilter);
      }
      if (search) {
        filtered = filtered.filter((e: any) => 
          e.description.toLowerCase().includes(search.toLowerCase()) || 
          e.notes.toLowerCase().includes(search.toLowerCase())
        );
      }
      setExpenses(filtered);
    } catch (err) {
      console.error('Failed to load expenses records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter, search]);

  const handleOpenCreate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      description: '',
      category: 'Hosting',
      amount: '',
      currency: 'USD',
      date: today,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.date) return;

    setSubmitting(true);
    try {
      await api.post('/api/expenses', formData);
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save expense:', err);
      alert('Error updating expense records.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (expense: any) => {
    setExpenseToDelete(expense);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    setSubmitting(true);
    try {
      await api.delete(`/api/expenses/${expenseToDelete._id}`);
      setDeleteConfirmOpen(false);
      setExpenseToDelete(null);
      loadData();
    } catch (err) {
      console.error('Failed to delete expense record:', err);
      alert('Failed to delete transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['Hosting', 'Domain', 'Software', 'Ads', 'Laptop', 'Other'];

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Hosting': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Domain': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Software': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Ads': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Laptop': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const totalAmount = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-black text-white">Expense Tracker</h2>
          <p className="text-xs text-white/40 font-light mt-1">Monitor operational expenses, hosting renewals, and software licensing costs.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <Plus size={14} /> Log Expense
        </button>
      </div>

      {/* Overview Metric card */}
      <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total Operations Outflow</span>
          <h3 className="text-2xl font-mono font-black text-white mt-1">{formatCurrency(totalAmount, 'USD')}</h3>
        </div>
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <TrendingDown size={20} />
        </div>
      </div>

      {/* Filters & Searches */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search operational description, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/5 focus:border-blue-500/35 rounded-xl text-xs text-white/80 focus:outline-none"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-zinc-900 border border-white/5 focus:border-blue-500/35 rounded-xl text-xs text-white/60 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Expenses History Table */}
      <div className="rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-900/30 text-[10px] font-bold uppercase tracking-widest text-white/40">
                <th className="p-4 pl-6">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Category</th>
                <th className="p-4">Notes</th>
                <th className="p-4">Outflow Amount</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-white/80">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4 pl-6"><div className="h-4 bg-white/5 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-36"></div></td>
                    <td className="p-4"><div className="h-6 bg-white/5 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-28"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-14"></div></td>
                    <td className="p-4 pr-6 text-right"><div className="h-8 bg-white/5 rounded w-10 ml-auto"></div></td>
                  </tr>
                ))
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-white/40 font-light">
                    <TrendingDown size={32} className="mx-auto text-white/10 mb-3" />
                    No logged expenses found. Click "Log Expense" to enter outlays.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 pl-6 font-mono text-white/60">{expense.date}</td>
                    <td className="p-4 font-bold text-white">{expense.description}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-4 font-light text-white/50">{expense.notes || '—'}</td>
                    <td className="p-4 font-mono font-bold text-white">{formatCurrency(expense.amount, expense.currency || 'USD')}</td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleOpenDelete(expense)}
                        className="inline-flex p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-8 rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-display font-black text-white mb-6">Log Operational Expense</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Description / Vendor *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vercel Pro Billing"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Expense Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="20.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 size={12} className="animate-spin" />}
                  Log Outflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-8 rounded-[2.5rem] bg-zinc-900 border border-red-500/30 shadow-2xl relative text-center">
            <h3 className="text-lg font-display font-black text-white mb-2">Remove Expense Entry</h3>
            <p className="text-xs text-white/40 font-light mb-6">
              Are you sure you want to delete this expense record of <span className="text-white font-bold">{formatCurrency(expenseToDelete?.amount, 'USD')}</span>? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting && <Loader2 size={12} className="animate-spin" />}
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
