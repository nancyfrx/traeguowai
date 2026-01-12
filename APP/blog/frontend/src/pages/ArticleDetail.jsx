import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, ChevronLeft, MessageSquare, Heart, Share2 } from 'lucide-react';
import { articleApi, commentApi } from '../api';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, commentsRes] = await Promise.all([
          articleApi.getById(id),
          commentApi.getByArticle(id)
        ]);
        setArticle(articleRes.data);
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-6 pt-32 pb-20"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-12 transition-colors group">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>返回首页</span>
      </Link>

      {/* Hero Image */}
      {article.coverImage && (
        <div className="w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl">
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-zinc-500 mb-6">
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px]">
              {article.category?.name || '未分类'}
            </span>
            <span className="flex items-center gap-1 uppercase tracking-tighter font-bold text-[10px]"><Calendar size={14} /> {new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1]">
            {article.title}
          </h1>
          <div className="flex items-center justify-between py-8 border-y border-zinc-100 dark:border-zinc-900">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-bold overflow-hidden border border-zinc-100 dark:border-zinc-800">
                {article.author?.avatar ? (
                  <img src={article.author.avatar} alt={article.author.nickname} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl italic">{article.author?.nickname?.[0] || 'A'}</span>
                )}
              </div>
              <div>
                <div className="font-black uppercase tracking-widest text-xs">{article.author?.nickname || 'Anonymous Artist'}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Creator</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all hover:scale-110 active:scale-95"><Heart size={20} /></button>
              <button className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all hover:scale-110 active:scale-95"><Share2 size={20} /></button>
            </div>
          </div>
        </header>

        <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:tracking-tighter prose-headings:font-black prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400 mb-20">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {article.content}
          </ReactMarkdown>
        </article>

        {/* Comments Section */}
        <section className="pt-20 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-12">
            <MessageSquare size={24} />
            <h2 className="text-2xl font-bold uppercase tracking-tighter italic">Comments ({comments.length})</h2>
          </div>

          <form onSubmit={handleCommentSubmit} className="mb-16">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Join the conversation..."
              className="w-full p-8 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all min-h-[150px] mb-6 text-sm"
            />
            <div className="flex justify-end">
              <button type="submit" className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
                Post Comment
              </button>
            </div>
          </form>

          <div className="space-y-12">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-bold flex-shrink-0 border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                  {comment.nickname?.[0] || 'C'}
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-black uppercase tracking-widest text-[10px]">{comment.nickname || 'Collector'}</div>
                    <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">{new Date(comment.createdAt).toLocaleDateString()}</div>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-center py-20 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                No comments yet. Be the first to share your thoughts.
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default ArticleDetail;
