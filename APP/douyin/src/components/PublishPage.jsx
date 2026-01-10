import React, { useState, useRef } from 'react';
import { Camera, X, Plus, Film, Music, MapPin, Users, Lock, ChevronRight, Upload } from 'lucide-react';

export default function PublishPage({ onClose }) {
  const [description, setDescription] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        alert('请选择视频文件');
      }
    }
  };

  const handlePublish = () => {
    if (!videoFile) {
      alert('请先上传视频');
      return;
    }
    if (!description.trim()) {
      alert('请输入视频描述');
      return;
    }
    
    setIsPublishing(true);
    // 模拟上传过程
    setTimeout(() => {
      const newVideo = {
        id: 'user-' + Date.now(),
        videoUrl: previewUrl, // In a real app, this would be the URL returned from the server
        description: description,
        author: '前端开发者',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
        likes: '0',
        comments: '0',
        shares: '0',
        isMuted: true,
        isLiked: false
      };

      // Get existing published videos from localStorage
      const existingVideos = JSON.parse(localStorage.getItem('publishedVideos') || '[]');
      localStorage.setItem('publishedVideos', JSON.stringify([newVideo, ...existingVideos]));

      // Dispatch custom event to notify other components (like ProfilePage)
      window.dispatchEvent(new CustomEvent('videoPublished', { detail: newVideo }));

      setIsPublishing(false);
      setIsSuccess(true);
      // 1.5秒后自动关闭
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-slide-up">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
        <button onClick={onClose} className="text-white p-2"><X className="w-6 h-6" /></button>
        <h2 className="text-white font-bold">发布视频</h2>
        <button 
          onClick={handlePublish}
          disabled={isPublishing || isSuccess}
          className={`px-6 py-1.5 rounded-full text-white font-bold transition-all ${isPublishing || isSuccess ? 'bg-zinc-700 text-zinc-500' : 'bg-red-500 active:scale-95'}`}
        >
          {isPublishing ? '发布中' : isSuccess ? '成功' : '发布'}
        </button>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="p-4 space-y-6">
          <div className="flex gap-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="添加作品描述..."
              className="flex-1 bg-transparent text-white resize-none outline-none h-32 text-base pt-2"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-28 h-36 bg-zinc-900 rounded-lg flex flex-col items-center justify-center border border-dashed border-zinc-700 overflow-hidden relative group cursor-pointer active:scale-95 transition-transform"
            >
              {previewUrl ? (
                <>
                  <video src={previewUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white">更换视频</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-2">
                    <Plus className="w-6 h-6 text-zinc-400" />
                  </div>
                  <span className="text-zinc-500 text-[10px]">选择视频</span>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="video/*" 
                className="hidden" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 py-4 border-t border-white/5 active:bg-white/5 px-2 transition-colors">
              <MapPin className="w-5 h-5 text-white/60" />
              <span className="flex-1 text-sm text-white">添加地点</span>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </div>
            <div className="flex items-center gap-2 py-4 border-t border-white/5 active:bg-white/5 px-2 transition-colors">
              <Users className="w-5 h-5 text-white/60" />
              <span className="flex-1 text-sm text-white">标记他人</span>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </div>
            <div className="flex items-center gap-2 py-4 border-t border-white/5 active:bg-white/5 px-2 transition-colors">
              <Lock className="w-5 h-5 text-white/60" />
              <span className="flex-1 text-sm text-white">谁可以看</span>
              <span className="text-sm text-white/40 mr-1">公开</span>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </div>
          </div>

          <div className="bg-zinc-900/50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                <Film className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">保存到相册</p>
                <p className="text-[10px] text-white/40">发布后将自动保存到手机</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-green-500 rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 发布成功提示 */}
      {isSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in pointer-events-none">
          <div className="bg-zinc-800/95 text-white px-8 py-4 rounded-2xl flex flex-col items-center gap-3 shadow-2xl border border-white/10 scale-110">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold">发布成功</span>
          </div>
        </div>
      )}
    </div>
  );
}
