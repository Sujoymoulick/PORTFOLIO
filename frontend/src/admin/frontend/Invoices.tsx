import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit2, 
  Eye, 
  Printer, 
  X, 
  Loader2, 
  PlusCircle, 
  Trash,
  Settings as SettingsIcon,
  Search,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (val: number, cur: string) => {
  const locale = cur === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: cur || 'USD',
  }).format(val);
};

export default function Invoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  
  // Interactive Line Items State
  const [items, setItems] = useState<any[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    issueDate: '',
    dueDate: '',
    clientId: '',
    projectId: '',
    currency: 'USD',
    tax: '0',
    discount: '0',
    paymentMethod: 'Bank Transfer',
    notes: '',
    status: 'Pending'
  });

  // Invoice Preview State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [invoiceToPreview, setInvoiceToPreview] = useState<any>(null);

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const invData = await api.get('/api/invoices');
      const clientData = await api.get('/api/clients?limit=100');
      const projData = await api.get('/api/projects');
      const settingsData = await api.get('/api/settings');

      // Filter invData locally for search/status
      let filtered = invData;
      if (statusFilter) {
        filtered = filtered.filter((i: any) => i.status === statusFilter);
      }
      if (search) {
        filtered = filtered.filter((i: any) => 
          i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || 
          i.clientDetails?.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setInvoices(filtered);
      setClients(clientData.clients || []);
      setProjects(projData || []);
      setSettings(settingsData);
    } catch (err) {
      console.error('Failed to load invoices data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, search]);

  // Handle line item updates
  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Auto-generate invoice number based on prefix & settings
  const generateInvoiceNumber = () => {
    const prefix = settings?.invoicePrefix || 'INV-';
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    const num = count.toString().padStart(3, '0');
    return `${prefix}${year}-${num}`;
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setItems([{ description: '', quantity: 1, unitPrice: 0 }]);
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const dueDateStr = nextMonth.toISOString().split('T')[0];

    setFormData({
      invoiceNumber: generateInvoiceNumber(),
      issueDate: today,
      dueDate: dueDateStr,
      clientId: clients[0]?._id || '',
      projectId: '',
      currency: settings?.currency || 'USD',
      tax: settings?.gst ? '18' : '0', // default tax if GST is present
      discount: '0',
      paymentMethod: 'Bank Transfer',
      notes: settings?.invoiceFooter || 'Thank you for your business!',
      status: 'Pending'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (invoice: any) => {
    setModalMode('edit');
    setSelectedInvoice(invoice);
    setItems(invoice.items || [{ description: '', quantity: 1, unitPrice: 0 }]);
    setFormData({
      invoiceNumber: invoice.invoiceNumber || '',
      issueDate: invoice.issueDate || '',
      dueDate: invoice.dueDate || '',
      clientId: invoice.clientId || '',
      projectId: invoice.projectId || '',
      currency: invoice.currency || 'USD',
      tax: invoice.tax?.toString() || '0',
      discount: invoice.discount?.toString() || '0',
      paymentMethod: invoice.paymentMethod || 'Bank Transfer',
      notes: invoice.notes || '',
      status: invoice.status || 'Pending'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.invoiceNumber || !formData.clientId) return;

    setSubmitting(true);
    const payload = {
      ...formData,
      items
    };

    try {
      if (modalMode === 'create') {
        await api.post('/api/invoices', payload);
      } else {
        await api.put(`/api/invoices/${selectedInvoice._id}`, payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save invoice:', err);
      alert('Failed to save invoice records.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (invoice: any) => {
    setInvoiceToDelete(invoice);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete) return;
    setSubmitting(true);
    try {
      await api.delete(`/api/invoices/${invoiceToDelete._id}`);
      setDeleteConfirmOpen(false);
      setInvoiceToDelete(null);
      loadData();
    } catch (err) {
      console.error('Failed to delete invoice:', err);
      alert('Failed to delete invoice records.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreview = (invoice: any) => {
    setInvoiceToPreview(invoice);
    setPreviewOpen(true);
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Paid': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Partial': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Overdue': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  // Interactive calculations for modal form preview
  const calculatedSubtotal = items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0), 0);
  const taxRate = parseFloat(formData.tax) || 0;
  const discountAmount = parseFloat(formData.discount) || 0;
  const calculatedTax = (calculatedSubtotal * taxRate) / 100;
  const calculatedGrandTotal = calculatedSubtotal + calculatedTax - discountAmount;

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-black text-white">Invoice Billing</h2>
          <p className="text-xs text-white/40 font-light mt-1">Generate invoices, collect payments, and manage outstanding balances.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <Plus size={14} /> Create Invoice
        </button>
      </div>

      {/* Filters & Searches */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search invoice number, client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/5 focus:border-blue-500/35 rounded-xl text-xs text-white/80 focus:outline-none"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-zinc-900 border border-white/5 focus:border-blue-500/35 rounded-xl text-xs text-white/60 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Partial">Partial</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {/* Invoice Records Table */}
      <div className="rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-900/30 text-[10px] font-bold uppercase tracking-widest text-white/40">
                <th className="p-4 pl-6">Invoice #</th>
                <th className="p-4">Client</th>
                <th className="p-4">Project</th>
                <th className="p-4">Issue Date</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-white/80">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4 pl-6"><div className="h-4 bg-white/5 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-28"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-14"></div></td>
                    <td className="p-4"><div className="h-6 bg-white/5 rounded w-16"></div></td>
                    <td className="p-4 pr-6 text-right"><div className="h-8 bg-white/5 rounded w-28 ml-auto"></div></td>
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-white/40 font-light">
                    <FileText size={32} className="mx-auto text-white/10 mb-3" />
                    No invoices generated yet. Click "Create Invoice" to begin.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-white">{invoice.invoiceNumber}</td>
                    <td className="p-4 font-bold">{invoice.clientDetails?.name || 'Self/No Client'}</td>
                    <td className="p-4 text-white/60 font-light">{invoice.projectDetails?.projectName || 'General Billing'}</td>
                    <td className="p-4 text-white/60 font-mono font-light">{invoice.issueDate}</td>
                    <td className="p-4 text-white/60 font-mono font-light">{invoice.dueDate}</td>
                    <td className="p-4 font-mono font-bold text-white">{formatCurrency(invoice.grandTotal || 0, invoice.currency)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => handlePreview(invoice)}
                        className="inline-flex p-2 rounded-lg bg-white/5 border border-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
                        title="Preview"
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(invoice)}
                        className="inline-flex p-2 rounded-lg bg-white/5 border border-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 size={12} />
                      </button>
                      <a
                        href={`/admin/invoices/${invoice._id}/print`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-2 rounded-lg bg-white/5 border border-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
                        title="Print / PDF"
                      >
                        <Printer size={12} />
                      </a>
                      <button
                        onClick={() => handleOpenDelete(invoice)}
                        className="inline-flex p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Archive"
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

      {/* Invoice Modal Form with Line Items builder */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl p-8 rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-2xl relative max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-display font-black text-white mb-6">
              {modalMode === 'create' ? 'Generate Client Invoice' : `Modify Invoice ${formData.invoiceNumber}`}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Core Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Client *</label>
                  <select
                    value={formData.clientId}
                    required
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  >
                    <option value="">Select Target Client</option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>{c.name} {c.company && `(${c.company})`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Project Reference</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  >
                    <option value="">General Balance / Internal</option>
                    {projects
                      .filter(p => !formData.clientId || p.clientId === formData.clientId)
                      .map((p) => (
                        <option key={p._id} value={p._id}>{p.projectName}</option>
                      ))}
                  </select>
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Issue Date</label>
                  <input
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Payment Method</label>
                  <input
                    type="text"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              {/* Line Items Heading */}
              <div className="border-t border-white/5 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Itemized Breakdown</h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300"
                  >
                    <PlusCircle size={12} /> Add Row
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Line item description (e.g. Frontend Development)"
                          value={item.description}
                          required
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.quantity}
                          required
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.unitPrice}
                          required
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                        />
                      </div>
                      <div className="w-28 text-right text-xs font-mono font-bold text-white/90">
                        {formatCurrency((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0), formData.currency)}
                      </div>
                      <button
                        type="button"
                        disabled={items.length === 1}
                        onClick={() => handleRemoveItem(index)}
                        className="p-3 text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 rounded-xl disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Calculations section */}
              <div className="border-t border-white/5 pt-4 flex flex-col md:flex-row justify-between gap-6">
                {/* Notes and Terms */}
                <div className="flex-1">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Invoice Footer Notes & Terms</label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white resize-none"
                  />
                </div>

                {/* Subtotals card */}
                <div className="w-full md:w-80 p-6 rounded-2xl bg-zinc-950 border border-white/5 space-y-4">
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Subtotal</span>
                    <span className="font-mono text-white font-bold">{formatCurrency(calculatedSubtotal, formData.currency)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-center">
                    <span className="text-xs text-white/50">Tax % (GST)</span>
                    <input
                      type="number"
                      value={formData.tax}
                      onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                      className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded focus:outline-none text-xs text-right text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-center">
                    <span className="text-xs text-white/50">Discount ($)</span>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded focus:outline-none text-xs text-right text-white font-mono"
                    />
                  </div>

                  <div className="border-t border-white/5 pt-3 flex justify-between items-center text-sm font-bold">
                    <span className="text-white/60">Grand Total</span>
                    <span className="font-mono text-blue-400">{formatCurrency(calculatedGrandTotal, formData.currency)}</span>
                  </div>
                </div>
              </div>

              {/* Form submit footer */}
              <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
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
                  {modalMode === 'create' ? 'Issue Invoice' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal (Preview) */}
      {previewOpen && invoiceToPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl p-8 rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            {/* Print / Action Buttons */}
            <div className="flex gap-2 mb-6 pb-6 border-b border-white/5">
              <a
                href={`/admin/invoices/${invoiceToPreview._id}/print`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-[9px] hover:scale-105 transition-transform"
              >
                <Printer size={12} /> Print Invoice
              </a>
              <a
                href={`/admin/invoices/${invoiceToPreview._id}/print`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-widest text-[9px] border border-white/5 transition-all"
              >
                <Download size={12} /> Download PDF
              </a>
            </div>

            {/* Simulated Invoice Sheet Layout */}
            <div className="p-8 rounded-3xl bg-black border border-white/5 text-xs text-white/80 space-y-8 font-light">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-display font-black text-white">{settings?.companyName || 'My Portfolio'}</h3>
                  {settings?.address && <p className="text-white/40 mt-1 max-w-xs">{settings.address}</p>}
                  {settings?.phone && <p className="text-white/40">{settings.phone}</p>}
                  {settings?.email && <p className="text-white/40">{settings.email}</p>}
                  {settings?.gst && <p className="text-white/40 mt-2 font-mono">GSTIN: {settings.gst}</p>}
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-black text-white">{invoiceToPreview.invoiceNumber}</span>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Invoice Amount</p>
                  <p className="text-xl font-mono font-bold text-blue-400 mt-1">
                    {formatCurrency(invoiceToPreview.grandTotal, invoiceToPreview.currency)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-b border-white/5 py-6">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Billed To</span>
                  <div className="mt-2 space-y-1">
                    <p className="font-bold text-white">{invoiceToPreview.clientDetails?.name}</p>
                    {invoiceToPreview.clientDetails?.company && <p className="text-white/60">{invoiceToPreview.clientDetails.company}</p>}
                    <p className="text-white/40">{invoiceToPreview.clientDetails?.email}</p>
                    {invoiceToPreview.clientDetails?.address && <p className="text-white/40 max-w-xs">{invoiceToPreview.clientDetails.address}</p>}
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Invoice Dates</span>
                  <div className="mt-2 space-y-1.5 font-mono">
                    <p><span className="text-white/40">Issued:</span> {invoiceToPreview.issueDate}</p>
                    <p><span className="text-white/40">Due Date:</span> {invoiceToPreview.dueDate}</p>
                    <p><span className="text-white/40">Payment:</span> {invoiceToPreview.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/40">
                    <th className="py-2">Description</th>
                    <th className="py-2 w-16 text-center">Qty</th>
                    <th className="py-2 w-28 text-right">Price</th>
                    <th className="py-2 w-28 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(invoiceToPreview.items || []).map((item: any, i: number) => (
                    <tr key={i} className="text-xs">
                      <td className="py-3 font-medium text-white">{item.description}</td>
                      <td className="py-3 text-center font-mono">{item.quantity}</td>
                      <td className="py-3 text-right font-mono">{formatCurrency(item.unitPrice, invoiceToPreview.currency)}</td>
                      <td className="py-3 text-right font-mono font-bold text-white">{formatCurrency(item.total, invoiceToPreview.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculations block */}
              <div className="flex justify-end pt-4">
                <div className="w-64 space-y-3 font-light text-white/60">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">{formatCurrency(invoiceToPreview.subtotal, invoiceToPreview.currency)}</span>
                  </div>
                  {invoiceToPreview.tax > 0 && (
                    <div className="flex justify-between">
                      <span>Tax ({invoiceToPreview.tax}%)</span>
                      <span className="font-mono text-white">+{formatCurrency(invoiceToPreview.taxAmount, invoiceToPreview.currency)}</span>
                    </div>
                  )}
                  {invoiceToPreview.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="font-mono text-white">-{formatCurrency(invoiceToPreview.discountAmount, invoiceToPreview.currency)}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-sm">
                    <span className="text-white">Total Amount</span>
                    <span className="font-mono text-blue-400">{formatCurrency(invoiceToPreview.grandTotal, invoiceToPreview.currency)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoiceToPreview.notes && (
                <div className="border-t border-white/5 pt-6 text-[10px] text-white/40 leading-relaxed max-w-lg">
                  <p className="font-bold uppercase tracking-widest text-white/30 mb-2">Terms & Guidelines</p>
                  <p>{invoiceToPreview.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-8 rounded-[2.5rem] bg-zinc-900 border border-red-500/30 shadow-2xl relative text-center">
            <h3 className="text-lg font-display font-black text-white mb-2">Archive Invoice</h3>
            <p className="text-xs text-white/40 font-light mb-6">
              Are you sure you want to archive invoice <span className="text-white font-bold">{invoiceToDelete?.invoiceNumber}</span>? This will archive the billing record.
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
                Archive Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
