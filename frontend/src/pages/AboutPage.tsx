import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { User, ArrowLeft, Github, Linkedin, Mail, Zap, Cpu, Globe, Rocket } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import OrbitingSkills from '../components/ui/orbiting-skills';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <SEO 
        title="About Me" 
        description="Learn more about Sujoy Moulick, a Full Stack Developer specializing in AI and Web3." 
        slug="about"
      />

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Bio */}
          <div className="lg:col-span-7 space-y-12">
            <header>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block p-3 rounded-2xl bg-white/5 border border-white/10 mb-6"
              >
                <User size={32} className="text-blue-400" />
              </motion.div>
              <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter mb-8">
                Building the <span className="text-white/40 italic">Future</span>.
              </h1>
              <p className="text-xl md:text-2xl text-white/60 font-display font-light leading-relaxed">
                I'm Sujoy Moulick, a 2nd Year CSE student specializing in AI/ML at UEM Jaipur. I view coding as an interactive art form.
              </p>
            </header>

            <div className="prose prose-invert prose-lg max-w-none text-white/60">
              <p>
                My journey into technology began with a simple curiosity: how do things work under the hood? This curiosity led me to explore the worlds of frontend development, decentralized systems, and artificial intelligence.
              </p>
              <p>
                Today, I focus on building high-performance applications using **React**, **Next.js**, and **Supabase**, aiming for visually stunning and highly optimized web experiences. Alongside technical development, I'm passionate about digital marketing and content distribution. I leverage SEO, growth strategy, and analytics to ensure that complex software and products gain the visibility and engagement they deserve.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <Rocket className="text-blue-400 mb-4" size={24} />
                  <h3 className="text-xl font-bold mb-2">My Mission</h3>
                  <p className="text-sm">To bridge the gap between complex engineering and intuitive user experiences.</p>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <Zap className="text-purple-400 mb-4" size={24} />
                  <h3 className="text-xl font-bold mb-2">My Vision</h3>
                  <p className="text-sm">A world where decentralized technology empowers every individual to own their digital destiny.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-6 pt-8">
              <a href="#" className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                <Github size={16} /> GitHub
              </a>
              <a href="#" className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                <Linkedin size={16} /> LinkedIn
              </a>
              <a href="#" className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                <Mail size={16} /> Email
              </a>
            </div>
          </div>

          {/* Right: Skills & Visuals */}
          <div className="lg:col-span-5 space-y-12">
            <div className="aspect-square relative flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full" />
              <OrbitingSkills />
            </div>

            <div className="p-8 rounded-[2.5rem] bg-brand-card/40 border border-white/5 backdrop-blur-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Cpu size={20} className="text-blue-400" /> Core Expertise
              </h3>
              <div className="space-y-6">
                {[
                  { name: 'Frontend Architecture', level: 95 },
                  { name: 'AI Integration', level: 85 },
                  { name: 'Web3 & Blockchain', level: 80 },
                  { name: 'SEO & Growth Marketing', level: 85 },
                  { name: 'UI/UX Design', level: 90 },
                ].map((skill, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-white/40">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AboutPage;
