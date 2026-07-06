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
import WorkingProjectsPage from './pages/WorkingProjectsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ContributeModal from './components/ContributeModal';
import TermsPage from './pages/TermsPage';
import DisclaimerPage from './pages/DisclaimerPage';
import ContactPage from './pages/ContactPage';
import { Suspense, lazy } from 'react';
import AdminRoutes from './admin/frontend/AdminRoutes';
import { api } from './lib/api';

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
  GitPullRequest,
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
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
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
    title: 'VlogToBlog',
    description: 'Premium full-stack web application converting YouTube videos into SEO-optimized, highly structured blog posts using Gemini AI.',
    tags: ['React', 'Node.js', 'Gemini AI', 'Firebase'],
    id: '02',
    link: '#',
    github: 'https://github.com/Sujoymoulick/VlogToBlog',
    className: 'md:col-span-2',
    visual: <SpeedIndicator />,
    pattern: 'speed'
  },
  {
    title: 'Resume Generators',
    description: 'AI-powered resume generation suite utilizing Google Gemini API to craft professional, ATS-friendly resumes in minutes.',
    tags: ['Next.js', 'AI', 'Gemini'],
    id: '03',
    link: 'https://www.resumegenerators.in/',
    github: '',
    className: 'md:col-span-2 md:row-span-2',
    visual: <TypeTester />,
    pattern: 'type'
  },
  {
    title: 'Findo',
    description: 'Innovative web application built for seamless user experience.',
    tags: ['React', 'Vite'],
    id: '04',
    link: 'https://findo-frontend.vercel.app/',
    github: 'https://github.com/Sujoymoulick/Findo',
    className: 'md:col-span-2',
    visual: <SecurityBadge />,
    pattern: 'security'
  },
  {
    title: 'Kinetic Luminary',
    description: 'A free, high-performance, immersive 3D portfolio template built with Next.js 16, React 19, and Three.js.',
    tags: ['Next.js', 'React 19', 'Three.js', 'Tailwind'],
    id: '05',
    link: '#',
    github: 'https://github.com/Sujoymoulick/SUNBWMOUNTAINPORTFOLIO',
    className: 'md:col-span-3',
    visual: <LayoutAnimation />,
    pattern: 'layout'
  },
  {
    title: 'SM Invoice Generator',
    description: 'A free online invoice generator helping freelancers and small businesses generate and download professional PDF invoices instantly.',
    tags: ['React', 'Tailwind', 'PDF Gen'],
    id: '06',
    link: 'https://sm-invoice-generator.vercel.app/',
    github: '',
    className: 'md:col-span-3',
    visual: <div className="flex items-center justify-center h-full"><FileDown className="w-16 h-16 text-white" /></div>,
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
          {project.github && project.github !== '' && project.github !== '#' && (
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
              <Link 
                key={item} 
                to={`/#${item.toLowerCase()}`}
                className="hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}

            {/* Works Hover Dropdown */}
            <div className="relative group py-2">
              <span className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                Works <ChevronDown size={10} className="group-hover:rotate-180 transition-transform duration-300 text-white/40" />
              </span>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 rounded-2xl bg-black/90 border border-white/10 backdrop-blur-md p-2 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                <Link 
                  to="/#works" 
                  className="block px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-[9px] font-bold uppercase tracking-widest text-center"
                >
                  Featured Works
                </Link>
                <Link 
                  to="/live-projects" 
                  className="block px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-[9px] font-bold uppercase tracking-widest text-center"
                >
                  Live Projects
                </Link>
                <Link 
                  to="/working-projects" 
                  className="block px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-[9px] font-bold uppercase tracking-widest text-center"
                >
                  Working Logs
                </Link>
              </div>
            </div>

            <Link to="/#certifications" className="hover:text-white transition-colors">Certifications</Link>

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
            <Link to="/admin" className="hover:text-white transition-colors text-white/50 hover:text-white font-bold uppercase tracking-[0.2em] text-[10px]">Admin</Link>
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
                <Link 
                  to="/working-projects" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-white text-white/70 transition-colors py-1 text-xs"
                >
                  Working Logs
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
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 text-white font-bold uppercase tracking-widest text-xs">Admin</Link>

              <a
                href={resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setTimeout(() => setIsMobileMenuOpen(false), 200);
                }}
                className="mt-4 text-[10px] font-bold uppercase tracking-widest border border-white/20 px-8 py-3 rounded-full text-white bg-white/5 active:bg-white/10 active:scale-95 transition-all text-center inline-block"
              >
                Download Resume
              </a>
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
  const [workingProjects, setWorkingProjects] = useState<any[]>([]);
  const [selectedWorkingProject, setSelectedWorkingProject] = useState<any>(null);
  const [homeContributeOpen, setHomeContributeOpen] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('sm_site_loaded', 'true');
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      api.get('/api/working-projects')
        .then(data => setWorkingProjects(data.slice(0, 3)))
        .catch(err => console.error('Failed to load working projects for home:', err));
    }
  }, [isLoading]);

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

                  {/* Current Working Projects Subsection */}
                  {workingProjects.length > 0 && (
                    <div className="mt-20">
                      <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 block mb-1">Active Logs</span>
                          <h3 className="text-xl font-display font-black text-white">Current Working Projects</h3>
                        </div>
                        <Link to="/working-projects" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors group">
                          View All Logs <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workingProjects.map((project, i) => (
                          <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            onClick={() => setSelectedWorkingProject(project)}
                            className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 flex flex-col justify-between h-48 backdrop-blur-md relative overflow-hidden group transition-all cursor-pointer"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase tracking-widest">
                                  {project.category}
                                </span>
                                <div className="flex gap-2">
                                  {project.githubLink && (
                                    <a 
                                      href={project.githubLink} 
                                      onClick={(e) => e.stopPropagation()} 
                                      className="text-white/30 hover:text-white transition-colors" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      <Github size={12} />
                                    </a>
                                  )}
                                  {project.liveUrl && (
                                    <a 
                                      href={project.liveUrl} 
                                      onClick={(e) => e.stopPropagation()} 
                                      className="text-white/30 hover:text-white transition-colors" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink size={12} />
                                    </a>
                                  )}
                                </div>
                              </div>

                              <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                {project.title}
                              </h4>
                              <p className="text-xs text-white/40 leading-relaxed mt-1.5 line-clamp-2">
                                {project.description}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-[9px] font-mono font-bold">
                                <span className="text-white/30 uppercase tracking-wider flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></span>
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
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detail Modal Overlay for Homepage Working Projects */}
                  {selectedWorkingProject && (
                    <div 
                      onClick={() => setSelectedWorkingProject(null)} 
                      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
                    >
                      <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="w-full max-w-2xl rounded-[2.5rem] bg-zinc-900/90 border border-white/10 p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col md:flex-row gap-8 max-h-[90vh]"
                      >
                        {/* Close Button */}
                        <button 
                          onClick={() => setSelectedWorkingProject(null)}
                          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 text-white/50 hover:text-white transition-all cursor-pointer animate-fade-in"
                        >
                          <X size={16} />
                        </button>

                        {/* Left Content Side */}
                        <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                          <div>
                            <span className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-mono font-bold uppercase tracking-wider text-blue-400 inline-block mb-3">
                              {selectedWorkingProject.category}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-serif font-medium text-white leading-tight">
                              {selectedWorkingProject.title}
                            </h2>
                            <span className="text-[10px] text-white/30 font-mono block mt-2">
                              LOGGED: {new Date(selectedWorkingProject.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Description & Context</h4>
                            <p className="text-xs text-white/60 leading-relaxed font-light whitespace-pre-line">
                              {selectedWorkingProject.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                            {selectedWorkingProject.githubLink && (
                              <a 
                                href={selectedWorkingProject.githubLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 text-xs text-white/70 hover:text-white font-medium transition-all"
                              >
                                <Github size={14} /> Repository Code
                              </a>
                            )}
                            {selectedWorkingProject.liveUrl && (
                              <a 
                                href={selectedWorkingProject.liveUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30 text-xs text-blue-400 hover:text-blue-300 font-medium transition-all"
                              >
                                <Globe size={14} /> Launch Application
                              </a>
                            )}
                            <button
                              onClick={() => setHomeContributeOpen(true)}
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
                                {selectedWorkingProject.status}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] font-mono font-bold">
                                <span className="text-white/40 uppercase tracking-widest">Progress</span>
                                <span className="text-blue-400">{selectedWorkingProject.progress}%</span>
                              </div>
                              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full transition-all duration-700"
                                  style={{ width: `${selectedWorkingProject.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tech Stack</h4>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {(selectedWorkingProject.tags || []).map((t: string) => (
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

                  {selectedWorkingProject && (
                    <ContributeModal 
                      isOpen={homeContributeOpen} 
                      onClose={() => setHomeContributeOpen(false)} 
                      projectTitle={selectedWorkingProject.title} 
                      projectType="working" 
                    />
                  )}
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
                    <li><Link to="/admin" className="hover:text-white/80 transition-colors text-blue-400">Admin Panel</Link></li>
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
        <Route path="/working-projects" element={<PageTransition><WorkingProjectsPage /></PageTransition>} />
        <Route path="/certifications" element={<PageTransition><CertificationsPage /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><ProjectsPage /></PageTransition>} />
        <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicyPage /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
        <Route path="/disclaimer" element={<PageTransition><DisclaimerPage /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Suspense fallback={null}><Blog /></Suspense></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><Suspense fallback={null}><BlogPost /></Suspense></PageTransition>} />
        <Route path="/admin/*" element={<AdminRoutes />} />
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
