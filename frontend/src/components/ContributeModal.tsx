import React, { useState } from 'react';
import { X, Loader2, GitPullRequest, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectType: 'live' | 'working';
}

export default function ContributeModal({ isOpen, onClose, projectTitle, projectType }: ContributeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    githubProfile: '',
    contributionType: 'Code',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      projectTitle,
      projectType,
      contributionType: formData.contributionType,
      message: formData.message,
      githubProfile: formData.githubProfile
    };

    try {
      await api.post('/api/contributions', payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          name: '',
          email: '',
          githubProfile: '',
          contributionType: 'Code',
          message: ''
        });
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Failed to submit contribution proposal:', err);
      alert('Error submitting contribution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-lg rounded-[2.5rem] bg-zinc-900 border border-white/10 p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Glow Flare */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[80px] pointer-events-none rounded-full" />
        
        <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6 relative z-10">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <GitPullRequest size={18} className="text-blue-400 animate-pulse" />
            Contribute Proposal
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/50 hover:text-white transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 relative z-10">
            <CheckCircle2 size={48} className="text-green-400 animate-bounce" />
            <h4 className="text-lg font-bold text-white">Proposal Submitted!</h4>
            <p className="text-xs text-white/40 max-w-xs">Thank you for wanting to contribute! Your proposal has been sent successfully. I will review it and get in touch with you.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 relative z-10">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Project Name</label>
              <input
                type="text"
                disabled
                value={projectTitle}
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs text-white/50 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Contribution Type</label>
                <select
                  value={formData.contributionType}
                  onChange={(e) => setFormData({ ...formData, contributionType: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                >
                  <option value="Code">Code Development</option>
                  <option value="Design">UI/UX Design</option>
                  <option value="Documentation">Documentation</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Suggestion">Feature Suggestion</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">GitHub Profile (Optional)</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={formData.githubProfile}
                  onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Contribution Details *</label>
              <textarea
                required
                rows={4}
                placeholder="Explain what you would like to contribute, list proposed changes or draft feature ideas..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
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
                Submit Proposal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
