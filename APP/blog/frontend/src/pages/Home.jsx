import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { articleApi } from '../api';
import PostCard from '../components/PostCard';
import Hero from '../components/Hero';
import MarqueeSection from '../components/MarqueeSection';
import { Search, ArrowRight, Sparkles, Zap, Flame, ExternalLink } from 'lucide-react';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomImageIndex, setRandomImageIndex] = useState(0);
  const [featuredFromDb, setFeaturedFromDb] = useState(null);

  // 计算推荐和最新文章
  const featuredPosts = featuredFromDb ? [featuredFromDb] : (articles.length > 0 ? articles.slice(0, 1) : []);
  const recentPosts = articles.length > 1 ? articles.slice(1, 4) : [];

  // 模拟“文件夹”中的随机图片（图2风格的抽象艺术）
  const galleryImages = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop"
  ];

  // 提取推荐文章的图片
  const featuredImages = React.useMemo(() => {
    const post = featuredPosts[0];
    if (!post) return galleryImages;
    
    const images = [];
    if (post.coverImage) images.push(post.coverImage);
    
    if (post.contentBlocks) {
      try {
        const blocks = typeof post.contentBlocks === 'string' 
          ? JSON.parse(post.contentBlocks) 
          : post.contentBlocks;
        blocks.forEach(block => {
          if (block.image) images.push(block.image);
        });
      } catch (e) {
        console.error('Failed to parse content blocks', e);
      }
    }
    
    return images.length > 0 ? images : galleryImages;
  }, [featuredPosts]);

  useEffect(() => {
    // 随机切换图片逻辑
    if (featuredImages.length <= 1) return;
    const interval = setInterval(() => {
      setRandomImageIndex(prev => (prev + 1) % featuredImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredImages]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await articleApi.getAll();
        setArticles(res.data.content);
        
        // Fetch featured articles
        const featuredRes = await articleApi.getAll({ featuredOnly: true, size: 1 });
        if (featuredRes.data.content && featuredRes.data.content.length > 0) {
          setFeaturedFromDb(featuredRes.data.content[0]);
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

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
                  {/* 这里删除了 art gallery 图片栏，仅保留精选推荐的图片展示逻辑 */}
                  <Link 
                    to={featuredPosts[0] ? `/article/${featuredPosts[0].id}` : '#'}
                    className="relative aspect-square w-full max-w-[500px] group block"
                  >
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={randomImageIndex}
                        src={featuredImages[randomImageIndex] || galleryImages[0]} 
                        alt="Featured Art" 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-full object-cover rounded-lg shadow-2xl"
                      />
                    </AnimatePresence>
                    <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/5 pointer-events-none" />
                    {/* 悬停提示 */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg flex items-center justify-center">
                      <div className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        查看作品详情
                      </div>
                    </div>
                  </Link>
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

          {!loading && articles.length > 4 && (
            <div className="flex justify-center mt-20">
              <Link 
                to="/market" 
                className="group flex items-center gap-4 px-12 py-5 border-2 border-black dark:border-white rounded-full text-xs font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500 shadow-2xl hover:shadow-zinc-200 dark:hover:shadow-zinc-800"
              >
                <span>进入艺术市场</span>
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          )}
        </section>

        {/* 艺术市场链接等内容 */}
      </main>

      {/* 无限滚动走马灯 */}
      <MarqueeSection articles={articles} />
    </div>
  );
};

export default Home;
