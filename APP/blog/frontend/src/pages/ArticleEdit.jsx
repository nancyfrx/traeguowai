import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, Eye, Image as ImageIcon, X, Plus } from 'lucide-react';
import { articleApi, uploadApi } from '../api';

const ArticleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    coverImage: '',
    contentBlocks: [],
    isDraft: false,
    category: { id: 1 } // Default category
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchArticle = async () => {
        try {
          const res = await articleApi.getById(id);
          const data = res.data;
          // Parse contentBlocks if it's a string
          if (typeof data.contentBlocks === 'string') {
            try {
              data.contentBlocks = JSON.parse(data.contentBlocks);
            } catch (e) {
              data.contentBlocks = [];
            }
          }
          if (!data.contentBlocks || data.contentBlocks.length === 0) {
            data.contentBlocks = [{ image: '', text: '' }];
          }
          setFormData(data);
        } catch (error) {
          console.error('Failed to fetch article:', error);
        }
      };
      fetchArticle();
    } else {
      setFormData(prev => ({
        ...prev,
        contentBlocks: [{ image: '', text: '' }]
      }));
    }
  }, [id, isEdit]);

  const handleFileUpload = async (file, field, index = null) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.upload(file);
      const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:8080' 
        : '';
      const fileUrl = `${baseUrl}${res.data.url}`;
      
      if (index !== null) {
        const newBlocks = [...formData.contentBlocks];
        newBlocks[index].image = fileUrl;
        setFormData(prev => ({ ...prev, contentBlocks: newBlocks }));
      } else {
        setFormData(prev => ({ ...prev, [field]: fileUrl }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('图片上传失败，请检查后端连接');
    } finally {
      setUploading(false);
    }
  };

  const addBlock = () => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, { image: '', text: '' }]
    }));
  };

  const removeBlock = (index) => {
    const newBlocks = formData.contentBlocks.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, contentBlocks: newBlocks }));
  };

  const updateBlock = (index, field, value) => {
    const newBlocks = [...formData.contentBlocks];
    newBlocks[index][field] = value;
    setFormData(prev => ({ ...prev, contentBlocks: newBlocks }));
  };

  const handlePreview = () => {
    if (isEdit) {
      window.open(`/article/${id}`, '_blank');
    } else {
      alert('请先保存作品后再预览');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        contentBlocks: JSON.stringify(formData.contentBlocks)
      };
      
      let savedId = id;
      if (isEdit) {
        await articleApi.update(id, submitData);
      } else {
        const res = await articleApi.create(submitData);
        if (res.data && res.data.id) {
          savedId = res.data.id;
        }
      }
      alert('保存成功');
      if (!isEdit && savedId) {
        navigate(`/admin/article/edit/${savedId}`, { replace: true });
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        isDraft: false,
        contentBlocks: JSON.stringify(formData.contentBlocks)
      };
      
      if (isEdit) {
        await articleApi.update(id, submitData);
      } else {
        await articleApi.create(submitData);
      }
      alert('发布成功');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('发布失败，请检查内容是否完整');
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
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePreview}
              className="px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-2"
            >
              <Eye size={14} /> 预览
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border border-black dark:border-white bg-transparent text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-2"
            >
              <Save size={14} /> 保存
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
          <div className="lg:col-span-12 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">
              <div className="lg:col-span-8 flex flex-col space-y-16">
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
                
                <div className="space-y-4 flex-1 flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">摘要</label>
                  <textarea 
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="描述您的数字创作..."
                    className="w-full flex-1 p-8 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all min-h-[120px] text-lg leading-relaxed resize-none"
                  />
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col space-y-10">
                <div className="bg-zinc-50 dark:bg-zinc-900/30 p-8 rounded-[2.5rem] space-y-8 border border-zinc-100 dark:border-zinc-900 shadow-sm flex-1 flex flex-col">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">顶部 Hero 图片</h3>
                  <div className="flex-1 aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 relative overflow-hidden group">
                    {formData.coverImage ? (
                      <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                          <ImageIcon className="text-zinc-400" size={24} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          {uploading ? '上传中...' : '设置顶部背景图'}
                        </span>
                      </>
                    )}
                    
                    <label className="absolute inset-0 cursor-pointer">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'coverImage')}
                      />
                    </label>

                    <div className="absolute inset-x-6 bottom-6 transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 pointer-events-none">
                      <div className="w-full p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-zinc-100 dark:border-zinc-800 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-center shadow-2xl">
                        点击区域上传或更换图片
                      </div>
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

            {/* 动态内容块 - 全宽布局 */}
            <div className="space-y-10 pt-16 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black italic tracking-tighter">内容详情 / Content Details</h3>
                <button 
                  onClick={addBlock}
                  className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-all rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl"
                >
                  <Plus size={14} /> 添加新图文块
                </button>
              </div>
              
              <div className="space-y-16">
                {formData.contentBlocks.map((block, index) => (
                  <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative group/block">
                    {/* 左侧：正文内容 - 变大 (8/12) */}
                    <div className="lg:col-span-8 space-y-4 flex flex-col">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">正文内容 {index + 1}</label>
                        {formData.contentBlocks.length > 1 && (
                          <button 
                            onClick={() => removeBlock(index)}
                            className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                            title="删除此块"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <textarea 
                        value={block.text}
                        onChange={(e) => updateBlock(index, 'text', e.target.value)}
                        placeholder="输入这段配图对应的正文..."
                        className="w-full p-8 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 rounded-[2.5rem] text-base font-medium focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all resize-none min-h-[350px]"
                      />
                    </div>

                    {/* 右侧：图片上传 - 缩小 (4/12) */}
                    <div className="lg:col-span-4 space-y-4 flex flex-col">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">配图 {index + 1}</label>
                      <div className="aspect-video bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 relative overflow-hidden group/img">
                        {block.image ? (
                          <img src={block.image} alt={`Block ${index}`} className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                              <ImageIcon className="text-zinc-400" size={24} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">点击上传配图</span>
                          </>
                        )}

                        <label className="absolute inset-0 cursor-pointer">
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e.target.files[0], 'contentBlocks', index)}
                          />
                        </label>

                        {block.image && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white border border-white/20 px-6 py-3 rounded-full">更换图片</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEdit;
