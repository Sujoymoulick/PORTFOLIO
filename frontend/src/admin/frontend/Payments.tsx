import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  X, 
  Loader2, 
  Calendar, 
  CheckCircle,
  FileText,
  Search
} from 'lucide-react';

const formatCurrency = (val: number, cur: string) => {
  const locale = cur === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: cur || 'USD',
  }).format(val);
};

export default function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    invoiceId: '',
    clientId: '',
    amount: '',
    method: 'Bank Transfer',
    transactionId: '',
    date: '',
    notes: ''
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<any>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const payData = await api.get('/api/payments');
      const invData = await api.get('/api/invoices');
      const clientData = await api.get('/api/clients?limit=100');

      // Local search filtering
      let filtered = payData;
      if (search) {
        filtered = payData.filter((p: any) => 
          p.transactionId.toLowerCase().includes(search.toLowerCase()) || 
          p.clientDetails?.name.toLowerCase().includes(search.toLowerCase()) ||
          p.invoiceDetails?.invoiceNumber.toLowerCase().includes(search.toLowerCase())
        );
      }

      setPayments(filtered);
      setInvoices(invData);
      setClients(clientData.clients || []);
    } catch (err) {
      console.error('Failed to load payments tracker data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  // Sync client select when invoice is chosen in form
  useEffect(() => {
    if (formData.invoiceId) {
      const selectedInvoice = invoices.find(i => i._id === formData.invoiceId);
      if (selectedInvoice) {
        // Auto populate client and remaining balance
        const remainingAmount = selectedInvoice.grandTotal;
        setFormData(prev => ({
          ...prev,
          clientId: selectedInvoice.clientId || '',
          amount: prev.amount || remainingAmount.toString()
        }));
      }
    }
  }, [formData.invoiceId, invoices]);

  const handleOpenCreate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      invoiceId: '',
      clientId: '',
      amount: '',
      method: 'Bank Transfer',
      transactionId: '',
      date: today,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.date) return;

    setSubmitting(true);
    try {
      await api.post('/api/payments', formData);
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save payment record:', err);
      alert('Error updating payment data.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (payment: any) => {
    setPaymentToDelete(payment);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!paymentToDelete) return;
    setSubmitting(true);
    try {
      await api.delete(`/api/payments/${paymentToDelete._id}`);
      setDeleteConfirmOpen(false);
      setPaymentToDelete(null);
      loadData();
    } catch (err) {
      console.error('Failed to delete payment record:', err);
      alert('Failed to delete transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-black text-white">Payment Collections</h2>
          <p className="text-xs text-white/40 font-light mt-1">Record client settlements, bank transfers, and billing receipts.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <Plus size={14} /> Record Payment
        </button>
      </div>

      {/* Filters & Searches */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search transaction ID, invoice number, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/5 focus:border-blue-500/35 rounded-xl text-xs text-white/80 focus:outline-none"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        </div>
      </div>

      {/* Payments History table */}
      <div className="rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-900/30 text-[10px] font-bold uppercase tracking-widest text-white/40">
                <th className="p-4 pl-6">Date</th>
                <th className="p-4">Client</th>
                <th className="p-4">Invoice Ref</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Settled Amount</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-white/80">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4 pl-6"><div className="h-4 bg-white/5 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-28"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-16"></div></td>
                    <td className="p-4 pr-6 text-right"><div className="h-8 bg-white/5 rounded w-10 ml-auto"></div></td>
                  </tr>
                ))
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-white/40 font-light">
                    <DollarSign size={32} className="mx-auto text-white/10 mb-3" />
                    No payments logged yet. Log a client transaction to begin.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 pl-6 font-mono text-white/60">{payment.date}</td>
                    <td className="p-4 font-bold">{payment.clientDetails?.name || 'Self/No Client'}</td>
                    <td className="p-4 font-mono font-bold text-blue-400">
                      {payment.invoiceDetails?.invoiceNumber ? (
                        <span className="flex items-center gap-1">
                          <FileText size={10} /> {payment.invoiceDetails.invoiceNumber}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-4 font-light">{payment.method}</td>
                    <td className="p-4 font-mono font-light text-white/50">{payment.transactionId || '—'}</td>
                    <td className="p-4 font-mono font-bold text-white">{formatCurrency(payment.amount, payment.invoiceDetails?.currency || 'USD')}</td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleOpenDelete(payment)}
                        className="inline-flex p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete Receipt"
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

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-8 rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-display font-black text-white mb-6">Log Receipt Payment</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Invoice reference</label>
                <select
                  value={formData.invoiceId}
                  onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                >
                  <option value="">No Invoice (General Credit)</option>
                  {invoices
                    .filter(i => i.status !== 'Paid')
                    .map((inv) => (
                      <option key={inv._id} value={inv._id}>
                        {inv.invoiceNumber} — {inv.clientDetails?.name} (Due: {formatCurrency(inv.grandTotal, inv.currency)})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Client *</label>
                <select
                  value={formData.clientId}
                  required
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  disabled={!!formData.invoiceId} // Lock client selection if invoice is selected
                >
                  <option value="">Select Billing Client</option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>{c.name} {c.company && `(${c.company})`}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Amount Collected *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Date Received *</label>
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
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Payment Method</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Stripe">Stripe</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Transaction / Reference ID</label>
                  <input
                    type="text"
                    placeholder="TXN-90248..."
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Internal Note</label>
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
                  Log Receipt
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
            <h3 className="text-lg font-display font-black text-white mb-2">Delete Receipt Record</h3>
            <p className="text-xs text-white/40 font-light mb-6">
              Are you sure you want to delete this payment record of <span className="text-white font-bold">{formatCurrency(paymentToDelete?.amount, 'USD')}</span>? This action is permanent and will reset invoice calculations.
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
                Delete Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
