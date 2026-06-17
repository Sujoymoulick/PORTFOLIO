import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Globe, Code2, Cpu, Rocket, Heart, ArrowRight } from 'lucide-react';
import { SEO } from '../components/ui/SEO';

const LIVE_PROJECTS = [
  {
    title: 'FuncPilot',
    badge: '🚀 FuncPilot',
    link: 'https://sujoymoulick.github.io/FuncPilot/',
    description: 'An advanced automation and command assistant helping developers write, locate, and execute functions efficiently using natural language interactions.',
    tags: ['AI Agent', 'TypeScript', 'CLI Tool'],
    color: 'from-zinc-800 to-zinc-950',
    badgeColor: '#0A0A0A',
    shadowColor: 'rgba(255,255,255,0.05)'
  },
  {
    title: 'README Smith',
    badge: '📘 README Smith',
    link: 'https://readmesmith-beta.vercel.app/',
    description: 'An interactive beta markdown compiler and template builder that helps developers craft polished, high-quality, standardized repository READMEs in minutes.',
    tags: ['Next.js', 'React', 'Markdown'],
    color: 'from-blue-600/20 to-blue-950/20',
    badgeColor: '#2563EB',
    shadowColor: 'rgba(37,99,235,0.1)'
  },
  {
    title: 'Listing Expert',
    badge: '🧩 Listing Expert',
    link: 'https://sujoymoulick.github.io/Chrome-Extension-Listing-Expert/',
    description: 'A Chrome Web Store optimization toolkit helping extension developers draft privacy policies, generate formatting, and structure listings for success.',
    tags: ['Chrome API', 'Vanilla JS', 'SEO Utility'],
    color: 'from-orange-600/20 to-orange-950/20',
    badgeColor: '#FF6B00',
    shadowColor: 'rgba(255,107,0,0.1)'
  },
  {
    title: 'EchoToDo',
    badge: '🎤 EchoToDo',
    link: 'https://sujoymoulick.github.io/EchoToDo-documentation/',
    description: 'Speech-to-text task tracker and productivity dashboard featuring voice commands, note transcripts, and automated todo lists.',
    tags: ['Voice API', 'React', 'Productivity'],
    color: 'from-purple-600/20 to-purple-950/20',
    badgeColor: '#7C3AED',
    shadowColor: 'rgba(124,58,237,0.1)'
  },
  {
    title: 'ChangeOrbit',
    badge: '🪐 ChangeOrbit',
    link: 'https://sujoymoulick.github.io/ChangeOrbit/',
    description: 'A mathematical physics simulator demonstrating celestial bodies, orbit calculations, dynamic trajectories, and geometric canvas animations.',
    tags: ['HTML5 Canvas', 'Physics Engine', 'Math JS'],
    color: 'from-teal-600/20 to-teal-950/20',
    badgeColor: '#14B8A6',
    shadowColor: 'rgba(20,184,166,0.1)'
  },
  {
    title: 'Weblixio',
    badge: '🌐 Weblixio',
    link: 'https://sujoymoulick.github.io/weblixio/',
    description: 'A sleek workspace optimizer and browser extension providing custom tab shortcuts, clean reading views, and workspace shortcuts.',
    tags: ['WebExtensions', 'Firefox', 'Productivity'],
    color: 'from-rose-600/20 to-rose-950/20',
    badgeColor: '#E11D48',
    shadowColor: 'rgba(225,29,72,0.1)'
  }
];

export default function LiveProjectsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <SEO 
        title="Live Projects" 
        description="Explore live open-source web applications, extensions, and AI tools built by Sujoy Moulick." 
        slug="live-projects"
      />

      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-25">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[150px]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back home
            </Link>
            <div className="w-px h-3 bg-white/10" />
            <Link to="/blog" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all">
              Blog
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
                <Rocket size={24} className="text-blue-400" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mt-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2 block">Interactive Software</span>
                <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter text-white">
                  Live Projects
                </h1>
              </div>
              <p className="text-white/40 text-lg font-display font-light leading-relaxed max-w-lg">
                A selection of live open-source web projects, experimental physics simulations, browser utilities, and automation apps hosted online.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LIVE_PROJECTS.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ 
                y: -6,
                borderColor: 'rgba(255, 255, 255, 0.15)',
                boxShadow: `0 20px 40px -15px ${project.shadowColor}`
              }}
              className={`group flex flex-col justify-between p-8 rounded-3xl bg-gradient-to-br ${project.color} border border-white/5 backdrop-blur-xl transition-all duration-500`}
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  {/* Badge mimicking the user's shield badges */}
                  <span 
                    style={{ backgroundColor: project.badgeColor }}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white shadow-md border border-white/15"
                  >
                    {project.badge}
                  </span>
                  
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:border-white/15 transition-all"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                <h3 className="text-2xl font-serif font-medium text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-white/50 text-sm leading-relaxed mb-6 font-display font-light">
                  {project.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-[9px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 uppercase tracking-widest font-bold font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400 group-hover:text-white transition-colors"
                >
                  Launch App <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="py-20 border-t border-white/5 text-center relative z-10">
        <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
          © 2026 Sujoy Moulick. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
