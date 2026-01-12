import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Github, Twitter, Mail, Search, Sparkles, User, Calendar, Clock, ChevronRight } from 'lucide-react';

const API_BASE = `http://${window.location.hostname}:8081/api/blogs`;

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(API_BASE);
      setBlogs(response.data);
    } catch (error) {
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
        console.error('Error fetching blogs:', error);
      }
      // Fallback data if server is down
      setBlogs([
        { id: 1, title: 'The Future of Neural Interfaces', content: 'Exploring how brain-computer interfaces are evolving from medical prosthetics to consumer enhancements.', author: 'Dr. Aris Thorne', createTime: '2026-01-12T09:00:00', category: 'Cybernetics', readingTime: '8 min', imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000' },
        { id: 2, title: 'Neon Tokyo: A Photographic Journey', content: 'Capturing the vibrant night life of Shinjuku and Shibuya.', author: 'Kaito Chen', createTime: '2026-01-11T21:30:00', category: 'Photography', readingTime: '5 min', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1000' },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-cyber-neon/30 overflow-x-hidden">
      {/* Aurora Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-blue/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-purple/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyber-pink/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      {/* Modern Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-glass-dark/40 backdrop-blur-xl border border-glass-border rounded-2xl px-6 py-3 shadow-glass-dark">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-cyber-neon to-cyber-purple rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Trace.Lab</h1>
          </div>
          
          <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-white/50">
            {['Intelligence', 'Archive', 'Signals', 'Connect'].map(item => (
              <a key={item} href="#" className="hover:text-cyber-neon transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyber-neon group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white"><Search size={18} /></button>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <button className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-cyber-neon transition-colors">Join</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-48 pb-20 px-6 max-w-7xl mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-neon/10 border border-cyber-neon/20 text-cyber-neon text-[9px] font-black uppercase tracking-[0.2em] mb-8">
            <div className="w-1.5 h-1.5 bg-cyber-neon rounded-full animate-pulse" />
            Systems Operational // v2.0.6
          </div>
          <h2 className="text-[12vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter uppercase mb-8">
            Digital<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-cyber-purple to-cyber-pink animate-gradient-x">
              Frontier.
            </span>
          </h2>
          <p className="max-w-xl text-lg md:text-xl text-white/40 font-medium leading-relaxed">
            Curated insights from the intersection of biology, silicon, and the expanding digital universe.
          </p>
        </motion.div>
      </header>

      {/* Bento Grid with Images */}
      <main className="px-6 max-w-7xl mx-auto pb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[320px]">
          {blogs.map((blog, index) => {
            const spans = [
              "md:col-span-8 md:row-span-2", 
              "md:col-span-4 md:row-span-1", 
              "md:col-span-4 md:row-span-1", 
              "md:col-span-4 md:row-span-2", 
              "md:col-span-8 md:row-span-1",
              "md:col-span-12 md:row-span-1",
            ][index % 6];

            return (
              <motion.article 
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`${spans} group relative bg-cyber-card border border-cyber-border rounded-3xl overflow-hidden shadow-2xl cursor-pointer flex flex-col`}
                onClick={() => setSelectedBlog(blog)}
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={blog.imageUrl} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-cyber-neon">
                      {blog.category}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <ChevronRight size={20} className="text-white" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(blog.createTime).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {blog.readingTime}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black leading-tight tracking-tight group-hover:text-cyber-neon transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-white/50 line-clamp-2 font-medium leading-relaxed">
                      {blog.content}
                    </p>
                  </div>
                </div>

                {/* Hover Border Glow */}
                <div className="absolute inset-0 border-2 border-cyber-neon/0 group-hover:border-cyber-neon/40 rounded-3xl transition-all duration-500 pointer-events-none" />
              </motion.article>
            );
          })}
        </div>
      </main>

      {/* Cyber Footer */}
      <footer className="bg-secondary border-t border-cyber-border pt-24 pb-12 px-6 max-w-7xl mx-auto rounded-t-[3rem] relative z-10 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyber-neon to-cyber-purple rounded-xl flex items-center justify-center">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">Trace.Lab</h1>
            </div>
            <p className="text-lg text-white/30 font-medium leading-relaxed max-w-md">
              The interface between humanity and the next digital evolution. Join the transmission.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-cyber-neon hover:text-black transition-all hover:-translate-y-1 border border-white/5">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Protocols</h4>
              <ul className="space-y-4 text-sm font-bold text-white/40">
                {['Directives', 'Neural-Link', 'Archive', 'Terminal'].map(item => (
                  <li key={item} className="hover:text-cyber-neon cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Signals</h4>
              <ul className="space-y-4 text-sm font-bold text-white/40">
                {['Transmission', 'Frequency', 'Sat-Link', 'Nodes'].map(item => (
                  <li key={item} className="hover:text-cyber-neon cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-white/10 uppercase tracking-widest">© 2026 TRACE.LAB // ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-[9px] font-black text-white/10 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-white">Encrypted Privacy</a>
            <a href="#" className="hover:text-white">Network Terms</a>
          </div>
        </div>
      </footer>

      {/* Blog Detail Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#030303]/90 backdrop-blur-2xl"
              onClick={() => setSelectedBlog(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-secondary border border-cyber-border rounded-[2.5rem] shadow-neon"
            >
              {/* Cover Image in Modal */}
              <div className="h-64 md:h-96 w-full relative">
                <img 
                  src={selectedBlog.imageUrl} 
                  alt={selectedBlog.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent" />
                <button 
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-xl border border-white/10 text-white rounded-full hover:bg-cyber-neon hover:text-black transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 md:p-16 space-y-8">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-md bg-cyber-neon/10 border border-cyber-neon/20 text-[10px] font-black uppercase tracking-widest text-cyber-neon">
                    {selectedBlog.category}
                  </span>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                    {selectedBlog.title}
                  </h2>
                  <div className="flex items-center gap-6 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><User size={14} /> {selectedBlog.author}</span>
                    <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(selectedBlog.createTime).toLocaleDateString()}</span>
                    <span className="flex items-center gap-2"><Clock size={14} /> {selectedBlog.readingTime} read</span>
                  </div>
                </div>
                
                <div className="w-24 h-1 bg-gradient-to-r from-cyber-neon to-cyber-purple rounded-full" />
                
                <p className="text-lg md:text-xl text-white/60 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedBlog.content}
                </p>
                
                <div className="pt-16 border-t border-white/5 flex justify-between items-center">
                   <div className="flex gap-4">
                     {[Twitter, Mail].map((Icon, i) => (
                       <button key={i} className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-cyber-neon hover:text-black transition-all">
                         <Icon size={18} />
                       </button>
                     ))}
                   </div>
                   <button 
                     onClick={() => setSelectedBlog(null)}
                     className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-cyber-neon transition-colors"
                   >
                     Exit Transmission
                   </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
