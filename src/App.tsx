/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { motion, AnimatePresence } from 'motion/react';
import { Link, BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import CertificationsPage from './pages/CertificationsPage';
import ProjectsPage from './pages/ProjectsPage';
import LiveProjectsPage from './pages/LiveProjectsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import DisclaimerPage from './pages/DisclaimerPage';
import ContactPage from './pages/ContactPage';
import { Suspense, lazy } from 'react';

const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

import { 
  Github, 
  Linkedin, 
  Twitter,
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
  MoreVertical,
  TrendingUp,
  ChevronRight,
  BookOpen
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
import TechCursor from './components/ui/tech-curosr';
import { SoundButton } from './components/ui/sound-button';
import { BLOG_POSTS } from './data/blogData';

import certGenAI from '../assets/certificate/Generative AI.png';
import certMongoDB from '../assets/certificate/mongodb.png';
import certSoftwareEng from '../assets/certificate/Software engineering.png';
import certCloud from '../assets/certificate/cloud computing.png';
import sujoyProfileImg from '../assets/SUJOY MOULICK.jpeg';
import resumePdf from '../assets/My_resume_2026.pdf';

// --- Scroll To Top Utility ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

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
            Initializing Platform
          </div>
          <div className="h-[1px] w-12 bg-white/10" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- Data Constants ---
const STATS = [
  { label: 'Years of Coding', value: '2+', icon: <Clock className="w-5 h-5 text-blue-400" /> },
  { label: 'Core Projects', value: '10+', icon: <Cpu className="w-5 h-5 text-purple-400" /> },
  { label: 'Articles Written', value: '15+', icon: <Zap className="w-5 h-5 text-orange-400" /> },
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
        </div>
      </div>

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
          <Link 
            to="/" 
            className="text-2xl font-display font-black tracking-tighter relative z-50"
          >
            SM<span className="text-white/40">.</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            {['About', 'Journey', 'Stack'].map(item => (
              <a 
                key={item} 
                href={`/#${item.toLowerCase()}`}
                className="hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}

            {/* Works Hover Dropdown */}
            <div className="relative group py-2">
              <span className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                Works <ChevronDown size={10} className="group-hover:rotate-180 transition-transform duration-300 text-white/40" />
              </span>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 rounded-2xl bg-black/90 border border-white/10 backdrop-blur-md p-2 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                <a 
                  href="/#works" 
                  className="block px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-[9px] font-bold uppercase tracking-widest text-center"
                >
                  Featured Works
                </a>
                <Link 
                  to="/live-projects" 
                  className="block px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-[9px] font-bold uppercase tracking-widest text-center"
                >
                  Live Projects
                </Link>
              </div>
            </div>

            <a href="/#certifications" className="hover:text-white transition-colors">Certifications</a>

            {/* Contact Hover Dropdown */}
            <div className="relative group py-2">
              <span className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                Contact <ChevronDown size={10} className="group-hover:rotate-180 transition-transform duration-300 text-white/40" />
              </span>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 rounded-2xl bg-black/90 border border-white/10 backdrop-blur-md p-2 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                <Link 
                  to="/contact" 
                  className="block px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-[9px] font-bold uppercase tracking-widest text-center"
                >
                  Contact Form
                </Link>
                <Link 
                  to="/#linkedin-feed" 
                  className="block px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-[9px] font-bold uppercase tracking-widest text-center"
                >
                  LinkedIn Posts
                </Link>
              </div>
            </div>

            <Link to="/blog" className="hover:text-white transition-colors text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px]">Blog</Link>
          </div>
          
          <div className="flex items-center gap-4 relative z-50">
            <SoundButton />
            <div className="hidden md:block w-px h-8 bg-white/10 mx-2" />
            
            <motion.a
              href={resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block text-[10px] font-bold uppercase tracking-widest border border-white/20 px-6 py-2.5 rounded-full text-white"
            >
              Resume
            </motion.a>

            <Link
              to="/contact"
              className="text-[10px] font-bold uppercase tracking-widest bg-white text-black px-6 py-2.5 rounded-full hover:scale-105 transition-transform"
            >
              Let's Talk
            </Link>

            <button 
              className="md:hidden text-white/80 hover:text-white ml-2 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <MoreVertical size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center pt-20"
          >
            <div className="flex flex-col items-center gap-8 text-sm font-bold uppercase tracking-[0.3em] text-white/70">
              {['About', 'Journey', 'Stack'].map(item => (
                <Link 
                  key={item} 
                  to={`/#${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-white transition-colors py-2"
                >
                  {item}
                </Link>
              ))}

              {/* Mobile Works Sub-Items */}
              <div className="flex flex-col items-center gap-4 py-2 border-y border-white/5 w-full">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Works</span>
                <Link 
                  to="/#works" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-white text-white/70 transition-colors py-1 text-xs"
                >
                  Featured Works
                </Link>
                <Link 
                  to="/live-projects" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-white text-white/70 transition-colors py-1 text-xs"
                >
                  Live Projects
                </Link>
              </div>

              <Link 
                to="/#certifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white transition-colors py-2"
              >
                Certifications
              </Link>
              
              {/* Mobile Contact Sub-Items */}
              <div className="flex flex-col items-center gap-4 py-2 border-y border-white/5 w-full">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Contact</span>
                <Link 
                  to="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-white text-white/70 transition-colors py-1 text-xs"
                >
                  Contact Form
                </Link>
                <Link 
                  to="/#linkedin-feed" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-white text-white/70 transition-colors py-1 text-xs"
                >
                  LinkedIn Posts
                </Link>
              </div>

              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 text-blue-400">Blog</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const LinkedInWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://widgets.sociablekit.com/linkedin-profile-posts/widget.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="sk-ww-linkedin-profile-post" data-embed-id="25690270"></div>
  );
};

function Home() {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [isLoading, setIsLoading] = useState(() => !sessionStorage.getItem('sm_site_loaded'));

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('sm_site_loaded', 'true');
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, []);

  const featuredPosts = BLOG_POSTS.slice(0, 3);

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
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px]" />
            </div>

            <Navbar />

            <main className="relative z-10 w-full overflow-x-hidden">
              <CinematicHero />

              <div className="relative z-20">
                <section id="about" className="max-w-7xl mx-auto px-6 py-32 relative z-10 scroll-mt-24">
                  <SectionHeading icon={User} subtitle="Who am I">Biographical Arc</SectionHeading>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-8">
                      <motion.p className="text-xl md:text-3xl text-white/80 font-display font-light leading-relaxed">
                        2nd Year CSE (AI/ML) Student at UEM Jaipur. I view code as <span className="text-white italic">interactive art</span>, building AI-powered tools and Web3 experiences.
                      </motion.p>
                      <motion.p className="text-base md:text-lg text-white/50 font-display font-light leading-relaxed">
                        Beyond AI, I design and build highly performant web architectures, combining full-stack technologies with modern UI animations. I also bridge engineering and growth by leveraging search engine optimization (SEO), digital marketing analytics, and content distribution to make sure high-value technical products get in front of the right audience.
                      </motion.p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
                        {STATS.map((stat, i) => (
                          <div key={i} className="p-6 rounded-2xl bg-brand-card/40 backdrop-blur-xl border border-brand-border">
                            <div className="mb-4">{stat.icon}</div>
                            <div className="text-3xl font-display font-bold mb-1">{stat.value}</div>
                            <div className="text-[10px] uppercase tracking-widest font-semibold text-white/40">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="lg:col-span-5 relative group">
                      <div className="aspect-square rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-white/5 relative">
                        <img src={sujoyProfileImg} alt="Sujoy Moulick" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 object-top" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Featured Blog Posts Section */}
                <section className="max-w-7xl mx-auto px-6 py-32 relative z-10">
                   <SectionHeading icon={TrendingUp} subtitle="Knowledge Share">Featured Articles</SectionHeading>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {featuredPosts.map((post, i) => (
                       <Link key={i} to={`/blog/${post.slug}`} className="group relative flex flex-col bg-brand-card/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-all">
                         <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">{post.category}</div>
                         <h3 className="text-xl font-display font-bold mb-4 group-hover:text-blue-400 transition-colors line-clamp-2">{post.title}</h3>
                         <p className="text-white/40 text-sm line-clamp-3 mb-6 flex-1">{post.description}</p>
                         <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">
                           Read Article <ChevronRight size={14} />
                         </div>
                       </Link>
                     ))}
                   </div>
                   <div className="flex justify-center mt-12">
                     <Link to="/blog" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                       View All Articles
                     </Link>
                   </div>
                </section>

                <section id="journey" className="max-w-7xl mx-auto px-6 py-32 relative z-10 scroll-mt-24">
                  <SectionHeading icon={Briefcase} subtitle="Experience">Timeline & Focus</SectionHeading>
                  <div className="relative h-[600px] w-full bg-brand-card/20 rounded-3xl border border-brand-border overflow-hidden backdrop-blur-sm">
                    <RadialOrbitalTimeline timelineData={JOURNEY_TIMELINE} />
                  </div>
                </section>

                <section id="works" className="max-w-7xl mx-auto px-6 py-32 relative z-10 scroll-mt-24">
                  <SectionHeading icon={Briefcase} subtitle="Portfolio">Selected Works</SectionHeading>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 auto-rows-[380px]">
                    {PROJECTS.map((project, i) => (
                      <ProjectCard key={i} project={project} />
                    ))}
                  </div>
                 </section>

                 <section id="stack" className="max-w-7xl mx-auto px-6 py-32 relative z-10 scroll-mt-24">
                   <SectionHeading icon={Cpu} subtitle="Technologies">My Tech Stack</SectionHeading>
                   <div className="space-y-8">
                     <Marquee pauseOnHover className="[--duration:30s]">
                       {TECHNOLOGIES.map((tech, i) => (
                         <div key={i} className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                           <div className={`w-2 h-2 rounded-full ${tech.color}`} />
                           <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">{tech.name}</span>
                         </div>
                       ))}
                     </Marquee>
                     <Marquee pauseOnHover reverse className="[--duration:25s]">
                       {[...TECHNOLOGIES].reverse().map((tech, i) => (
                         <div key={i} className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                           <div className={`w-2 h-2 rounded-full ${tech.color}`} />
                           <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">{tech.name}</span>
                         </div>
                       ))}
                     </Marquee>
                     <div className="relative h-[500px] w-full bg-brand-card/20 rounded-3xl border border-brand-border overflow-hidden backdrop-blur-sm mt-12">
                       <OrbitingSkills />
                     </div>
                   </div>
                 </section>

                 <section id="certifications" className="max-w-7xl mx-auto px-6 py-32 relative z-10 scroll-mt-24">
                   <SectionHeading icon={Award} subtitle="Credentials">Certifications</SectionHeading>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div>
                       <p className="text-xl text-white/50 font-display font-light leading-relaxed mb-8">
                         A curated set of credentials across AI, Cloud, and Software Engineering — validating depth of knowledge across the stack.
                       </p>
                       <Link to="/certifications" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors border border-white/10 px-6 py-3 rounded-full hover:border-white/30">
                         View All Certifications <ArrowRight size={12} />
                       </Link>
                     </div>
                     <div className="flex justify-center items-center h-[340px] md:h-[420px]">
                       <CardStack items={CERTIFICATES} />
                     </div>
                   </div>
                 </section>

                 {/* LinkedIn Posts Section */}
                 <section id="linkedin-feed" className="max-w-7xl mx-auto px-6 py-32 relative z-10 scroll-mt-24">
                    <SectionHeading icon={Linkedin} subtitle="Social Feed">LinkedIn Posts</SectionHeading>
                    <div className="w-full bg-zinc-900/30 backdrop-blur-sm rounded-3xl border border-white/5 p-4 md:p-8 max-h-[800px] overflow-y-auto overflow-x-hidden scrollbar-thin">
                      <LinkedInWidget />
                    </div>
                 </section>

                {/* Newsletter Section */}
                <section className="max-w-7xl mx-auto px-6 py-32 relative z-10">
                  <div className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 backdrop-blur-xl text-center">
                    <div className="inline-block p-4 rounded-2xl bg-white/5 border border-white/10 mb-8">
                      <Mail size={32} className="text-blue-400" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-6">Stay in the <span className="text-white/40 italic">Loop</span>.</h2>
                    <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto font-display font-light">
                      Get the latest engineering notes, AI research, and Web3 insights delivered straight to your inbox. No spam, just pure technical value.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                      <input type="email" placeholder="Enter your email" className="flex-1 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors" />
                      <button className="px-10 py-5 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
                        Subscribe
                      </button>
                    </form>
                  </div>
                </section>
              </div>
            </main>

            <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                <div className="md:col-span-2">
                   <div className="text-2xl font-display font-black tracking-tighter mb-6">SM<span className="text-white/40">.</span></div>
                   <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                     A digital space dedicated to building high-value content at the intersection of AI, Web3, and Software Engineering.
                   </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6">Explore</h4>
                  <ul className="space-y-4 text-xs text-white/30 font-bold uppercase tracking-widest">
                    <li><Link to="/#about" className="hover:text-white transition-colors">About</Link></li>
                    <li><Link to="/blog" className="hover:text-white transition-colors text-blue-400">Blog</Link></li>
                    <li><Link to="/projects" className="hover:text-white transition-colors">Projects</Link></li>
                    <li><Link to="/live-projects" className="hover:text-white transition-colors text-blue-400">Live Projects</Link></li>
                    <li><Link to="/contact" className="hover:text-white transition-colors">Contact Form</Link></li>
                    <li><Link to="/#linkedin-feed" className="hover:text-white transition-colors">LinkedIn Posts</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6">Legal</h4>
                  <ul className="space-y-4 text-xs text-white/30 font-bold uppercase tracking-widest">
                    <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                    <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                    <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6">
                <div className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em]">© 2026 Sujoy Moulick. All Rights Reserved.</div>
                <div className="flex gap-6">
                  {[Github, Linkedin, Twitter].map((Icon, i) => (
                    <a key={i} href="#" className="text-white/20 hover:text-white transition-colors">
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Smooth fade+slide wrapper for every page
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/live-projects" element={<PageTransition><LiveProjectsPage /></PageTransition>} />
        <Route path="/certifications" element={<PageTransition><CertificationsPage /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><ProjectsPage /></PageTransition>} />
        <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicyPage /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
        <Route path="/disclaimer" element={<PageTransition><DisclaimerPage /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Suspense fallback={null}><Blog /></Suspense></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><Suspense fallback={null}><BlogPost /></Suspense></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Analytics />
      <TechCursor />
      <AppRoutes />
    </BrowserRouter>
  );
}
