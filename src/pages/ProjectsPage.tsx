import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Github, Globe, Code2, Layers, Cpu, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../App';
import { cn } from '../lib/utils';

const ALL_PROJECTS = [
  {
    title: 'Adhyayan',
    description: 'Gamified learning platform leveraging Supabase for real-time progress tracking, competitive leaderboards, and interactive lesson modules.',
    tags: ['React', 'Supabase', 'Tailwind', 'Motion'],
    id: '01',
    link: '#',
    github: '#',
    category: 'Education'
  },
  {
    title: 'Meghdoot',
    description: 'Hyper-minimalist weather forecasting app focused on visual clarity and precision data delivery using OpenWeather API.',
    tags: ['React', 'API', 'Recharts'],
    id: '02',
    link: '#',
    github: '#',
    category: 'Utility'
  },
  {
    title: 'Textora',
    description: 'AI-powered content generation suite utilizing Google Gemini API for creative writing and semantic analysis.',
    tags: ['Next.js', 'AI', 'Gemini'],
    id: '03',
    link: '#',
    github: '#',
    category: 'AI/ML'
  },
  {
    title: 'P2P Ticket',
    description: 'Decentralized ticket resale marketplace on Web3, preventing scalping through smart contract enforcement.',
    tags: ['Web3', 'Solidity', 'Ethers.js'],
    id: '04',
    link: '#',
    github: '#',
    category: 'Blockchain'
  },
  {
    title: 'Digital Clock',
    description: '3D-interactive kinetic geometry clock built with creative coding principles and Three.js performance.',
    tags: ['Three.js', '3D', 'GLSL'],
    id: '05',
    link: '#',
    github: '#',
    category: 'Creative'
  },
  {
    title: 'Mobile Wallet',
    description: 'Cross-platform financial application with biometric security and real-time transaction history.',
    tags: ['Flutter', 'Firebase', 'Dart'],
    id: '06',
    link: '#',
    github: '#',
    category: 'Fintech'
  },
  {
    title: 'NeuroPath',
    description: 'Vision-based diagnostic tool using TensorFlow for early detection of neurological tremors.',
    tags: ['Python', 'TensorFlow', 'OpenCV'],
    id: '07',
    link: '#',
    github: '#',
    category: 'HealthTech'
  },
  {
     title: 'SustainaBot',
     description: 'RAG-based AI agent helping households reduce carbon footprint through personalized energy audits.',
     tags: ['LangChain', 'Python', 'OpenAI'],
     id: '08',
     link: '#',
     github: '#',
     category: 'EcoTech'
  }
];

export default function ProjectsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[150px]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back home
          </Link>
          <div className="text-xl font-display font-black tracking-tighter">
            SM<span className="text-white/40">.</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 max-w-7xl mx-auto px-6">
        <header className="mb-20">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white/80">
                <Code2 size={24} />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2 block">Archive</span>
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white">
                All Projects
              </h1>
              <p className="mt-6 text-white/40 max-w-2xl text-lg font-display font-light">
                A comprehensive collection of my technical explorations across AI, Web3, and Full-Stack Development.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative flex flex-col bg-brand-card/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 h-full"
            >
               <div className="flex justify-between items-start mb-12">
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 uppercase tracking-widest">
                    {project.category}
                  </span>
                  <div className="text-white/5 font-display text-5xl font-black group-hover:text-white/10 transition-colors">
                    {project.id}
                  </div>
               </div>

               <div className="flex-1">
                  <h3 className="text-2xl font-serif font-medium text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-8">
                    {project.description}
                  </p>
               </div>

               <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/25 uppercase tracking-widest group-hover:text-white/50 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <a href={project.link} className="p-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all">
                      <Globe size={16} />
                    </a>
                    <a href={project.github} className="p-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all">
                      <Github size={16} />
                    </a>
                    <div className="flex-1" />
                    <a href={project.link} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                      Details <ExternalLink size={10} />
                    </a>
                  </div>
               </div>

               {/* Decorative Gradient Flare */}
               <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-500/10 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
          Building the future, one pixel at a time.
        </div>
      </footer>
    </div>
  );
}
