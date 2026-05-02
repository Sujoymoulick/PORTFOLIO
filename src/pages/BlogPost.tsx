import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Clock, Share2, Twitter, Linkedin, Github } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import { Helmet } from 'react-helmet-async';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!post) {
      navigate('/blog');
    }
  }, [post, navigate]);

  if (!post) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
        <Helmet>
          <title>{post.title} | Sujoy Moulick</title>
          <meta name="description" content={post.metaDescription || post.description} />
        </Helmet>

        {/* Background Mesh */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[150px]" />
        </div>

        <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 bg-black/40 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/blog" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to blog
            </Link>
            <div className="text-xl font-display font-black tracking-tighter">
              SM<span className="text-white/40">.</span>
            </div>
          </div>
        </nav>

        <main className="relative z-10 pt-32 pb-20 max-w-4xl mx-auto px-6">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <header className="mb-12">
              <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} /> {post.date}
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <Clock size={12} /> 5 min read
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white mb-8 leading-[1.1]">
                {post.title}
              </h1>

              <div className="flex items-center justify-between py-6 border-y border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white font-bold">
                    SM
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Author</div>
                    <div className="text-sm font-medium text-white/80">{post.author}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold hidden sm:block">Share</span>
                  <div className="flex gap-2">
                    {[Twitter, Linkedin, Share2].map((Icon, i) => (
                      <button key={i} className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all">
                        <Icon size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </header>

            <div 
              className="prose prose-invert prose-lg max-w-none 
                prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white
                prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-6
                prose-strong:text-white prose-strong:font-bold
                prose-ul:text-white/70 prose-li:mb-2
                prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
                [&>p>strong]:text-blue-400"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <footer className="mt-20 pt-12 border-t border-white/5">
              <div className="bg-brand-card/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 text-center">
                <h3 className="text-2xl font-display font-bold mb-4">Enjoyed this post?</h3>
                <p className="text-white/60 mb-8 max-w-lg mx-auto">
                  I write about my experiences building products at the intersection of AI and Web3. Follow me for more insights.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="https://linkedin.com/in/sujoymoulick" className="px-8 py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
                    Follow on LinkedIn
                  </a>
                  <Link to="/blog" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-colors">
                    Back to Blog
                  </Link>
                </div>
              </div>
            </footer>
          </motion.article>
        </main>

        <footer className="py-20 border-t border-white/5 text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
            © 2026 Sujoy Moulick. All Rights Reserved.
          </div>
        </footer>
      </div>
    );
}
