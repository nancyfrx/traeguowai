import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { getFileUrl } from '../api';

const PostCard = ({ post }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="group relative flex flex-col"
  >
    <Link to={`/article/${post.id}`} className="block relative aspect-square overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 shadow-sm transition-all duration-700 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] group-hover:-translate-y-2">
      {/* 封面图 - 使用图3风格（抽象艺术） */}
      <img 
        src={getFileUrl(post.coverImage) || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"} 
        alt={post.title}
        className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
      />
      
      {/* 悬停遮罩 */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
          <ExternalLink className="text-black" size={24} />
        </div>
      </div>

      {/* 类别标签 */}
      <div className="absolute top-6 left-6">
        <span className="px-4 py-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-full text-[10px] font-black tracking-[0.2em] uppercase text-zinc-900 dark:text-zinc-100 shadow-xl">
          {post.category?.name || '未分类'}
        </span>
      </div>
    </Link>

    {/* 文章信息 */}
    <div className="mt-8 space-y-4 px-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <img 
              src={getFileUrl(post.author?.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || 'admin'}`} 
              alt="Author" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            {post.author?.nickname || '管理员'}
          </span>
        </div>
        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-tighter">
          {new Date(post.createdAt).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
        </span>
      </div>

      <Link to={`/article/${post.id}`}>
        <h3 className="text-2xl font-black leading-tight tracking-tighter text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-500 transition-colors line-clamp-2 italic">
          {post.title}
        </h3>
      </Link>
      
      <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 font-medium leading-relaxed">
        {post.summary}
      </p>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-zinc-300 uppercase tracking-[0.3em]">当前价值</span>
          <span className="text-xs font-black uppercase tracking-widest">无价之宝</span>
        </div>
        <Link 
          to={`/article/${post.id}`}
          className="px-6 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
        >
          查看全文
        </Link>
      </div>
    </div>
  </motion.div>
);

export default PostCard;
