import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  LayoutGrid, 
  Grid, 
  Rows3, 
  Square, 
  ChevronDown, 
  Search,
  Clock,
  Heart
} from 'lucide-react';
import { articleApi } from '../api';

const Marketplace = () => {
  const navigate = useNavigate();
  const [layout, setLayout] = useState('grid-4'); // 'grid-1', 'grid-2', 'grid-4', 'grid-6'
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('CURATED');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await articleApi.getAll({ page: 0, size: 50 });
        setArticles(res.data.content || []);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredData = filter === 'All' 
    ? articles 
    : articles.filter(item => {
        if (filter === 'Primary Sales') return item.category?.id === 1;
        if (filter === 'Secondary Sales') return item.category?.id === 2;
        return true;
      });

  const getGridClass = () => {
    switch (layout) {
      case 'grid-1': return 'grid-cols-1 gap-24 max-w-4xl mx-auto';
      case 'grid-2': return 'grid-cols-1 md:grid-cols-2 gap-24';
      case 'grid-4': return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16';
      case 'grid-6': return 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-12';
      default: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-[1600px] mx-auto min-h-screen bg-white dark:bg-black">
      {/* Secondary Navigation */}
      <div className="flex items-center gap-12 mb-12 border-b border-zinc-100 dark:border-zinc-900 pb-6">
        {[
          { id: 'CURATED', label: '精选作品' },
          { id: 'ACTIVITY', label: '动态' },
          { id: 'TRENDING', label: '热门趋势' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-[12px] font-black tracking-[0.3em] transition-all relative ${
              activeTab === tab.id 
                ? 'text-black dark:text-white' 
                : 'text-zinc-300 hover:text-zinc-500'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute -bottom-6 left-0 right-0 h-0.5 bg-black dark:bg-white"
              />
            )}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-6">
          <button className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-[1px] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <SlidersHorizontal size={18} />
          </button>
          <div className="flex bg-zinc-50 dark:bg-zinc-900 p-1.5 rounded-[1px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            {['All', 'Primary Sales', 'Secondary Sales'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-[1px] ${
                  filter === f 
                    ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-zinc-50 dark:bg-zinc-900 p-1.5 rounded-[1px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            {[
              { id: 'grid-1', icon: Rows3 },
              { id: 'grid-2', icon: LayoutGrid },
              { id: 'grid-4', icon: Grid },
              { id: 'grid-6', icon: Square }
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => setLayout(l.id)}
                className={`p-2.5 transition-all rounded-[1px] ${
                  layout === l.id 
                    ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                <l.icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Art Grid */}
      <motion.div 
        layout
        className={`grid ${getGridClass()} transition-all duration-700 ease-[0.23, 1, 0.32, 1]`}
      >
        <AnimatePresence mode="popLayout">
          {filteredData.map((item) => (
            <ArtCard key={item.id} item={item} layout={layout} navigate={navigate} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const ArtCard = ({ item, layout, navigate }) => {
  const isLarge = layout === 'grid-1';
  const isCompact = layout === 'grid-6';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`group cursor-pointer ${isLarge ? 'flex gap-12 items-center mb-12' : 'space-y-4'}`}
      onClick={() => navigate(`/product/${item.id}`)}
    >
      {/* Image Container with Grey Background - 复刻图示样式 */}
      <div className={`relative bg-zinc-50 dark:bg-zinc-900/50 rounded-[1px] overflow-hidden flex items-center justify-center p-4 transition-all duration-500 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/50 shadow-sm group-hover:shadow-md perspective-1000 ${
        isLarge ? 'w-2/3 aspect-video' : 'aspect-[3/4] w-full'
      }`}>
        <div className="relative w-full h-full flex items-center justify-center preserve-3d">
          <img 
            src={item.coverImage} 
            alt={item.title}
            className="max-w-[90%] max-h-[90%] object-contain 
              shadow-[0_20px_40px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)]
              ring-1 ring-black/10 dark:ring-white/10
              transition-all duration-500
              group-hover:scale-[1.04] 
              group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] dark:group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]
              group-hover:-translate-y-3"
          />
        </div>
        
        {/* Hover Overlay - Simplified */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </div>

      {/* Content Section - 复刻图示元数据展示 */}
      <div className={`space-y-3 px-1 ${isLarge ? 'flex-1' : ''}`}>
        <h3 className={`font-bold tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors ${
          isCompact ? 'text-[11px] truncate' : 'text-sm'
        }`}>
          {item.title}
        </h3>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full overflow-hidden bg-zinc-100">
            <img 
              src={item.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`} 
              alt="艺术家" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="text-[10px] font-medium text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
            {item.author?.nickname || '艺术家'}
          </span>
        </div>

        {!isCompact && (
          <div className="pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900">
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">最近成交价</p>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  {item.price ? item.price.toFixed(3) : (item.likeCount / 1000).toFixed(3)}Ξ
                </span>
                <span className="text-[10px] font-medium text-zinc-400">
                  (${(item.price ? item.price * 3100 : item.likeCount * 3.1).toFixed(0)})
                </span>
              </div>
            </div>
            
            <button 
              className="px-6 py-2 bg-transparent text-black dark:text-white text-[10px] font-black uppercase tracking-[0.1em] rounded-md transition-all 
                border-2 border-black dark:border-white
                shadow-[0_4px_0_0_#000] dark:shadow-[0_4px_0_0_#fff] 
                hover:shadow-[0_2px_0_0_#000] dark:hover:shadow-[0_2px_0_0_#fff] hover:translate-y-[2px]
                active:shadow-none active:translate-y-[4px]"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${item.id}`);
              }}
            >
              BUY
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Marketplace;
