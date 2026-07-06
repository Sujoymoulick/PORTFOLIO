import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Info, Scale, ShieldAlert, Globe, MessageSquare } from 'lucide-react';
import { SEO } from '../components/ui/SEO';

const TermsPage = () => {
  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: <Info className="w-5 h-5 text-blue-400" />,
      content: 'By accessing and using sujoymoulick.online ("the Website"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'
    },
    {
      id: 'content',
      title: '2. Intellectual Property',
      icon: <Scale className="w-5 h-5 text-purple-400" />,
      content: 'The Website and its original content, features, and functionality are owned by Sujoy Moulick and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.'
    },
    {
      id: 'user-conduct',
      title: '3. User Conduct',
      icon: <Globe className="w-5 h-5 text-emerald-400" />,
      content: 'You agree to use the Website only for lawful purposes. You are prohibited from posting or transmitting any unlawful, threatening, libelous, defamatory, obscene, or profane material that could constitute or encourage conduct that would be considered a criminal offense.'
    },
    {
      id: 'disclaimer',
      title: '4. Disclaimer of Liability',
      icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
      content: 'The information on this Website is provided on an "as is" basis. Sujoy Moulick makes no representations or warranties of any kind, express or implied, as to the operation of the Website or the information, content, or materials included on the Website.'
    },
    {
      id: 'modifications',
      title: '5. Modifications',
      icon: <MessageSquare className="w-5 h-5 text-cyan-400" />,
      content: 'Sujoy Moulick reserves the right to change these conditions from time to time as it sees fit and your continued use of the site will signify your acceptance of any adjustment to these terms.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <SEO 
        title="Terms & Conditions" 
        description="Read the terms and conditions for using sujoymoulick.online." 
        slug="terms"
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

      <main className="relative z-10 pt-32 pb-20 max-w-4xl mx-auto px-6">
        <header className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 mb-8"
          >
            <FileText size={48} className="text-blue-400" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-display font-black tracking-tighter mb-6"
          >
            Terms & Conditions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold"
          >
            Effective Date: May 12, 2026
          </motion.p>
        </header>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section 
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  {section.icon}
                </div>
                <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight">
                  {section.title}
                </h2>
              </div>
              <p className="text-white/60 leading-relaxed pl-14">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        <footer className="mt-32 pt-12 border-t border-white/5 text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Legal</span>
            <span className="text-white/10">·</span>
            <Link to="/privacy-policy" className="text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-[10px] font-bold text-white uppercase tracking-widest hover:text-blue-400 transition-colors">Terms</Link>
            <Link to="/disclaimer" className="text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors">Disclaimer</Link>
          </div>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
            © 2026 Sujoy Moulick. All Rights Reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default TermsPage;
