import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  Calendar, 
  Github, 
  ExternalLink,
  GitPullRequest,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const formatCurrency = (val: number, cur: string) => {
  const locale = cur === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: cur || 'USD',
    maximumFractionDigits: 0
  }).format(val);
};

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    projectName: '',
    clientId: '',
    description: '',
    technology: '',
    budget: '',
    currency: 'USD',
    status: 'Planning',
    priority: 'Medium',
    progress: '0',
    startDate: '',
    deadline: '',
    githubLink: '',
    liveUrl: '',
    notes: ''
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const projData = await api.get(`/api/projects?search=${encodeURIComponent(search)}&status=${statusFilter}`);
      
      // Load active clients for select options
      const clientData = await api.get('/api/clients?limit=100');
      
      // Apply priority filter client-side if selected
      let filteredProj = projData;
      if (priorityFilter) {
        filteredProj = projData.filter((p: any) => p.priority === priorityFilter);
      }

      setProjects(filteredProj);
      setClients(clientData.clients || []);
    } catch (err) {
      console.error('Failed to load project records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, priorityFilter]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({
      projectName: '',
      clientId: clients[0]?._id || '',
      description: '',
      technology: '',
      budget: '',
      currency: 'USD',
      status: 'Planning',
      priority: 'Medium',
      progress: '0',
      startDate: '',
      deadline: '',
      githubLink: '',
      liveUrl: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: any) => {
    setModalMode('edit');
    setSelectedProject(project);
    setFormData({
      projectName: project.projectName || '',
      clientId: project.clientId || '',
      description: project.description || '',
      technology: Array.isArray(project.technology) ? project.technology.join(', ') : '',
      budget: project.budget?.toString() || '',
      currency: project.currency || 'USD',
      status: project.status || 'Planning',
      priority: project.priority || 'Medium',
      progress: project.progress?.toString() || '0',
      startDate: project.startDate || '',
      deadline: project.deadline || '',
      githubLink: project.githubLink || '',
      liveUrl: project.liveUrl || '',
      notes: project.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName) return;

    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await api.post('/api/projects', formData);
      } else {
        await api.put(`/api/projects/${selectedProject._id}`, formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Error updating project records.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (project: any) => {
    setProjectToDelete(project);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setSubmitting(true);
    try {
      await api.delete(`/api/projects/${projectToDelete._id}`);
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
      loadData();
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('Failed to archive project.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Active': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Revision': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-black text-white">Project Tracker</h2>
          <p className="text-xs text-white/40 font-light mt-1">Track deliverables, priority statuses, budget billing and deadlines.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <Plus size={14} /> Add Project
        </button>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search projects, technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/5 focus:border-blue-500/35 rounded-xl text-xs text-white/80 focus:outline-none"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-zinc-900 border border-white/5 focus:border-blue-500/35 rounded-xl text-xs text-white/60 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="Revision">Revision</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-3 bg-zinc-900 border border-white/5 focus:border-blue-500/35 rounded-xl text-xs text-white/60 focus:outline-none"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Projects Cards Layout */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white/5 border border-white/5 rounded-3xl animate-pulse p-6"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-3xl border border-white/5 p-16 text-center bg-zinc-900/20 text-white/40">
          <Briefcase size={36} className="mx-auto text-white/10 mb-4" />
          No projects currently found. Click "Add Project" to launch a campaign.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project._id} 
              className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between backdrop-blur-sm group"
            >
              <div>
                {/* Header title & options */}
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{project.projectName}</h4>
                    <p className="text-[10px] text-white/40 mt-0.5">{project.clientDetails?.name || 'Self/No Client'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenEdit(project)}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/60 hover:text-white transition-colors"
                    >
                      <Edit2 size={10} />
                    </button>
                    <button 
                      onClick={() => handleOpenDelete(project)}
                      className="p-1.5 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-white/60 line-clamp-3 mb-4 font-light leading-relaxed">
                  {project.description || 'No description provided.'}
                </p>

                {/* Tech Pills */}
                {project.technology && project.technology.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technology.map((tech: string) => (
                      <span key={tech} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-white/50 uppercase font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {/* Progress Bar */}
                <div className="mb-4 space-y-1">
                  <div className="flex justify-between text-[9px] uppercase font-bold tracking-wider text-white/40">
                    <span>Task Completion</span>
                    <span className="text-white/80">{project.progress || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Project Status badges and values */}
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="flex gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white">
                      {formatCurrency(project.budget || 0, project.currency)}
                    </span>
                  </div>
                </div>

                {/* Project Links & Deadline */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-light">
                  <div className="flex items-center gap-1">
                    <Calendar size={10} className="text-white/30" />
                    <span>Due {project.deadline || 'No Date'}</span>
                  </div>
                  <div className="flex gap-3">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        <Github size={12} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl p-8 rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-display font-black text-white mb-6">
              {modalMode === 'create' ? 'Add New Project' : 'Edit Project Details'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Client Relationship</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  >
                    <option value="">No Client (Self / Internal)</option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} {c.company && `(${c.company})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Project Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Budget *</label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Progress Completion %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Project Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="Revision">Revision</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Technologies (comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, Tailwind, Node.js"
                    value={formData.technology}
                    onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">GitHub Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Live URL</label>
                  <input
                    type="url"
                    placeholder="https://liveproject.com"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Private Notes</label>
                <textarea
                  rows={2}
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
                  {modalMode === 'create' ? 'Create Project' : 'Save Changes'}
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
            <h3 className="text-lg font-display font-black text-white mb-2">Archive Project</h3>
            <p className="text-xs text-white/40 font-light mb-6">
              Are you sure you want to archive <span className="text-white font-bold">{projectToDelete?.projectName}</span>? This will archive the project records.
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
                Archive Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
