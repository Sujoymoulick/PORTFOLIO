import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Mail, ExternalLink, Cookie, Info, Eye, Lock, RefreshCw, UserCheck } from 'lucide-react';
import { SEO } from '../components/ui/SEO';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      icon: <Info className="w-5 h-5 text-blue-400" />,
      content: 'Welcome to sujoymoulick.online. We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.'
    },
    {
      id: 'information-collect',
      title: '2. Information We Collect',
      icon: <Eye className="w-5 h-5 text-purple-400" />,
      content: 'We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows: \n\n • Usage Data: Includes information about how you use our website, products and services (e.g., IP address, browser type, time zone setting, browser plug-in types and versions, operating system and platform).'
    },
    {
      id: 'cookies',
      title: '3. Cookies and Tracking Technologies',
      icon: <Cookie className="w-5 h-5 text-orange-400" />,
      content: 'We use cookies and similar tracking technologies to track the activity on our website and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.'
    },
    {
      id: 'adsense',
      title: '4. Google AdSense and Third-Party Ads',
      icon: <ExternalLink className="w-5 h-5 text-emerald-400" />,
      content: 'This site uses Google AdSense to serve ads. Google, as a third-party vendor, uses cookies to serve ads on our site. Google\'s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.\n\nGoogle may use cookies to personalize ads. Users may opt out of personalized advertising by visiting: ',
      link: {
        text: 'Google Ads Settings',
        url: 'https://adssettings.google.com'
      }
    },
    {
      id: 'data-usage',
      title: '5. Data Usage',
      icon: <RefreshCw className="w-5 h-5 text-cyan-400" />,
      content: 'We use the collected data for various purposes, including to provide and maintain our service, to notify you about changes to our service, and to provide customer support.'
    },
    {
      id: 'user-rights',
      title: '6. User Rights',
      icon: <UserCheck className="w-5 h-5 text-yellow-400" />,
      content: 'Depending on your location, you may have the following rights regarding your personal data: the right to access, the right to rectification, the right to erasure, the right to restrict processing, the right to data portability, and the right to object.'
    },
    {
      id: 'data-protection',
      title: '7. Data Protection',
      icon: <Lock className="w-5 h-5 text-red-400" />,
      content: 'The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.'
    },
    {
      id: 'changes',
      title: '8. Changes to This Policy',
      icon: <RefreshCw className="w-5 h-5 text-pink-400" />,
      content: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.'
    },
    {
      id: 'contact',
      title: '9. Contact Information',
      icon: <Mail className="w-5 h-5 text-white/60" />,
      content: 'If you have any questions about this Privacy Policy, please contact us at:',
      email: 'sujoymoulick05@gmail.com'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <SEO 
        title="Privacy Policy" 
        description="Read the privacy policy for sujoymoulick.online." 
        slug="privacy-policy"
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
            <Shield size={48} className="text-emerald-400" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-display font-black tracking-tighter mb-6"
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold"
          >
            Last Updated: May 2026
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
              
              <div className="pl-14">
                <p className="text-white/60 leading-relaxed whitespace-pre-line">
                  {section.content}
                  {section.link && (
                    <a 
                      href={section.link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors ml-1"
                    >
                      {section.link.text} <ExternalLink size={12} />
                    </a>
                  )}
                  {section.email && (
                    <a 
                      href={`mailto:${section.email}`}
                      className="text-white hover:text-blue-400 transition-colors block mt-2"
                    >
                      {section.email}
                    </a>
                  )}
                </p>
              </div>
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

export default PrivacyPolicyPage;
