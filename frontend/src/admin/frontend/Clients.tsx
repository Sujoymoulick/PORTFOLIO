import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  Mail, 
  Phone, 
  Building, 
  Globe, 
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Clients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    website: '',
    notes: '',
    status: 'Active'
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/api/clients?page=${page}&limit=10&search=${encodeURIComponent(search)}&status=${statusFilter}`);
      setClients(data.clients);
      setTotalPages(data.pagination.pages);
      setTotalRecords(data.pagination.total);
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchClients();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, page]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      country: '',
      website: '',
      notes: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: any) => {
    setModalMode('edit');
    setSelectedClient(client);
    setFormData({
      name: client.name || '',
      company: client.company || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      country: client.country || '',
      website: client.website || '',
      notes: client.notes || '',
      status: client.status || 'Active'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await api.post('/api/clients', formData);
      } else {
        await api.put(`/api/clients/${selectedClient._id}`, formData);
      }
      setIsModalOpen(false);
      fetchClients();
    } catch (err) {
      console.error('Failed to save client:', err);
      alert('Error saving client records.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (client: any) => {
    setClientToDelete(client);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;
    setSubmitting(true);
    try {
      await api.delete(`/api/clients/${clientToDelete._id}`);
      setDeleteConfirmOpen(false);
      setClientToDelete(null);
      fetchClients();
    } catch (err) {
      console.error('Failed to delete client:', err);
      alert('Failed to delete client record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-black text-white">Client Management</h2>
          <p className="text-xs text-white/40 font-light mt-1">Manage database of clients, details, and active billing contacts.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <Plus size={14} /> Add Client
        </button>
      </div>

      {/* Filters & Searches */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search name, company, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/5 focus:border-blue-500/35 rounded-xl text-xs text-white/80 focus:outline-none transition-colors"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-3 bg-zinc-900 border border-white/5 focus:border-blue-500/35 rounded-xl text-xs text-white/60 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table Records */}
      <div className="rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-900/30 text-[10px] font-bold uppercase tracking-widest text-white/40">
                <th className="p-4 pl-6">Name</th>
                <th className="p-4">Company</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-white/80">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4 pl-6"><div className="h-4 bg-white/5 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-28"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-36"></div></td>
                    <td className="p-4"><div className="h-4 bg-white/5 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-6 bg-white/5 rounded w-16"></div></td>
                    <td className="p-4 pr-6 text-right"><div className="h-8 bg-white/5 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-white/40 font-light">
                    <Users size={32} className="mx-auto text-white/10 mb-3" />
                    No clients found. Click "Add Client" to create one.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client._id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 pl-6 font-bold text-white">{client.name}</td>
                    <td className="p-4 font-light">{client.company || '—'}</td>
                    <td className="p-4 font-mono font-light text-white/60">{client.email}</td>
                    <td className="p-4 font-mono font-light text-white/60">{client.phone || '—'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        client.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(client)}
                        className="inline-flex p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(client)}
                        className="inline-flex p-2 rounded-lg bg-red-500/5 border border-red-500/10 hover:border-red-500/25 text-red-400/70 hover:text-red-400 transition-all cursor-pointer"
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

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/5 bg-zinc-900/30 flex justify-between items-center text-xs text-white/40 font-light">
            <span>Showing Page {page} of {totalPages} ({totalRecords} Total clients)</span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-2 rounded-lg bg-white/5 border border-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg bg-white/5 border border-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl p-8 rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-display font-black text-white mb-6">
              {modalMode === 'create' ? 'Add New Client' : 'Edit Client Profile'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Website</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Billing Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 size={12} className="animate-spin" />}
                  {modalMode === 'create' ? 'Create Client' : 'Save Changes'}
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
            <h3 className="text-lg font-display font-black text-white mb-2">Delete Client Record</h3>
            <p className="text-xs text-white/40 font-light mb-6">
              Are you sure you want to delete <span className="text-white font-bold">{clientToDelete?.name}</span>? This will archive their client records.
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
                Archive Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
