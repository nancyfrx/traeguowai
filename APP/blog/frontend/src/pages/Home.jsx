import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { articleApi } from '../api';
import PostCard from '../components/PostCard';
import Hero from '../components/Hero';
import Newsletter from '../components/Newsletter';
import { Search, ArrowRight, Sparkles, Zap, Flame, ExternalLink } from 'lucide-react';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomImageIndex, setRandomImageIndex] = useState(0);

  // 模拟“文件夹”中的随机图片（图2风格的抽象艺术）
  const galleryImages = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop"
  ];

  useEffect(() => {
    // 随机切换图片逻辑
    const interval = setInterval(() => {
      setRandomImageIndex(Math.floor(Math.random() * galleryImages.length));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  const featuredPosts = articles.length > 0 ? articles.slice(0, 4) : [];
  const spotlightPost = articles.length > 3 ? articles[3] : (articles.length > 0 ? articles[0] : null);
  const recentPosts = articles.length > 4 ? articles.slice(4) : [];

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      {/* 沉浸式幻灯片 Hero */}
      <Hero articles={articles} />
      
      <main className="max-w-[1600px] mx-auto px-6 py-32 space-y-40">
        
        {/* 精选推荐 Section (复刻图1布局) */}
        <section>
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <Sparkles size={18} />
                <span className="text-xs font-black uppercase tracking-[0.3em]">编辑精选</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter italic">精选推荐</h2>
            </div>
          </div>
          
          {loading ? (
            <div className="animate-pulse glass-card rounded-[4rem] h-[600px] w-full" />
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-900/20 rounded-[4rem] border border-zinc-100 dark:border-zinc-900"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* 左侧：大图展示（复刻图1，带随机切换） */}
                <div className="p-12 md:p-20 flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-800/10">
                  <div className="relative aspect-square w-full max-w-[500px] group">
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={randomImageIndex}
                        src={galleryImages[randomImageIndex]} 
                        alt="Featured Art" 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-full object-cover rounded-lg shadow-2xl"
                      />
                    </AnimatePresence>
                    <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/5 pointer-events-none" />
                  </div>
                </div>

                {/* 右侧：文字内容（复刻图1） */}
                <div className="p-12 md:p-20 flex flex-col justify-center space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Featured Work</h3>
                    <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter italic">
                      {featuredPosts[0]?.title || "数字艺术的流动性与透明边界"}
                    </h2>
                  </div>

                  <div className="flex items-center gap-4 py-6 border-y border-zinc-100 dark:border-zinc-800">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-black font-black italic text-xl overflow-hidden">
                      <img 
                        src={featuredPosts[0]?.author?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=botto"} 
                        alt="Author" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-widest">
                          {featuredPosts[0]?.author?.nickname || "Botto"}
                        </span>
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-tighter">
                        0x5DC...77e4E
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                      {featuredPosts[0]?.summary || "探索数字资产在透明物理空间中的存在感，重新定义艺术品与收藏家之间的交互方式。"}
                    </p>
                    <div className="flex items-center gap-6">
                      <Link 
                        to={`/article/${featuredPosts[0]?.id}`}
                        className="px-10 py-4 border-2 border-black dark:border-white text-black dark:text-white font-black uppercase tracking-widest text-xs rounded-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all transform active:scale-95"
                      >
                        阅读全文
                      </Link>
                      <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                        <ExternalLink size={16} /> 分享作品
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </section>

        {/* 焦点展示 Section (Spotlight/Botto style) - 已删除第二个推荐卡片 */}

        {/* 最近更新 Section (Auctions/Recent) */}
        <section>
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <Flame size={18} />
                <span className="text-xs font-black uppercase tracking-[0.3em]">最新发布</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter italic">最近作品</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {loading ? (
              [1, 2, 3].map(i => (
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
