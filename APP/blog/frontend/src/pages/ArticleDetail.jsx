import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Edit3, MessageSquare, Send, User, Heart, Share2, Eye } from 'lucide-react';
import { articleApi, commentApi } from '../api';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const viewIncremented = useRef(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id || id === 'undefined') {
        setLoading(false);
        return;
      }

      // 仅在首次挂载且 ID 存在时增加浏览量
      if (!viewIncremented.current) {
        try {
          await articleApi.view(id);
          viewIncremented.current = true;
        } catch (error) {
          console.error('Failed to increment view count:', error);
        }
      }

      // Check liked status from localStorage
      const liked = localStorage.getItem(`liked_${id}`);
      if (liked === 'true') {
        setIsLiked(true);
      }

      try {
        const [articleRes, commentsRes] = await Promise.all([
          articleApi.getById(id),
          commentApi.getByArticle(id)
        ]);
        const data = articleRes.data;
        // 增加对 contentBlocks 的鲁棒性处理
        if (data.contentBlocks) {
          if (typeof data.contentBlocks === 'string') {
            try {
              data.contentBlocks = JSON.parse(data.contentBlocks);
            } catch (e) {
              console.error('Failed to parse contentBlocks:', e);
              data.contentBlocks = [];
            }
          }
        } else {
          data.contentBlocks = [];
        }
        
        setArticle(data);
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Failed to fetch article details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    try {
      const res = await commentApi.create({
        content: commentContent,
        article: { id: parseInt(id) },
        isApproved: true // Auto approve for demo
      });
      setComments([...comments, res.data]);
      setCommentContent('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await articleApi.unlike(id);
        setArticle(prev => ({ ...prev, likeCount: Math.max(0, (prev.likeCount || 0) - 1) }));
        setIsLiked(false);
        localStorage.setItem(`liked_${id}`, 'false');
      } else {
        await articleApi.like(id);
        setArticle(prev => ({ ...prev, likeCount: (prev.likeCount || 0) + 1 }));
        setIsLiked(true);
        localStorage.setItem(`liked_${id}`, 'true');
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('链接已复制到剪贴板');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
    </div>
  );

  if (!article) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">文章不存在</h2>
      <Link to="/" className="text-rose-500 hover:underline flex items-center gap-1">
        <ChevronLeft size={20} /> 返回首页
      </Link>
    </div>
  );

  const contentBlocks = Array.isArray(article.contentBlocks) ? article.contentBlocks : [];
  const articleContent = article.content || article.summary || "";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-black min-h-screen relative"
    >

      {/* 1. 顶部大图 Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-zinc-950" />
        
        {/* 返回按钮 & 编辑按钮 */}
        <div className="absolute top-12 left-12 right-12 z-50 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">返回</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              to={`/admin/article/edit/${id}`}
              className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest transition-all group"
            >
              <Edit3 size={16} className="group-hover:rotate-12 transition-transform" /> 编辑作品
            </Link>
          </div>
        </div>

        {/* 主展示图 */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative z-10 w-full h-full flex items-center justify-center"
        >
          <img 
            src={article.coverImage || "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop"} 
            alt={article.title} 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        {/* 标题信息 */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 italic drop-shadow-2xl"
          >
            {article.title}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 text-sm md:text-xl max-w-2xl mx-auto font-medium tracking-tight drop-shadow-lg"
          >
            {article.summary}
          </motion.p>
        </div>

        {/* 滚动提示 */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/20"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* 2. 内容区块 */}
      <main className="max-w-[1400px] mx-auto px-6 py-12 space-y-16">
        
        {/* 正文文本部分 */}
        {articleContent && (
          <section className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4">
              <span className="w-12 h-px bg-zinc-200 dark:bg-zinc-800" />
              <span>作品解读 / STORY</span>
            </div>
            <div className="text-base md:text-lg font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
              {articleContent}
            </div>
          </section>
        )}
        
        {/* 渲染 contentBlocks */}
        <div className="space-y-20">
          {contentBlocks.map((block, index) => {
            // 定义几种不同的布局样式
            const layouts = [
              { container: "max-w-5xl mx-auto", aspect: "aspect-video", grid: "grid-cols-1 gap-6" }, // 横屏大图
              { container: "max-w-3xl mx-auto", aspect: "aspect-[3/4]", grid: "grid-cols-1 gap-6" }, // 竖屏
              { container: "max-w-6xl mx-auto", aspect: "aspect-[16/9]", grid: "md:grid-cols-2 gap-12 items-center" }, // 左右布局
              { container: "max-w-4xl mx-auto", aspect: "aspect-square", grid: "grid-cols-1 gap-6" }, // 正方形
            ];
            const layout = layouts[index % layouts.length];
            const isReverse = index % 3 === 0;

            return (
              <section key={index} className={`${layout.container} px-4`}>
                <div className={`grid ${layout.grid} ${isReverse ? 'md:flex-row-reverse' : ''}`}>
                  {/* 图片部分 */}
                  <div className={`relative ${layout.aspect} bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl ${isReverse && layout.grid.includes('md:grid-cols-2') ? 'md:order-2' : ''}`}>
                    {block.image ? (
                      <img 
                        src={block.image} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                        alt={`Block image ${index + 1}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
                        未上传配图
                      </div>
                    )}
                  </div>
                  
                  {/* 文字部分 */}
                  <div className={`space-y-4 flex flex-col justify-center ${isReverse && layout.grid.includes('md:grid-cols-2') ? 'md:order-1' : ''}`}>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                      <span className="w-12 h-px bg-zinc-200 dark:bg-zinc-800" />
                      <span>{index % 2 === 0 ? '细节展示' : '创作背景'} / {index + 1}</span>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed font-medium">
                      {block.text || "创作者尚未为此图片添加描述..."}
                    </p>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* 评论区块 */}
        <section className="pt-32 border-t border-zinc-100 dark:border-zinc-900">
          <div className="max-w-3xl mx-auto space-y-16">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black italic tracking-tighter">评论 ({comments.length})</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-full">
                  <Eye size={16} className="text-zinc-400" />
                  <span className="text-[10px] font-black italic text-zinc-500">{article.viewCount || 0}</span>
                </div>
                <button 
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors group"
                >
                  <Heart size={16} className={`transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-zinc-400 group-hover:text-rose-500'}`} />
                  <span className={`text-[10px] font-black italic ${isLiked ? 'text-rose-500' : 'text-zinc-400'}`}>
                    {article.likeCount || 0}
                  </span>
                </button>
                <button 
                  onClick={handleShare}
                  className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                  title="复制链接"
                >
                  <Share2 size={16} className="text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCommentSubmit} className="space-y-6">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="加入讨论，分享您的看法..."
                className="w-full px-8 py-6 bg-zinc-50 dark:bg-zinc-900 border-none rounded-3xl focus:ring-2 focus:ring-black dark:focus:ring-white transition-all resize-none h-40 text-sm font-medium"
              />
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={!commentContent.trim()}
                  className="px-12 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                >
                  发表评论
                </button>
              </div>
            </form>

            <div className="space-y-12">
              {comments.map((comment, index) => (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <User size={20} className="text-zinc-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest italic">匿名艺术家</span>
                      <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed font-medium">
                      {comment.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* 页脚间距 */}
      <div className="h-40" />
    </motion.div>
  );
};

export default ArticleDetail;
