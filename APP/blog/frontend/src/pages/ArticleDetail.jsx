import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, ChevronLeft, MessageSquare, Heart, Share2, Edit3, Save, X } from 'lucide-react';
import { articleApi, commentApi } from '../api';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  
  // 编辑模式状态
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    summary: '',
    content: '',
    coverImage: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || id === 'undefined') {
        setLoading(false);
        return;
      }
      try {
        const [articleRes, commentsRes] = await Promise.all([
          articleApi.getById(id),
          commentApi.getByArticle(id)
        ]);
        setArticle(articleRes.data);
        setEditData({
          title: articleRes.data.title,
          summary: articleRes.data.summary,
          content: articleRes.data.content,
          coverImage: articleRes.data.coverImage
        });
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Failed to fetch article details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await articleApi.update(id, editData);
      setArticle(res.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('保存失败，请检查后端连接');
    } finally {
      setIsSaving(false);
    }
  };

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

  // 模拟额外的展示图片 (图3风格)
  const defaultImages = [
    "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop"
  ];

  const displayImages = [
    article?.coverImage || defaultImages[0],
    ...defaultImages
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-black min-h-screen"
    >
      {/* 1. 顶部大图 Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-zinc-950" />
        
        {/* 返回按钮 & 编辑按钮 */}
        <div className="absolute top-12 left-12 right-12 z-50 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">返回</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <X size={16} /> 取消
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-black hover:bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  <Save size={16} /> {isSaving ? '保存中...' : '保存发布'}
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest transition-all group"
              >
                <Edit3 size={16} className="group-hover:rotate-12 transition-transform" /> 编辑作品
              </button>
            )}
          </div>
        </div>

        {/* 主展示图 - 改为占满容器的横屏样式 */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative z-10 w-full h-full flex items-center justify-center"
        >
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        {/* 标题信息 - 浮在图片上方 */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          {isEditing ? (
            <div className="w-full max-w-4xl space-y-6">
              <input 
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({...editData, title: e.target.value})}
                className="w-full bg-transparent border-b-2 border-white/20 focus:border-white text-5xl md:text-8xl font-black text-white tracking-tighter text-center italic outline-none py-4 transition-all"
                placeholder="输入标题..."
              />
              <textarea 
                value={editData.summary}
                onChange={(e) => setEditData({...editData, summary: e.target.value})}
                className="w-full bg-transparent border border-white/20 focus:border-white text-white/80 text-sm md:text-xl max-w-2xl mx-auto font-medium tracking-tight outline-none p-4 rounded-xl resize-none text-center transition-all h-32"
                placeholder="输入摘要..."
              />
              <div className="pt-4">
                <input 
                  type="text"
                  value={editData.coverImage}
                  onChange={(e) => setEditData({...editData, coverImage: e.target.value})}
                  className="w-full max-w-md bg-white/10 border border-white/20 rounded-full px-6 py-2 text-[10px] text-white/50 outline-none focus:border-white transition-all text-center"
                  placeholder="封面图片 URL..."
                />
              </div>
            </div>
          ) : (
            <>
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
                {article.summary || "探索数字艺术与先锋设计的边界 — 开启一场沉浸式的视觉盛宴。"}
              </motion.p>
            </>
          )}
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

      {/* 2. 内容区块 - 深度复刻布局 */}
      <main className="max-w-[1400px] mx-auto px-6 py-32 space-y-48">
        
        {/* 查看系列按钮 */}
        <div className="flex justify-center">
          <button className="px-8 py-3 border border-zinc-200 dark:border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500">
            查看作品系列
          </button>
        </div>

        {/* Overview: 文字 + 方图 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
          <div className="space-y-8">
            <h3 className="text-2xl font-black italic tracking-tighter">概览 / Overview</h3>
            {isEditing ? (
              <textarea 
                value={editData.content}
                onChange={(e) => setEditData({...editData, content: e.target.value})}
                className="w-full h-[500px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-sm font-medium outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all resize-none"
                placeholder="使用 Markdown 编写正文内容..."
              />
            ) : (
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {article.content || "加载中..."}
                </ReactMarkdown>
              </div>
            )}
          </div>
          <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden group shadow-2xl">
            <img 
              src={displayImages[1]} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              alt="Art detail 1"
            />
          </div>
        </section>

        {/* About: 左图 + 右文字 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={displayImages[3]} 
              className="w-full h-full object-cover"
              alt="Art detail 2"
            />
          </div>
          <div className="space-y-8">
            <h3 className="text-2xl font-black italic tracking-tighter">关于艺术家 / About the Artist</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              这位创作者致力于跨学科的艺术探索，研究科学、技术与设计的融合。其作品深入探讨了物理与数字环境中的隐形关系，批判性地审视了由新兴技术驱动的社会与生态转变。
            </p>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              <span className="w-12 h-px bg-zinc-200 dark:bg-zinc-800" />
              <span>探索更多作品</span>
            </div>
          </div>
        </section>

        {/* Details: 左文字 + 右竖图 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
          <div className="space-y-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-black italic tracking-tighter">发布详情 / Release Details</h3>
              <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
                <li className="flex justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
                  <span>原件价值</span>
                  <span className="text-black dark:text-white italic">3.00 ETH</span>
                </li>
                <li className="flex justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
                  <span>金属版本</span>
                  <span className="text-black dark:text-white italic">2.00 ETH</span>
                </li>
                <li className="flex justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
                  <span>动画特效</span>
                  <span className="text-black dark:text-white italic">1.25 ETH</span>
                </li>
              </ul>
            </div>
            <p className="text-xs text-zinc-400 tracking-widest font-medium">
              * 所有作品均包含对应的 3D 打印物理版。
            </p>
          </div>
          <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={displayImages[4]} 
              className="w-full h-full object-cover"
              alt="Vertical display"
            />
          </div>
        </section>

        {/* 评论区块 - 保持原有功能但适配样式 */}
        <section className="pt-32 border-t border-zinc-100 dark:border-zinc-900">
          <div className="max-w-3xl mx-auto space-y-16">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black italic tracking-tighter">评论 ({comments.length})</h2>
              <div className="flex items-center gap-4">
                <button className="p-3 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                  <Heart size={20} className="text-zinc-400" />
                </button>
                <button className="p-3 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                  <Share2 size={20} className="text-zinc-400" />
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
