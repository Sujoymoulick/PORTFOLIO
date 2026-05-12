import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  BookOpen, 
  ExternalLink, 
  Calendar, 
  User, 
  Clock, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS, CATEGORIES } from '../data/blogData';
import { SEO } from '../components/ui/SEO';

const POSTS_PER_PAGE = 6;

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
        <SEO 
          title="Tech Blog" 
          description="Read the latest insights on AI, Web3, Blockchain, and Software Engineering by Sujoy Moulick." 
          slug="blog"
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
          <header className="mb-20">
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white/80">
                  <BookOpen size={24} />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2 block">Insights & Observations</span>
                  <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter text-white">
                    The Tech Blog
                  </h1>
                </div>
                <div className="flex flex-col gap-6">
                  <p className="text-white/40 text-lg font-display font-light leading-relaxed">
                    A collection of long-form articles about building products, mastering engineering, and navigating the future of tech.
                  </p>
                  
                  {/* Search and Category Filter */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-sm"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none pl-12 pr-10 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-sm cursor-pointer"
                      >
                        <option value="All">All Categories</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Post (only on page 1) */}
          {currentPage === 1 && searchQuery === '' && selectedCategory === 'All' && currentPosts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16 group relative"
            >
              <Link to={`/blog/${currentPosts[0].slug}`} className="block">
                <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                  <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay group-hover:bg-blue-500/20 transition-colors" />
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 max-w-3xl">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">
                      <TrendingUp size={14} /> Featured Article
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter text-white mb-6 group-hover:text-blue-400 transition-colors">
                      {currentPosts[0].title}
                    </h2>
                    <p className="text-white/60 text-lg hidden md:block line-clamp-2 mb-8">
                      {currentPosts[0].description}
                    </p>
                    <div className="flex items-center gap-6 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5"><Calendar size={12} /> {currentPosts[0].date}</div>
                      <div className="flex items-center gap-1.5"><Clock size={12} /> {currentPosts[0].readingTime}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* AdSense Placement Top */}
          <div className="mb-16 p-8 rounded-3xl bg-white/5 border border-white/5 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/10">Ad Placement</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative flex flex-col bg-brand-card/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500"
              >
                <div className="p-8 space-y-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/30">
                      {post.category}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} /> {post.readingTime}
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
                      {post.date}
                    </div>
                    
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors group/link"
                    >
                      Read More <ChevronRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-20 flex justify-center items-center gap-4">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 disabled:opacity-20 hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-sm font-bold tracking-widest text-white/40">
                Page <span className="text-white">{currentPage}</span> of {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 disabled:opacity-20 hover:bg-white/10 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {currentPosts.length === 0 && (
            <div className="text-center py-40">
              <div className="text-4xl font-display font-black text-white/10 mb-4">No results found</div>
              <p className="text-white/40">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>

        <footer className="py-20 border-t border-white/5 text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
            © 2026 Sujoy Moulick. All Rights Reserved.
          </div>
        </footer>
      </div>
    );
}
