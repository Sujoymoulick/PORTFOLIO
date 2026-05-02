import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, ExternalLink, Calendar, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../App';
import { BLOG_POSTS } from '../data/blogData';
import { Helmet } from 'react-helmet-async';

export default function Blog() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
        <Helmet>
          <title>Blog | Sujoy Moulick</title>
          <meta name="description" content="Read the latest insights on React, AI, Web3, and student entrepreneurship by Sujoy Moulick." />
        </Helmet>

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
                  <BookOpen size={24} />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2 block">Insights</span>
                <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white">
                  The Blog
                </h1>
                <p className="mt-6 text-white/40 max-w-2xl text-lg font-display font-light">
                  Articles on software engineering, AI, and building digital products.
                </p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative flex flex-col bg-brand-card/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500"
              >
                <div className="p-8 space-y-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} /> {post.date}
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} /> 5 min read
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-medium text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[8px] text-white">
                        SM
                      </div>
                      {post.author}
                    </div>
                    
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors group/link"
                    >
                      Read More <ExternalLink size={10} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Decorative Index */}
                <div className="absolute top-4 right-6 text-[10px] font-mono text-white/5 font-bold group-hover:text-white/10 transition-colors uppercase tracking-[0.5em]">
                  Post 0{i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </main>

        <footer className="py-20 border-t border-white/5 text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
            © 2026 Sujoy Moulick. All Rights Reserved.
          </div>
        </footer>
      </div>
    );
}
