import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { 
  GitPullRequest, 
  Search, 
  Trash2, 
  X, 
  Loader2, 
  ExternalLink, 
  Github, 
  Sliders, 
  CheckCircle2, 
  Mail,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function Contributions() {
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Details Modal
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/contributions');
      
      let filtered = data;
      if (search.trim()) {
        filtered = filtered.filter((c: any) => 
          c.name.toLowerCase().includes(search.toLowerCase()) || 
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
          c.message.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (statusFilter) {
        filtered = filtered.filter((c: any) => c.status === statusFilter);
      }

      setContributions(filtered);
    } catch (err) {
      console.error('Failed to load contributions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter]);

  const handleOpenDetails = (item: any) => {
    setSelectedItem(item);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedItem) return;
    setUpdatingStatus(true);
    try {
      const updated = await api.put(`/api/contributions/${selectedItem._id}`, { status: newStatus });
      setSelectedItem(updated);
      loadData();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Error updating status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleOpenDelete = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteSubmit = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/api/contributions/${itemToDelete._id}`);
      setDeleteConfirmOpen(false);
      if (selectedItem?._id === itemToDelete._id) {
        setSelectedItem(null);
      }
      loadData();
    } catch (err) {
      console.error('Failed to delete contribution:', err);
      alert('Error deleting record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-display font-black text-white">Contribution Proposals</h2>
          <p className="text-xs text-white/40 font-light mt-1">Review public contribution requests, feature drafts, and code collaboration proposals.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search proposals by contributor, email, project, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-zinc-900/50 border border-white/5 focus:border-blue-500/35 rounded-xl text-xs text-white/80 focus:outline-none"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        </div>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl text-xs text-white/80 focus:outline-none min-w-[150px]"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Approved">Approved</option>
            <option value="Contacted">Contacted</option>
          </select>
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/30">
          <Loader2 className="animate-spin mb-4" />
          <span className="text-xs font-mono uppercase tracking-widest">Loading Proposals...</span>
        </div>
      ) : contributions.length === 0 ? (
        <div className="p-12 text-center border border-white/5 bg-zinc-900/10 rounded-[2rem] text-white/30">
          <GitPullRequest className="mx-auto text-white/10 mb-4" size={40} />
          <p className="text-sm">No contribution proposals found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* List Section */}
          <div className="lg:col-span-2 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
            {contributions.map((item) => (
              <div
                key={item._id}
                onClick={() => handleOpenDetails(item)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 backdrop-blur-md ${
                  selectedItem?._id === item._id 
                    ? 'bg-blue-500/5 border-blue-500/30' 
                    : 'bg-zinc-900/20 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className="text-[9px] text-white/30 font-mono">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 uppercase tracking-widest">
                        {item.projectTitle}
                      </span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 uppercase tracking-widest">
                        {item.contributionType}
                      </span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ${
                        item.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' :
                        item.status === 'Approved' ? 'bg-green-500/10 text-green-400' :
                        item.status === 'Contacted' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-zinc-500/10 text-zinc-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleOpenDelete(item, e)}
                    className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 transition-all cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
                  {item.message}
                </p>
              </div>
            ))}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-1">
            {selectedItem ? (
              <div className="p-6 rounded-[2rem] bg-zinc-900/30 border border-white/5 space-y-6 backdrop-blur-md">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <GitPullRequest size={14} className="text-blue-400" /> Details
                  </h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-1 rounded bg-white/5 border border-white/5 text-white/40 hover:text-white cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Status update select */}
                  <div className="space-y-1">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Status</span>
                    <div className="flex gap-2 items-center pt-1">
                      <select
                        value={selectedItem.status}
                        disabled={updatingStatus}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        className="flex-1 px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Approved">Approved</option>
                        <option value="Contacted">Contacted</option>
                      </select>
                      {updatingStatus && <Loader2 size={14} className="animate-spin text-blue-500" />}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Contributor Info</span>
                    <div className="space-y-1 text-xs text-white/80">
                      <div className="flex items-center gap-2 text-white/60">
                        <User size={12} /> {selectedItem.name}
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <Mail size={12} /> <a href={`mailto:${selectedItem.email}`} className="underline hover:text-blue-400 transition-colors">{selectedItem.email}</a>
                      </div>
                      {selectedItem.githubProfile && (
                        <div className="flex items-center gap-2 text-white/60">
                          <Github size={12} /> <a href={selectedItem.githubProfile} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400 transition-colors truncate">{selectedItem.githubProfile}</a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Project Targeted</span>
                    <div className="text-xs text-white/80 font-bold uppercase tracking-wider flex items-center gap-2 pt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      {selectedItem.projectTitle}
                      <span className="text-[8px] font-light px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-white/30 font-mono">
                        {selectedItem.projectType}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Proposal Details</span>
                    <p className="p-4 rounded-xl bg-zinc-950 border border-white/5 text-xs text-white/60 leading-relaxed whitespace-pre-line overflow-y-auto max-h-56">
                      {selectedItem.message}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-[2rem] border border-white/5 border-dashed bg-zinc-900/10 text-center text-white/20">
                <GitPullRequest className="mx-auto mb-3" size={32} />
                <p className="text-xs">Select a proposal from the list to view full contributor profiles and details.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-zinc-900 border border-white/10 p-6 md:p-8 shadow-2xl space-y-6">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Delete Proposal?</h3>
              <p className="text-xs text-white/40 leading-relaxed font-light">Are you sure you want to delete the contribution proposal from "{itemToDelete?.name}"? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Delete Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
