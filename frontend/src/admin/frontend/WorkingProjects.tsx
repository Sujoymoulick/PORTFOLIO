import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { 
  Rocket, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  ExternalLink, 
  Github, 
  Sliders, 
  CheckCircle2, 
  CircleDot
} from 'lucide-react';

export default function WorkingProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Fullstack',
    tagsString: '',
    progress: '10',
    status: 'In Progress',
    githubLink: '',
    liveUrl: ''
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/working-projects');
      
      let filtered = data;
      if (search.trim()) {
        filtered = filtered.filter((p: any) => 
          p.title.toLowerCase().includes(search.toLowerCase()) || 
          p.description.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (statusFilter) {
        filtered = filtered.filter((p: any) => p.status === statusFilter);
      }

      setProjects(filtered);
    } catch (err) {
      console.error('Failed to load working projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({
      title: '',
      description: '',
      category: 'Fullstack',
      tagsString: '',
      progress: '10',
      status: 'In Progress',
      githubLink: '',
      liveUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: any) => {
    setModalMode('edit');
    setSelectedProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      category: project.category || 'Fullstack',
      tagsString: (project.tags || []).join(', '),
      progress: String(project.progress || 0),
      status: project.status || 'In Progress',
      githubLink: project.githubLink || '',
      liveUrl: project.liveUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (project: any) => {
    setProjectToDelete(project);
    setDeleteConfirmOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: formData.tagsString.split(',').map(t => t.trim()).filter(Boolean),
      progress: parseInt(formData.progress) || 0,
      status: formData.status,
      githubLink: formData.githubLink,
      liveUrl: formData.liveUrl
    };

    try {
      if (modalMode === 'create') {
        await api.post('/api/working-projects', payload);
      } else {
        await api.put(`/api/working-projects/${selectedProject._id}`, payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Error saving project records.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/api/working-projects/${projectToDelete._id}`);
      setDeleteConfirmOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('Error deleting project records.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-black text-white">Current Working Projects</h2>
          <p className="text-xs text-white/40 font-light mt-1">Manage public working logs, ongoing developments, and experimental software progress.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <Plus size={14} /> Add Project Log
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search projects..."
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
            <option value="Researching">Researching</option>
            <option value="In Progress">In Progress</option>
            <option value="Near Completion">Near Completion</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/30">
          <Loader2 className="animate-spin mb-4" />
          <span className="text-xs font-mono uppercase tracking-widest">Loading Logs...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center border border-white/5 bg-zinc-900/10 rounded-[2rem] text-white/30">
          <Rocket className="mx-auto text-white/10 mb-4" size={40} />
          <p className="text-sm">No current working projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project._id}
              className="p-6 rounded-[2rem] bg-zinc-900/30 border border-white/5 hover:border-white/10 flex flex-col justify-between h-64 backdrop-blur-md relative overflow-hidden group transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase tracking-widest">
                    {project.category}
                  </span>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(project)}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(project)}
                      className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                  {project.title}
                </h3>
                <p className="text-xs text-white/40 leading-relaxed mt-2 line-clamp-3">
                  {project.description}
                </p>
              </div>

              <div className="space-y-4">
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono font-bold">
                    <span className="text-white/40 flex items-center gap-1.5 uppercase tracking-wider">
                      <CircleDot size={10} className="text-blue-500 animate-pulse" /> {project.status}
                    </span>
                    <span className="text-blue-400">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer links */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="flex flex-wrap gap-1 max-w-[60%] truncate">
                    {(project.tags || []).map((t: string) => (
                      <span key={t} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-white/30 uppercase tracking-widest">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex-1" />
                  {project.githubLink && (
                    <a href={project.githubLink} className="text-white/40 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                      <Github size={14} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} className="text-white/40 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-[2rem] bg-zinc-900 border border-white/10 p-6 md:p-8 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Rocket size={18} className="text-blue-500 animate-pulse" />
                {modalMode === 'create' ? 'Create Project Log' : 'Edit Project Log'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  >
                    <option value="AI/ML">AI/ML</option>
                    <option value="Fullstack">Fullstack</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Extension">Extension</option>
                    <option value="Creative">Creative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  >
                    <option value="Researching">Researching</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Near Completion">Near Completion</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Progress (0-100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Technologies (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, Golang, Web3"
                    value={formData.tagsString}
                    onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Live Demo URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {modalMode === 'create' ? 'Create Log' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-zinc-900 border border-white/10 p-6 md:p-8 shadow-2xl space-y-6">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Delete Project Log?</h3>
              <p className="text-xs text-white/40 leading-relaxed font-light">Are you sure you want to delete the log for "{projectToDelete?.title}"? This action soft-deletes the record and removes it from the public portfolio.</p>
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
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
