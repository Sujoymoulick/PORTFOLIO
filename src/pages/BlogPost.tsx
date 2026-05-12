import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Twitter, 
  Linkedin, 
  Github, 
  ChevronRight,
  List,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import { SEO } from '../components/ui/SEO';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const [activeHeading, setActiveHeading] = useState('');

  // Extract headings for Table of Contents
  const headings = post?.content.match(/^#{2,3} .+/gm)?.map(h => ({
    text: h.replace(/^#{2,3} /, ''),
    level: h.startsWith('###') ? 3 : 2,
    id: h.replace(/^#{2,3} /, '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
  })) || [];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!post) {
      navigate('/blog');
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveHeading(heading.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post, navigate, headings]);

  if (!post) return null;

  const relatedPosts = BLOG_POSTS
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
        <SEO 
          title={post.title} 
          description={post.metaDescription || post.description}
          article={true}
          slug={`blog/${post.slug}`}
        />

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

        <main className="relative z-10 pt-32 pb-20 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Sidebar: TOC */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <List size={14} /> Contents
                </div>
                <nav className="space-y-4">
                  {headings.map((h, i) => (
                    <a 
                      key={i} 
                      href={`#${h.id}`}
                      className={`block text-xs transition-colors hover:text-white ${
                        activeHeading === h.id ? 'text-blue-400 font-bold translate-x-1' : 'text-white/40'
                      } ${h.level === 3 ? 'ml-4' : ''}`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <Share2 size={14} /> Share
                  </div>
                  <div className="flex gap-2">
                    {[Twitter, Linkedin, Share2].map((Icon, i) => (
                      <button key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all">
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AdSense Placeholder */}
              <div className="mt-8 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 backdrop-blur-md text-center py-12">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/40">Ad Placement</span>
              </div>
            </aside>

            {/* Middle: Content */}
            <article className="lg:col-span-6">
              <header className="mb-12">
                <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">
                  <div className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {post.category}
                  </div>
                  <div className="w-px h-3 bg-white/10" />
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} /> {post.date}
                  </div>
                  <div className="w-px h-3 bg-white/10" />
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} /> {post.readingTime}
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white mb-8 leading-[1.1]">
                  {post.title}
                </h1>

                <div className="flex items-center gap-3 py-6 border-y border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white font-bold">
                    SM
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Author</div>
                    <div className="text-sm font-medium text-white/80">{post.author}</div>
                  </div>
                </div>
              </header>

              <div className="prose prose-invert prose-lg max-w-none 
                prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white
                prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-8
                prose-strong:text-white prose-strong:font-bold
                prose-ul:text-white/70 prose-li:mb-2
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-blue-500 prose-h2:pl-4
                prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
                prose-blockquote:border-blue-500 prose-blockquote:bg-blue-500/5 prose-blockquote:py-2 prose-blockquote:rounded-r-xl
                [&>p>strong]:text-blue-400">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({node, ...props}) => {
                      const id = String(props.children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return <h2 id={id} {...props} />
                    },
                    h3: ({node, ...props}) => {
                      const id = String(props.children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return <h3 id={id} {...props} />
                    },
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-2xl border border-white/10 !bg-zinc-900/50 backdrop-blur-md !my-8"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 font-mono text-sm" {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* AdSense Placeholder Middle */}
              <div className="my-12 p-12 rounded-3xl bg-brand-card border border-white/5 text-center">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Ad Placement</span>
              </div>

              <footer className="mt-20 pt-12 border-t border-white/5">
                <div className="bg-brand-card/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 text-center">
                  <h3 className="text-2xl font-display font-bold mb-4">Enjoyed this post?</h3>
                  <p className="text-white/60 mb-8 max-w-lg mx-auto">
                    I write about my experiences building products at the intersection of AI and Web3. Subscribe to my newsletter for the latest updates.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      className="w-full sm:w-auto px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
                      Subscribe
                    </button>
                  </div>
                </div>
              </footer>
            </article>

            {/* Right Sidebar: Related Posts */}
            <aside className="lg:col-span-3 space-y-8">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <BookOpen size={14} /> Related Posts
                </div>
                <div className="space-y-6">
                  {relatedPosts.map((rp, i) => (
                    <Link key={i} to={`/blog/${rp.slug}`} className="group block">
                      <div className="text-[9px] uppercase tracking-widest text-blue-400 mb-2">{rp.category}</div>
                      <h4 className="text-sm font-medium text-white/80 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {rp.title}
                      </h4>
                    </Link>
                  ))}
                  {relatedPosts.length === 0 && (
                    <p className="text-xs text-white/20 italic">No related posts yet.</p>
                  )}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
                   Follow Me
                </div>
                <div className="flex flex-col gap-3">
                  <a href="#" className="flex items-center gap-3 text-xs text-white/60 hover:text-white transition-colors p-3 rounded-xl bg-white/5">
                    <Twitter size={14} /> Twitter
                  </a>
                  <a href="#" className="flex items-center gap-3 text-xs text-white/60 hover:text-white transition-colors p-3 rounded-xl bg-white/5">
                    <Linkedin size={14} /> LinkedIn
                  </a>
                  <a href="#" className="flex items-center gap-3 text-xs text-white/60 hover:text-white transition-colors p-3 rounded-xl bg-white/5">
                    <Github size={14} /> GitHub
                  </a>
                </div>
              </div>

              {/* AdSense Placeholder Bottom */}
              <div className="p-6 rounded-3xl bg-purple-500/5 border border-purple-500/10 backdrop-blur-md text-center py-20">
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500/40">Ad Placement</span>
              </div>
            </aside>

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
