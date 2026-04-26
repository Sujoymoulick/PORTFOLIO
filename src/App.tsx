/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';
import CertificationsPage from './pages/CertificationsPage';
import ProjectsPage from './pages/ProjectsPage';
import { 
  Github, 
  Linkedin, 

  ExternalLink, 
  ChevronDown, 
  FileDown, 
  Mail, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Cpu, 
  Globe, 
  Zap,
  Clock,
  ShieldCheck,
  ArrowRight,
  Loader2,
  X,
  MoreVertical
} from 'lucide-react';
import { cn } from './lib/utils';
import { CinematicHero } from './components/ui/cinematic-landing-hero';
import { Marquee } from './components/ui/marquee';
import { Badge } from './components/ui/badge';
import OrbitingSkills from './components/ui/orbiting-skills';
import { CardStack, CardStackItem } from './components/ui/card-stack';
import { GlobePulse } from './components/ui/cobe-globe-pulse';
import RadialOrbitalTimeline from './components/ui/radial-orbital-timeline';
import { 
  TypeTester, 
  LayoutAnimation, 
  SpeedIndicator, 
  SecurityBadge, 
  GlobalNetwork 
} from './components/ui/bento-grid-01.tsx';
import { Smartphone } from 'lucide-react';
import TechCursor from './components/ui/tech-curosr';
import { SoundButton } from './components/ui/sound-button';

import certGenAI from '../assets/certificate/Generative AI.png';
import certMongoDB from '../assets/certificate/mongodb.png';
import certSoftwareEng from '../assets/certificate/Software engineering.png';
import certCloud from '../assets/certificate/cloud computing.png';
import sujoyProfileImg from '../assets/SUJOY MOULICK.jpeg';
import resumePdf from '../assets/My_resume_2026.pdf';

// --- Loading Screen ---
const LoadingScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-lg relative">
        <GlobePulse className="w-full h-full opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
      </div>
      
      <div className="mt-12 text-center relative z-10 flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-2xl font-display font-black tracking-tighter"
        >
          SM<span className="text-white/40">.</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">
            <Loader2 className="w-3 h-3 animate-spin" />
            Initializing Portfolio
          </div>
          <div className="h-[1px] w-12 bg-white/10" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- Data Constants ---
// ... (rest of constants stay the same)

const STATS = [
  { label: 'Years of Coding', value: '2+', icon: <Clock className="w-5 h-5 text-blue-400" /> },
  { label: 'Core Projects', value: '5+', icon: <Cpu className="w-5 h-5 text-purple-400" /> },
  { label: 'YouTube Community', value: '2k+', icon: <Zap className="w-5 h-5 text-orange-400" /> },
];

const JOURNEY_TIMELINE = [
  {
    id: 1,
    title: "UEM Jaipur",
    date: "2024 - 2028",
    content: "Specializing in Artificial Intelligence and Machine Learning applications. Building a strong foundation in computer science principles.",
    category: "Education",
    icon: GraduationCap,
    relatedIds: [2],
    status: "in-progress" as const,
    energy: 85,
  },
  {
    id: 2,
    title: "ACM Chapter",
    date: "2025",
    content: "Participating in and organizing technical workshops, hackathons, and community-driven coding events.",
    category: "Community",
    icon: Globe,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 3,
    title: "Freelance",
    date: "2024 - Present",
    content: "Focused on building scalable applications using React, Node.js, and Supabase. Exploring the intersection of Web3 and AI.",
    category: "Work",
    icon: Briefcase,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 92,
  },
  {
    id: 4,
    title: "YouTube Studio",
    date: "2k+ Followers",
    content: "Curating educational content on advanced React patterns, creative coding, and the latest in AI development.",
    category: "Content",
    icon: Zap,
    relatedIds: [3],
    status: "in-progress" as const,
    energy: 75,
  },
  {
    id: 5,
    title: "Web3 Research",
    date: "Ongoing",
    content: "Deep diving into decentralized identity systems and privacy-preserving computation models.",
    category: "Future",
    icon: ShieldCheck,
    relatedIds: [3],
    status: "pending" as const,
    energy: 50,
  }
];

