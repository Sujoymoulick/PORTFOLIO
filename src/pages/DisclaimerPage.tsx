import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ShieldCheck, Zap, Info, ExternalLink } from 'lucide-react';
import { SEO } from '../components/ui/SEO';

const DisclaimerPage = () => {
  const sections = [
    {
      id: 'general',
      title: '1. General Information',
      icon: <Info className="w-5 h-5 text-blue-400" />,
      content: 'The content provided on sujoymoulick.online is for informational and educational purposes only. While I strive to provide accurate and up-to-date information, I make no representations or warranties of any kind about the completeness, accuracy, or reliability of the information provided.'
    },
    {
      id: 'professional',
      title: '2. Not Professional Advice',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      content: 'The technical tutorials and engineering notes shared here reflect my personal experiences and research. They should not be taken as professional engineering or financial advice. Always consult with a professional before making significant decisions based on the content of this site.'
    },
    {
      id: 'investment',
      title: '3. Financial & Trading Disclaimer',
      icon: <Zap className="w-5 h-5 text-orange-400" />,
      content: 'Any articles regarding "Trading Basics" or "Blockchain" are purely for educational purposes. Trading involves significant risk, and you should never invest more than you can afford to lose. I am not a financial advisor.'
    },
    {
      id: 'external',
      title: '4. External Links',
      icon: <ExternalLink className="w-5 h-5 text-purple-400" />,
      content: 'This website may contain links to external websites that are not provided or maintained by or in any way affiliated with me. Please note that I do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <SEO 
        title="Disclaimer" 
        description="Legal disclaimer for content provided on sujoymoulick.online." 
        slug="disclaimer"
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
            <AlertTriangle size={48} className="text-orange-400" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-display font-black tracking-tighter mb-6"
          >
            Disclaimer
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold"
          >
            Legal Notice • sujoymoulick.online
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
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
            © 2026 Sujoy Moulick. All Rights Reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default DisclaimerPage;
