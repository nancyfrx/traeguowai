import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, Eye, Image as ImageIcon } from 'lucide-react';
import { articleApi } from '../api';

const ArticleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    coverImage: '',
    isDraft: false,
    category: { id: 1 } // Default category
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchArticle = async () => {
        try {
          const res = await articleApi.getById(id);
          setFormData(res.data);
        } catch (error) {
          console.error('Failed to fetch article:', error);
        }
      };
      fetchArticle();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await articleApi.update(id, formData);
      } else {
        await articleApi.create(formData);
      }
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Failed to save article:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-black dark:hover:text-white transition-all group font-bold uppercase tracking-widest text-[10px]">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 返回首页
          </Link>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setFormData({ ...formData, isDraft: !formData.isDraft })}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                formData.isDraft 
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border-transparent' 
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'
              }`}
            >
              {formData.isDraft ? '草稿' : '公开'}
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-all shadow-xl disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} /> {loading ? '发布中...' : '发布作品'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">标题</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="作品名称"
                className="w-full text-5xl md:text-7xl font-black bg-transparent border-none focus:outline-none placeholder:text-zinc-200 dark:placeholder:text-zinc-800 tracking-tighter"
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">摘要</label>
              <textarea 
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="描述您的数字创作..."
                className="w-full p-8 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all min-h-[120px] text-lg leading-relaxed"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                <span>正文 (支持 Markdown)</span>
                <button className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors"><Eye size={14} /> 预览</button>
              </div>
              <textarea 
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="作品背后的故事..."
                className="w-full p-8 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all min-h-[600px] font-mono leading-relaxed"
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-8 rounded-[2.5rem] space-y-8 border border-zinc-100 dark:border-zinc-900 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">媒体预览</h3>
              <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 relative overflow-hidden group">
                {formData.coverImage ? (
                  <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                      <ImageIcon className="text-zinc-400" size={24} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">上传图片链接</span>
                  </>
                )}
                <div className="absolute inset-x-6 bottom-6 transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <input 
                    type="text" 
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="图片链接 (例如 Unsplash 等)"
                    className="w-full p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-zinc-100 dark:border-zinc-800 rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:outline-none shadow-2xl"
                  />
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-8 rounded-[2.5rem] space-y-8 border border-zinc-100 dark:border-zinc-900 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">作品属性</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">系列 / 分类</label>
                  <select 
                    className="w-full p-4 bg-white dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none text-xs font-bold uppercase tracking-widest"
                    value={formData.category.id}
                    onChange={(e) => setFormData({ ...formData, category: { id: parseInt(e.target.value) } })}
                  >
                    <option value="1">数字艺术</option>
                    <option value="2">摄影作品</option>
                    <option value="3">生成艺术</option>
                    <option value="4">生活方式</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEdit;