const CERTIFICATES: CardStackItem[] = [
  { 
    id: 'CERT-GENAI', 
    title: 'Generative AI', 
    description: 'Comprehensive understanding of Generative AI principles, applications, and model architectures.', 
    tag: 'AI/ML',
    imageSrc: certGenAI
  },
  { 
    id: 'CERT-MONGO', 
    title: 'MongoDB', 
    description: 'Database design, CRUD operations, indexing, and aggregation with MongoDB.', 
    tag: 'Database',
    imageSrc: certMongoDB
  },
  { 
    id: 'CERT-SE', 
    title: 'Software Engineering', 
    description: 'End-to-end software development lifecycle, design patterns, and engineering best practices.', 
    tag: 'Engineering',
    imageSrc: certSoftwareEng
  },
  { 
    id: 'CERT-CLOUD', 
    title: 'Cloud Computing', 
    description: 'Foundational concepts in cloud architecture, deployment models, and cloud services.', 
    tag: 'Cloud',
    imageSrc: certCloud
  }
];

const PROJECTS = [
  {
    title: 'Adhyayan',
    description: 'Gamified learning platform leveraging Supabase for real-time progress tracking.',
    tags: ['React', 'Supabase'],
    id: '01',
    link: 'https://viteadhyayan.vercel.app/',
    github: 'https://github.com/Sujoymoulick/VITEADHYAYAN',
    className: 'md:col-span-2 md:row-span-2',
    visual: <GlobalNetwork />,
    pattern: 'network'
  },
  {
    title: 'Meghdoot',
    description: 'Hyper-minimalist weather forecasting app focused on visual clarity.',
    tags: ['React', 'API'],
    id: '02',
    link: '#',
    github: 'https://github.com/Sujoymoulick/MEGHDOOT',
    className: 'md:col-span-2',
    visual: <SpeedIndicator />,
    pattern: 'speed'
  },
  {
    title: 'Textora',
    description: 'AI-powered content generation suite utilizing Google Gemini API.',
    tags: ['Next.js', 'AI'],
    id: '03',
    link: '#',
    github: 'https://github.com/Sujoymoulick/TEXTORA',
    className: 'md:col-span-2 md:row-span-2',
    visual: <TypeTester />,
    pattern: 'type'
  },
  {
    title: 'Findo',
    description: 'Innovative web application built for seamless user experience.',
    tags: ['React', 'Vite'],
    id: '04',
    link: 'https://findo-ten.vercel.app/',
    github: 'https://github.com/Sujoymoulick/Findo',
    className: 'md:col-span-2',
    visual: <SecurityBadge />,
    pattern: 'security'
  },
  {
    title: 'Digital Clock',
    description: '3D-interactive kinetic geometry clock built with creative coding.',
    tags: ['Three.js', '3D'],
    id: '05',
    link: '#',
    github: 'https://github.com/Sujoymoulick/Digital-clock',
    className: 'md:col-span-3',
    visual: <LayoutAnimation />,
    pattern: 'layout'
  },
  {
    title: 'VectorX',
    description: 'High-performance interactive web application built for speed and precision.',
    tags: ['React', 'Vite'],
    id: '06',
    link: 'https://vector-x-eight.vercel.app/',
    github: 'https://github.com/Sujoymoulick/VectorX',
    className: 'md:col-span-3',
    visual: <div className="flex items-center justify-center h-full"><Zap className="w-16 h-16 text-white" /></div>,
    pattern: 'vector'
  }
];

const TECHNOLOGIES = [
  { name: "React", color: "bg-blue-500" },
  { name: "Next.js", color: "bg-black" },
  { name: "TypeScript", color: "bg-blue-600" },
  { name: "Tailwind CSS", color: "bg-cyan-500" },
  { name: "Framer Motion", color: "bg-pink-500" },
  { name: "Radix UI", color: "bg-green-500" },
  { name: "Lucide Icons", color: "bg-orange-500" },
  { name: "shadcn/ui", color: "bg-purple-500" },
  { name: "Solidity", color: "bg-gray-700" },
  { name: "Supabase", color: "bg-emerald-500" },
  { name: "PostgreSQL", color: "bg-blue-400" },
  { name: "Three.js", color: "bg-black" },
  { name: "Node.js", color: "bg-green-600" },
  { name: "Python", color: "bg-yellow-600" },
];

// --- Hooks ---

