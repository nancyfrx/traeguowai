import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { articleApi } from '../api';
import PostCard from '../components/PostCard';
import Hero from '../components/Hero';
import Newsletter from '../components/Newsletter';
import { Search, ArrowRight, Sparkles, Zap, Flame } from 'lucide-react';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await articleApi.getAll();
        setArticles(res.data.content);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const featuredPosts = articles.slice(0, 3);
  const spotlightPost = articles[3] || articles[0];
  const recentPosts = articles.slice(4);

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      {/* 沉浸式幻灯片 Hero */}
      <Hero />
      
      <main className="max-w-[1600px] mx-auto px-6 py-32 space-y-40">
        
        {/* 精选文章 Section (Featured) */}
        <section>
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <Sparkles size={18} />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Editor's Pick</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter italic">精选推荐</h2>
            </div>
            <button className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] hover:text-zinc-500 transition-all">
              浏览全部 <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="animate-pulse space-y-6">
                  <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-[2rem]" />
                  <div className="h-8 bg-zinc-100 dark:bg-zinc-900 rounded-xl w-3/4" />
                  <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg w-full" />
                </div>
              ))
            ) : (
              featuredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </section>

        {/* 焦点展示 Section (Spotlight/Botto style) */}
        {spotlightPost && (
          <section className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-900/30 rounded-[4rem] p-12 md:p-24 border border-zinc-100 dark:border-zinc-900">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="aspect-square rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] group"
              >
                <img 
                  src={spotlightPost.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"} 
                  alt="Spotlight" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </motion.div>
              <div className="space-y-10">
                <div className="flex items-center gap-2 text-rose-500">
                  <Zap size={20} fill="currentColor" />
                  <span className="text-xs font-black uppercase tracking-[0.4em]">Spotlight Art</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter italic">
                  {spotlightPost.title}
                </h2>
                <p className="text-2xl text-zinc-500 dark:text-zinc-400 leading-tight font-medium tracking-tight max-w-xl">
                  {spotlightPost.summary}
                </p>
                <div className="pt-4">
                  <button className="px-12 py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-full hover:opacity-80 transition-all transform hover:-translate-y-1 shadow-2xl">
                    阅读深度解析
                  </button>
                </div>
              </div>
            </div>
            
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-zinc-200/50 dark:bg-zinc-800/20 rounded-full blur-[120px]" />
          </section>
        )}

        {/* 最近更新 Section (Auctions/Recent) */}
        <section>
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <Flame size={18} />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Latest Drops</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter italic">最近作品</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
                  <div className="h-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg w-3/4" />
                </div>
              ))
            ) : (
              recentPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </section>

        {/* 邮件订阅 */}
        <Newsletter />
      </main>
    </div>
  );
};

export default Home;
