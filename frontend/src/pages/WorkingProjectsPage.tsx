import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Globe, Github, Code2, Cpu, Wrench, Heart, ArrowRight, X, GitPullRequest } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { api } from '../lib/api';
import ContributeModal from '../components/ContributeModal';

export default function WorkingProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [contributeOpen, setContributeOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await api.get('/api/working-projects');
        setProjects(data);
      } catch (err) {
        console.error('Failed to load working projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <SEO 
        title="Working Projects" 
        description="Monitor ongoing coding experiments, personal SaaS projects, and active development logs." 
        slug="working-projects"
      />

      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-25">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[150px]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back home
            </Link>
            <div className="w-px h-3 bg-white/10" />
            <Link to="/live-projects" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all">
              Live Apps
            </Link>
          </div>
          <div className="text-xl font-display font-black tracking-tighter">
            SM<span className="text-white/40">.</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-32 max-w-7xl mx-auto px-6">
        <header className="mb-24">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white/80">
                <Wrench size={24} className="text-blue-400" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mt-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2 block">Ongoing Experiments</span>
                <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter text-white">
                  Working Logs
                </h1>
              </div>
              <p className="text-white/40 text-lg font-display font-light leading-relaxed max-w-lg">
                Follow along with my active side projects, experimental tools in research phases, and progress metrics tracked directly from my workspace.
              </p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-white/35">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-mono uppercase tracking-widest">Syncing Active Logs...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-16 text-center border border-white/5 bg-zinc-900/10 rounded-[2.5rem] text-white/30 max-w-xl mx-auto">
            <Wrench className="mx-auto text-white/10 mb-4" size={48} />
            <h3 className="text-lg font-bold text-white mb-2">Logs are Offline</h3>
            <p className="text-xs leading-relaxed max-w-xs mx-auto">I'm currently consolidating my workspace logs. Check back soon for active updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ 
                  y: -6,
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 20px 40px -15px rgba(59, 130, 246, 0.05)'
                }}
                onClick={() => setSelectedProject(project)}
                className="group flex flex-col justify-between p-8 rounded-3xl bg-zinc-900/20 border border-white/5 hover:border-white/15 backdrop-blur-xl transition-all duration-500 h-64 cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold uppercase tracking-wider text-blue-400">
                      {project.category}
                    </span>
                    <div className="flex gap-2">
                      {project.githubLink && (
                        <a 
                          href={project.githubLink} 
                          onClick={(e) => e.stopPropagation()} 
                          className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:border-white/15 transition-all" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Github size={14} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          onClick={(e) => e.stopPropagation()} 
                          className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:border-white/15 transition-all" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Globe size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-serif font-medium text-white mb-2 group-hover:text-blue-400 transition-colors truncate">
                    {project.title}
                  </h3>
                  <p className="text-white/45 text-xs leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Realtime progress tracker */}
                  <div className="space-y-1.5 mb-2">
                    <div className="flex justify-between text-[9px] font-mono font-bold">
                      <span className="text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        {project.status}
                      </span>
                      <span className="text-blue-400">{project.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal Overlay */}
      {selectedProject && (
        <div 
          onClick={() => setSelectedProject(null)} 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-2xl rounded-[2.5rem] bg-zinc-900/90 border border-white/10 p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col md:flex-row gap-8 max-h-[90vh]"
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 text-white/50 hover:text-white transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Left Content Side */}
            <div className="flex-1 space-y-6 overflow-y-auto pr-2">
              <div>
                <span className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-mono font-bold uppercase tracking-wider text-blue-400 inline-block mb-3">
                  {selectedProject.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-medium text-white leading-tight">
                  {selectedProject.title}
                </h2>
                <span className="text-[10px] text-white/30 font-mono block mt-2">
                  LOGGED: {new Date(selectedProject.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Description & Context</h4>
                <p className="text-xs text-white/60 leading-relaxed font-light whitespace-pre-line">
                  {selectedProject.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                {selectedProject.githubLink && (
                  <a 
                    href={selectedProject.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 text-xs text-white/70 hover:text-white font-medium transition-all"
                  >
                    <Github size={14} /> Repository Code
                  </a>
                )}
                {selectedProject.liveUrl && (
                  <a 
                    href={selectedProject.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30 text-xs text-blue-400 hover:text-blue-300 font-medium transition-all"
                  >
                    <Globe size={14} /> Launch Application
                  </a>
                )}
                <button
                  onClick={() => setContributeOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 hover:border-green-500/30 text-xs text-green-400 hover:text-green-300 font-medium transition-all cursor-pointer"
                >
                  <GitPullRequest size={14} /> Contribute
                </button>
              </div>
            </div>

            {/* Right Progress & Status Side */}
            <div className="w-full md:w-56 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Status Tracker</h4>
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/80 mt-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                    {selectedProject.status}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono font-bold">
                    <span className="text-white/40 uppercase tracking-widest">Progress</span>
                    <span className="text-blue-400">{selectedProject.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${selectedProject.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tech Stack</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(selectedProject.tags || []).map((t: string) => (
                    <span 
                      key={t} 
                      className="text-[9px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-white/50 uppercase font-mono font-bold tracking-wider"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Glow Flare */}
            <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-blue-500/10 blur-[80px] pointer-events-none rounded-full" />
          </div>
        </div>
      )}

      {selectedProject && (
        <ContributeModal 
          isOpen={contributeOpen} 
          onClose={() => setContributeOpen(false)} 
          projectTitle={selectedProject.title} 
          projectType="working" 
        />
      )}

      <footer className="py-20 border-t border-white/5 text-center relative z-10">
        <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
          © 2026 Sujoy Moulick. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
