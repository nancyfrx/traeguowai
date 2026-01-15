import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Eye, FileText, Settings, LogOut, Sparkles } from 'lucide-react';
import { articleApi } from '../api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { logout } = useAuth();
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filteredArticles = activeCategory === 'ALL' 
    ? articles 
    : articles.filter(a => a.isFeatured && activeCategory === 'FEATURED');

  useEffect(() => {
    fetchArticles();
  }, [page]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await articleApi.getAll({
        page,
        size: 10,
        sort: 'createdAt,desc',
        publishedOnly: false,
        featuredOnly: false
      });
      setArticles(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (article) => {
    try {
      await articleApi.update(article.id, {
        ...article,
        isFeatured: !article.isFeatured
      });
      fetchArticles();
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        await articleApi.delete(id);
        setArticles(articles.filter(a => a.id !== id));
      } catch (error) {
        console.error('Failed to delete article:', error);
      }
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">管理面板</h1>
            <p className="text-zinc-500">欢迎回来，您可以管理文章、分类和系统设置</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin/article/new" className="btn-primary flex items-center gap-2">
              <Plus size={18} /> 新建文章
            </Link>
            <button onClick={logout} className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-8 rounded-3xl">
              <div className="text-zinc-500 text-sm mb-2">文章总数</div>
              <div className="text-4xl font-bold">{articles.length}</div>
            </div>
            <div className="glass-card p-8 rounded-3xl">
              <div className="text-zinc-500 text-sm mb-2">总浏览量</div>
              <div className="text-4xl font-bold">
                {articles.reduce((acc, curr) => acc + (curr.viewCount || 0), 0)}
              </div>
            </div>
            <nav className="glass-card p-4 rounded-3xl space-y-2">
              <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium">
                <FileText size={18} /> 文章管理
              </Link>
              <Link to="/admin/categories" className="flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl transition-colors">
                <Settings size={18} /> 分类管理
              </Link>
            </nav>
          </div>

          {/* Article List */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-3xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="px-8 py-6 font-semibold text-sm">标题</th>
                    <th className="px-8 py-6 font-semibold text-sm">分类</th>
                    <th className="px-8 py-6 font-semibold text-sm">状态</th>
                    <th className="px-8 py-6 font-semibold text-sm">精选</th>
                    <th className="px-8 py-6 font-semibold text-sm text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-medium group-hover:text-rose-500 transition-colors line-clamp-1">{article.title}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm text-zinc-500">{article.category?.name || '未分类'}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${article.isDraft ? 'bg-zinc-100 text-zinc-500' : 'bg-emerald-100 text-emerald-600'}`}>
                          {article.isDraft ? '草稿' : '已发布'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button 
                          onClick={() => toggleFeatured(article)}
                          className={`p-2 rounded-lg transition-all ${article.isFeatured ? 'bg-amber-50 text-amber-500' : 'text-zinc-300 hover:text-zinc-500'}`}
                          title={article.isFeatured ? '取消精选' : '设为精选'}
                        >
                          <Sparkles size={18} fill={article.isFeatured ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            to={`/article/${article.id}`}
                            className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                            title="预览"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link 
                            to={`/admin/article/edit/${article.id}`}
                            className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"
                            title="编辑"
                          >
                            <Edit3 size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(article.id)}
                            className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                            title="删除"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {articles.length === 0 && !loading && (
                <div className="py-20 text-center text-zinc-500">
                  暂无文章，点击上方按钮开始创作
                </div>
              )}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(prev => Math.max(0, prev - 1))}
                  disabled={page === 0}
                  className="px-6 py-2 rounded-xl border border-zinc-100 dark:border-zinc-800 disabled:opacity-30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-[10px] font-bold uppercase tracking-widest"
                >
                  上一页
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-10 h-10 rounded-xl text-[10px] font-bold transition-all ${
                        page === i 
                          ? 'bg-black dark:bg-white text-white dark:text-black' 
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={page === totalPages - 1}
                  className="px-6 py-2 rounded-xl border border-zinc-100 dark:border-zinc-800 disabled:opacity-30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-[10px] font-bold uppercase tracking-widest"
                >
                  下一页
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