function useWindowSize() {
  const [size, setSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// --- Components ---

export const SectionHeading = ({ children, icon: Icon, subtitle }: { children: React.ReactNode, icon: any, subtitle?: string }) => (
  <div className="mb-20">
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white/80">
          <Icon size={24} />
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
      </div>
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2 block">{subtitle}</span>
        <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white">
          <motion.span
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="inline-block"
          >
            {children}
          </motion.span>
        </h2>
      </div>
    </div>
  </div>
);

const ProjectCard = ({ project, ...props }: { project: typeof PROJECTS[0] } & React.HTMLAttributes<HTMLDivElement>) => {
  const { key, ...rest } = props as any;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: project.pattern === 'type' || project.pattern === 'network' ? 1.02 : 0.98,
        backgroundColor: "rgba(31, 31, 31, 0.8)",
        borderColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: project.pattern === 'network' ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "none"
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-white/5 p-8 flex flex-col hover:border-white/20 transition-all cursor-pointer",
        project.className
      )}
      {...rest}
    >
      <div className="flex-1 min-h-[140px]">
        {project.visual}
      </div>

      <div className={cn(
        "mt-6 relative z-10",
        project.pattern === 'network' && "bg-zinc-900/50 backdrop-blur-md rounded-xl p-4 -mx-2 mb-2"
      )}>
        <div className="flex items-center gap-2 mb-2">
          {project.tags.map(tag => (
            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/30 uppercase tracking-widest font-bold">
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-xl font-serif font-medium text-white mb-1 group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2 md:line-clamp-none">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-4">
          {project.link && project.link !== '#' && (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-white transition-all underline decoration-white/0 group-hover:decoration-white/40 underline-offset-4"
            >
              Live Demo <ExternalLink size={10} />
            </motion.a>
          )}
          {project.github && project.github !== '' && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-white transition-all underline decoration-white/0 group-hover:decoration-white/40 underline-offset-4"
            >
              GitHub <Github size={10} />
            </motion.a>
          )}
          {(!project.github && project.link === '#') && (
            <motion.a
              href={project.link}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-white transition-all underline decoration-white/0 group-hover:decoration-white/40 underline-offset-4"
            >
              Explore Case Study <ExternalLink size={10} />
            </motion.a>
          )}
        </div>
      </div>

      {/* Decorative Index */}
      <div className="absolute top-4 right-6 text-[10px] font-mono text-white/5 font-bold group-hover:text-white/10 transition-colors uppercase tracking-[0.5em]">
        Slot {project.id}
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 bg-black/20 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-display font-black tracking-tighter relative z-50"
          >
            SM<span className="text-white/40">.</span>
          </motion.div>
          
          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            {['About', 'Journey', 'Stack', 'Works', 'Certifications', 'Contact'].map(item => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4 relative z-50">
            <SoundButton />

            <div className="hidden md:block w-px h-8 bg-white/10 mx-2" />
            
            <motion.a
              href={resumePdf}
              download="My_resume_2026.pdf"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block text-[10px] font-bold uppercase tracking-widest border border-white/20 px-6 py-2.5 rounded-full text-white"
            >
              Resume
            </motion.a>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, backgroundColor: "#f0f0f0" }}
              whileTap={{ scale: 0.95 }}
              className="text-[10px] font-bold uppercase tracking-widest bg-white text-black px-6 py-2.5 rounded-full"
            >
              Let's Talk
            </motion.a>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-white/80 hover:text-white ml-2 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <MoreVertical size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center pt-20"
          >
            <div className="flex flex-col items-center gap-8 text-sm font-bold uppercase tracking-[0.3em] text-white/70">
              {['About', 'Journey', 'Stack', 'Works', 'Certifications', 'Contact'].map(item => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-white transition-colors py-2"
                >
                  {item}
                </a>
              ))}
              <div className="w-12 h-px bg-white/10 my-4" />
              <a
                href={resumePdf}
                download="My_resume_2026.pdf"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white transition-colors py-2 flex items-center gap-2"
              >
                Resume <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function Home() {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [isLoading, setIsLoading] = useState(true);
  const [formResult, setFormResult] = useState("");

  const onContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setFormResult("Sending...");
    const formData = new FormData(formElement);
    formData.append("access_key", "8f919b40-4b8b-4a00-a533-81b01d685c1d");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });

      const data = await response.json();
      if (data.success) {
        setFormResult("Successfully Sended!");
        formElement.reset();
      } else {
        console.error("Web3Forms Error:", data);
        setFormResult(data.message || "Error submitting form.");
      }
    } catch (e: any) {
      console.error("Submission Exception:", e);
      setFormResult(e?.message || "An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    // Global smooth scroll for anchor links
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href?.startsWith('#') && href.length > 1) {
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500); // 4.5 seconds for a cinematic feel
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <AnimatePresence>
        {!isLoading && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Background Mesh */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px]" />
            </div>

            <Navbar />

            <main className="relative z-10 w-full overflow-x-hidden">
        {/* Section 0: Cinematic Hero pinned section */}
        <CinematicHero />

        {/* Content Layer */}
        <div className="relative z-20">

          <section id="about" className="max-w-7xl mx-auto px-6 py-32 relative z-10 scroll-mt-24">
            <SectionHeading icon={User} subtitle="Who am I">Biographical Arc</SectionHeading>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-8">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-xl md:text-3xl text-white/80 font-display font-light leading-relaxed"
                >
                  2nd Year CSE (AI/ML) Student at UEM Jaipur. I view code as <span className="text-white italic">interactive art</span>, building AI-powered tools and Web3 experiences that bridge the gap between imagination and reality.
                </motion.p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
                  {STATS.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5 }}
                      className="p-6 rounded-2xl bg-brand-card/40 backdrop-blur-xl border border-brand-border"
                    >
                      <div className="mb-4">{stat.icon}</div>
                      <div className="text-3xl font-display font-bold mb-1">{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-widest font-semibold text-white/40">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="lg:col-span-5 relative group"
              >
                <div className="aspect-square rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-white/5 relative">
                  <img 
                    src={sujoyProfileImg} 
                    alt="Sujoy Moulick" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 object-top" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="absolute -bottom-6 -right-6 p-8 glass rounded-3xl hidden md:block"
                >
                  <div className="text-sm font-display font-medium text-white/60">Creative</div>
                  <div className="text-lg font-bold italic text-white/90">Engineer</div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          <section id="journey" className="max-w-7xl mx-auto px-6 py-32 relative z-10 scroll-mt-24">
            <SectionHeading icon={Briefcase} subtitle="Experience">Timeline & Focus</SectionHeading>
            
            <div className="relative h-[600px] w-full bg-brand-card/20 rounded-3xl border border-brand-border overflow-hidden backdrop-blur-sm">
              {/* Decorative elements */}
              <div className="absolute top-8 left-8 z-20 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Interactive Radial Trace</span>
                </div>
                <div className="text-[10px] text-white/20 italic">Select nodes to expand chronological data</div>
              </div>

              <div className="absolute bottom-8 right-8 z-20 flex flex-col items-end gap-2 text-right">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Orbiting Matrix</div>
                <div className="text-[10px] text-white/20">Click empty space to reset rotation</div>
              </div>

              <RadialOrbitalTimeline timelineData={JOURNEY_TIMELINE} />
            </div>
          </section>

          {/* Section 3: Tech Stack */}
          <section id="stack" className="max-w-7xl mx-auto px-6 py-32 relative z-10 scroll-mt-24">
            <SectionHeading icon={Cpu} subtitle="Specialization">Tech Stack</SectionHeading>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
                <OrbitingSkills />
              </div>
              
              <div className="lg:col-span-7 space-y-12 order-1 lg:order-2">
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-4xl font-display font-bold tracking-tight">Tools of the Trade</h3>
                  <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
                    I leverage a modern, performance-oriented stack to turn complex problems into seamless digital experiences. From rapid frontend prototyping to robust backend architecture and blockchain smart contracts.
                  </p>
                </div>

                <div className="space-y-6">
                  <Marquee pauseOnHover className="[--duration:20s]">
                    {TECHNOLOGIES.slice(0, 7).map((tech, i) => (
                      <Badge
                        key={tech.name}
                        className={`${tech.color} rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white border-none shadow-lg`}
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </Marquee>
                  <Marquee reverse pauseOnHover className="[--duration:25s]">
                    {TECHNOLOGIES.slice(7).map((tech, i) => (
                      <Badge
                        key={tech.name}
                        className={`${tech.color} rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white border-none shadow-lg`}
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </Marquee>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Frontend</div>
                    <div className="text-sm font-medium text-white/80">React, Next.js, Framer Motion, Tailwind, Three.js</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Backend</div>
                    <div className="text-sm font-medium text-white/80">Node.js, Supabase, PostgreSQL, Solidity</div>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* TRANSITION TO DARK ANIMATED BG ZONE */}
          <div className="relative bg-brand-bg min-h-screen overflow-hidden">
             {/* Subtle animated overlay for later sections */}
             <div className="absolute inset-0 pointer-events-none overflow-hidden">
               {/* Moving Glows */}
               <motion.div 
                 animate={{ 
                   x: [0, 100, 0], 
                   y: [0, -50, 0],
                   scale: [1, 1.2, 1]
                 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full"
               />
               <motion.div 
                 animate={{ 
                   x: [0, -100, 0], 
                   y: [0, 50, 0],
                   scale: [1, 1.1, 1]
                 }}
                 transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                 className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full"
               />
               
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[length:60px_60px]" />
               <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
             </div>

            {/* Certificates Section */}
            <section id="certifications" className="py-32 border-y border-white/5 relative z-10 bg-black/20 scroll-mt-24">
              <div className="max-w-7xl mx-auto px-6 mb-12">
                <SectionHeading icon={Award} subtitle="Validated">Certifications</SectionHeading>
              </div>
              
              <div className="max-w-5xl mx-auto px-6 flex justify-center">
                <CardStack 
                  items={CERTIFICATES} 
                  autoAdvance 
                  intervalMs={4000}
                  cardWidth={isMobile ? width - 32 : 640}
                  cardHeight={isMobile ? (width - 32) * 0.7 : 440}
                  perspectivePx={1500}
                  depthPx={isMobile ? 80 : 200}
                  spreadDeg={isMobile ? 20 : 40}
                  overlap={isMobile ? 0.6 : 0.5}
                />
              </div>

              <div className="max-w-7xl mx-auto px-6 mt-20 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    to="/certifications"
                    className="group relative flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 rounded-full font-bold text-xs uppercase tracking-widest text-white/60 hover:text-white hover:border-white/20 transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10">More Certifications</span>
                    <Award className="relative z-10 w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </section>

            {/* Work Section */}
            <section id="works" className="max-w-7xl mx-auto px-6 py-32 relative z-10 scroll-mt-24">
              <SectionHeading icon={Briefcase} subtitle="Portfolio">Selected Works</SectionHeading>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 auto-rows-[420px] md:auto-rows-[380px]">
                {PROJECTS.map((project, i) => (
                  <ProjectCard key={i} project={project} />
                ))}
                
                {/* View More Projects Button */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-6 flex justify-center mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <Link 
                      to="/projects"
                      className="group relative flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 rounded-full font-bold text-xs uppercase tracking-widest text-white/60 hover:text-white hover:border-white/20 transition-all overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative z-10">View More Projects</span>
                      <Briefcase className="relative z-10 w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="max-w-7xl mx-auto px-6 py-32 relative z-10 scroll-mt-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div>
                  <SectionHeading icon={Mail} subtitle="Connect">Get in Touch</SectionHeading>
                  <p className="text-xl text-white/60 font-display font-light leading-relaxed mb-12">
                    Have a vision you'd like to bring to life? Whether it's a decentralized platform or an AI integration, let's build something beautiful.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-white hover:text-white transition-colors">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <Mail size={20} className="text-white/40" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Email</div>
                        <div className="font-display font-medium">sujoymoulick05@gmail.com</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 pt-8">
                      {[
                        { icon: <Github size={24} />, href: "https://github.com/Sujoymoulick" },
                        { icon: <Linkedin size={24} />, href: "https://www.linkedin.com/in/sujoymoulick/" }
                      ].map((social, i) => (
                        <motion.a 
                          key={i}
                          href={social.href}
                          whileHover={{ scale: 1.2, color: '#FFFFFF' }}
                          className="text-white/20 transition-colors"
                        >
                          {social.icon}
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-8 md:p-12 rounded-3xl bg-brand-card/80 backdrop-blur-xl border border-white/10 shadow-2xl"
                >
                  <form className="space-y-6" onSubmit={onContactSubmit}>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        placeholder="Enter your name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        placeholder="name@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Message</label>
                      <textarea 
                        rows={4}
                        name="message"
                        required
                        placeholder="Tell me about your project..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10 resize-none"
                      ></textarea>
                    </div>
                    <motion.button
                      type="submit"
                      disabled={formResult === "Sending..."}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-5 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formResult === "Sending..." ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Message"}
                    </motion.button>
                    {formResult && formResult !== "Sending..." && (
                      <p className={`text-center text-[10px] font-bold uppercase tracking-[0.2em] mt-4 ${formResult.includes("Error") || formResult.includes("occurred") ? "text-red-400" : "text-green-400"}`}>
                        {formResult}
                      </p>
                    )}
                  </form>
                </motion.div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
          © 2026 Sujoy Moulick. Built with React & Motion.
        </div>
        <div className="flex gap-8 text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Credits</a>
        </div>
      </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TechCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
