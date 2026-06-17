import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, MapPin, Phone, Github, Linkedin, Twitter, MessageSquare, HelpCircle } from 'lucide-react';
import { SEO } from '../components/ui/SEO';

const ContactPage = () => {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
    }, 2000);
  };

  const faqs = [
    {
      q: "Are you available for freelance projects?",
      a: "Yes, I am always open to discussing new projects, particularly in the AI and Web3 space."
    },
    {
      q: "What is your typical turnaround time?",
      a: "This varies depending on the project complexity, but for a standard landing page, it's usually 1-2 weeks."
    },
    {
      q: "Do you offer consultation calls?",
      a: "Absolutely! You can book a 15-minute intro call via my LinkedIn or by sending an email."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <SEO 
        title="Contact" 
        description="Get in touch with Sujoy Moulick for collaborations, freelance work, or technical inquiries." 
        slug="contact"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left: Info */}
          <div className="lg:col-span-5 space-y-12">
            <header>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block p-3 rounded-2xl bg-white/5 border border-white/10 mb-6"
              >
                <MessageSquare size={32} className="text-blue-400" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-8">
                Let's <span className="text-white/40 italic">Collaborate</span>.
              </h1>
              <p className="text-lg text-white/60 font-display font-light leading-relaxed">
                Have a project in mind? Or just want to say hi? I'm always open to discussing new ideas and opportunities.
              </p>
            </header>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-white/40">Email</div>
                  <div className="text-sm font-medium">sujoymoulick05@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-white/40">Location</div>
                  <div className="text-sm font-medium">Jaipur, Rajasthan, India</div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <HelpCircle size={20} className="text-blue-400" /> Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-bold text-white mb-2">{faq.q}</h4>
                    <p className="text-xs text-white/40 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-12 rounded-[2.5rem] bg-brand-card/40 border border-white/5 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full -mr-32 -mt-32" />
              
              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-2">Your Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-2">Subject</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Project Inquiry"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-2">Message</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="Tell me about your project..."
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={formState !== 'idle'}
                  className="w-full py-5 bg-white text-black rounded-2xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {formState === 'idle' && <>Send Message <Send size={16} /></>}
                  {formState === 'sending' && <>Sending...</>}
                  {formState === 'success' && <>Message Sent Successfully!</>}
                </button>
              </form>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ContactPage;
