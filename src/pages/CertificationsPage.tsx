import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Award, ExternalLink, Calendar, ShieldCheck, Cpu, Globe, Zap, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../App';
import certDM from '../../assets/certificate/DM.png';
import certGenAI from '../../assets/certificate/Generative AI.png';
import certGraphicDesign from '../../assets/certificate/Graphic-design.png';
import certHtmlCssJs from '../../assets/certificate/HTML-CSS-JS.png';
import certLLM from '../../assets/certificate/LLM.png';
import certResponsibleAI from '../../assets/certificate/ResponsibleAI.png';
import certSoftwareEng from '../../assets/certificate/Software engineering.png';
import certCloud from '../../assets/certificate/cloud computing.png';
import certCyberSec from '../../assets/certificate/cyber-sequrity.png';
import certMongoDB from '../../assets/certificate/mongodb.png';
const ALL_CERTIFICATIONS = [
  { 
    id: 'CERT-GENAI', 
    title: 'Generative AI', 
    description: 'Comprehensive understanding of Generative AI principles, applications, and model architectures.', 
    tag: 'AI/ML',
    date: 'Recent',
    issuer: 'Certification Authority',
    skills: ['Generative Models', 'AI Applications'],
    imageSrc: certGenAI
  },
  { 
    id: 'CERT-LLM', 
    title: 'Large Language Models (LLM)', 
    description: 'Deep dive into Large Language Models, prompt engineering, and fine-tuning techniques.', 
    tag: 'AI/ML',
    date: 'Recent',
    issuer: 'Certification Authority',
    skills: ['LLMs', 'Prompt Engineering'],
    imageSrc: certLLM
  },
  { 
    id: 'CERT-RESP-AI', 
    title: 'Responsible AI', 
    description: 'Principles and practices for developing and deploying AI systems responsibly and ethically.', 
    tag: 'AI Ethics',
    date: 'Recent',
    issuer: 'Certification Authority',
    skills: ['AI Ethics', 'Bias Mitigation'],
    imageSrc: certResponsibleAI
  },
  { 
    id: 'CERT-CLOUD', 
    title: 'Cloud Computing', 
    description: 'Foundational concepts in cloud architecture, deployment models, and cloud services.', 
    tag: 'Cloud',
    date: 'Recent',
    issuer: 'Certification Authority',
    skills: ['Cloud Architecture', 'IaaS', 'PaaS'],
    imageSrc: certCloud
  },
  { 
    id: 'CERT-CYBER', 
    title: 'Cyber Security', 
    description: 'Core concepts of information security, threat modeling, and defensive strategies.', 
    tag: 'Security',
    date: 'Recent',
    issuer: 'Certification Authority',
    skills: ['Network Security', 'Threat Analysis'],
    imageSrc: certCyberSec
  },
  { 
    id: 'CERT-SE', 
    title: 'Software Engineering', 
    description: 'End-to-end software development lifecycle, design patterns, and engineering best practices.', 
    tag: 'Engineering',
    date: 'Recent',
    issuer: 'Certification Authority',
    skills: ['SDLC', 'Design Patterns'],
    imageSrc: certSoftwareEng
  },
  { 
    id: 'CERT-MONGO', 
    title: 'MongoDB', 
    description: 'Database design, CRUD operations, indexing, and aggregation with MongoDB.', 
    tag: 'Database',
    date: 'Recent',
    issuer: 'Certification Authority',
    skills: ['NoSQL', 'Database Design'],
    imageSrc: certMongoDB
  },
  { 
    id: 'CERT-WEB', 
    title: 'HTML, CSS & JavaScript', 
    description: 'Fundamental web development skills for building responsive and interactive user interfaces.', 
    tag: 'Web Dev',
    date: 'Recent',
    issuer: 'Certification Authority',
    skills: ['HTML5', 'CSS3', 'JavaScript'],
    imageSrc: certHtmlCssJs
  },
  { 
    id: 'CERT-GRAPHIC', 
    title: 'Graphic Design', 
    description: 'Principles of visual communication, layout, color theory, and digital design tools.', 
    tag: 'Design',
    date: 'Recent',
    issuer: 'Certification Authority',
    skills: ['Visual Design', 'UI/UX Basics'],
    imageSrc: certGraphicDesign
  },
  { 
    id: 'CERT-DM', 
    title: 'Digital Marketing', 
    description: 'Strategies for online marketing, SEO, social media campaigns, and digital analytics.', 
    tag: 'Marketing',
    date: 'Recent',
    issuer: 'Certification Authority',
    skills: ['SEO', 'Content Strategy'],
    imageSrc: certDM
  }
];

export default function CertificationsPage() {
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

      <main className="relative z-10 pt-32 pb-20 max-w-7xl mx-auto px-6">
        <header className="mb-20">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white/80">
                <Award size={24} />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2 block">Archive</span>
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white">
                All Certifications
              </h1>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ALL_CERTIFICATIONS.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative flex flex-col bg-brand-card/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500"
            >
              <div className="aspect-[16/9] overflow-hidden relative">
                <img 
                  src={cert.imageSrc} 
                  alt={cert.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-8">
                   <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md uppercase tracking-[0.2em]">
                      {cert.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold leading-tight">{cert.title}</h3>
                </div>
              </div>

              <div className="p-8 space-y-6 flex-1 flex flex-col">
                <p className="text-white/60 text-sm leading-relaxed">
                  {cert.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {cert.skills.map(skill => (
                    <span key={skill} className="text-[9px] font-bold px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/40 uppercase tracking-widest">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="pt-6 mt-auto border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      <Calendar size={12} /> {cert.date}
                    </div>
                    <div className="w-px h-3 bg-white/10 hidden sm:block" />
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      ID: {cert.id}
                    </div>
                  </div>
                  
                  <motion.a 
                    href="#"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    Verify Credential <ExternalLink size={10} />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
          Curated with Precision & Passion
        </div>
      </footer>
    </div>
  );
}
