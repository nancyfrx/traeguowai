import React, { useState, useRef, useEffect } from 'react';
import { Settings, Menu, Share2, Grid, Heart, Lock, Bookmark, Play, X, Camera, ChevronRight, Trash2, EyeOff } from 'lucide-react';
import { mockVideos } from '../data';
import { cn } from '../utils';

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState({
    nickname: '前端开发者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
    bio: '热爱生活，热爱编程。分享代码与日常。✨',
    douyinId: 'trae_coder_001'
  });

  const [userVideos, setUserVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('grid');
  const [brokenVideoIds, setBrokenVideoIds] = useState(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...userInfo });
  const [showVideoModal, setShowVideoModal] = useState(null);
  const [privateVideoIds, setPrivateVideoIds] = useState(new Set());
  const [favoriteVideoIds, setFavoriteVideoIds] = useState(new Set([mockVideos[0].id, mockVideos[1].id]));
  const [likedVideoIds, setLikedVideoIds] = useState(new Set([mockVideos[2].id, mockVideos[3].id]));

  const avatarInputRef = useRef(null);

  // Load videos including published ones
  const loadVideos = () => {
    const published = JSON.parse(localStorage.getItem('publishedVideos') || '[]');
    // Use some mock videos as initial works, but combine with published ones
    const initialWorks = mockVideos.slice(0, 5); 
    setUserVideos([...published, ...initialWorks]);
  };

  useEffect(() => {
    loadVideos();

    // Listen for new publications
    const handlePublished = () => {
      loadVideos();
    };

    window.addEventListener('videoPublished', handlePublished);
    return () => window.removeEventListener('videoPublished', handlePublished);
  }, []);

  const handleVideoError = (id) => {
    setBrokenVideoIds(prev => new Set(prev).add(id));
  };

  const handleDeleteVideo = (id) => {
    if (window.confirm('确定要删除这个视频吗？')) {
      setUserVideos(prev => prev.filter(v => v.id !== id));
      
      // Also remove from localStorage if it's a published video
      const published = JSON.parse(localStorage.getItem('publishedVideos') || '[]');
      const updatedPublished = published.filter(v => v.id !== id);
      localStorage.setItem('publishedVideos', JSON.stringify(updatedPublished));
      
      setShowVideoModal(null);
    }
  };

  const handleTogglePrivate = (id) => {
    setPrivateVideoIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setShowVideoModal(null);
  };

  const handleSaveProfile = () => {
    setUserInfo({ ...editForm });
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditForm(prev => ({ ...prev, avatar: url }));
    }
  };

  const getFilteredVideos = () => {
    const visible = userVideos.filter(v => !brokenVideoIds.has(v.id));
    switch (activeTab) {
      case 'grid':
        return visible.filter(v => !privateVideoIds.has(v.id));
      case 'private':
        return visible.filter(v => privateVideoIds.has(v.id));
      case 'favorite':
        return mockVideos.filter(v => favoriteVideoIds.has(v.id) && !brokenVideoIds.has(v.id));
      case 'liked':
        return mockVideos.filter(v => likedVideoIds.has(v.id) && !brokenVideoIds.has(v.id));
      default:
        return visible;
    }
  };

  const currentVideos = getFilteredVideos();

  return (
    <div className="h-full bg-black flex flex-col overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <div className="p-4 flex justify-between items-center sticky top-0 bg-black z-30 border-b border-white/5">
        <div className="w-10" />
        <span className="font-bold text-sm">{userInfo.nickname}</span>
        <div className="flex space-x-4">
          <Menu className="w-6 h-6" />
        </div>
      </div>

      {/* User Profile Info */}
      <div className="relative z-10">
        <div className="h-48 w-full relative">
          <img 
            src="https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=1000&q=80" 
            className="w-full h-full object-cover brightness-75" 
            alt="Banner" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="px-4 -mt-16 pb-4 bg-black relative rounded-t-[24px]">
          <div className="flex items-end justify-between mb-4 -translate-y-2">
            <div className="relative">
              <div className="w-[100px] h-[100px] rounded-full border-[4px] border-black bg-zinc-900 shadow-2xl overflow-hidden">
                <img 
                  src={userInfo.avatar} 
                  className="w-full h-full object-cover" 
                  alt="" 
                />
              </div>
              <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-1.5 border-[3px] border-black shadow-lg">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="flex space-x-2 mb-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-zinc-800/80 backdrop-blur-md px-8 py-2.5 rounded-md font-bold text-sm hover:bg-zinc-700 transition-all active:scale-95"
              >
                编辑资料
              </button>
              <button className="bg-zinc-800/80 backdrop-blur-md px-3.5 py-2.5 rounded-md font-bold text-sm hover:bg-zinc-700 transition-all active:scale-95">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="font-bold text-xl">{userInfo.nickname}</h2>
            <p className="text-xs text-white/60 font-mono">抖音号：{userInfo.douyinId}</p>
          </div>

          <p className="text-sm mt-4 leading-relaxed text-white/90">{userInfo.bio}</p>

          <div className="flex space-x-6 mt-4">
            <div className="flex items-baseline space-x-1">
              <span className="font-bold text-lg">128</span>
              <span className="text-xs text-white/40">关注</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-bold text-lg">2.5w</span>
              <span className="text-xs text-white/40">粉丝</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-bold text-lg">15.6w</span>
              <span className="text-xs text-white/40">获赞</span>
            </div>
          </div>
        </div>
      </div>

      {/* Works Tabs */}
      <div className="mt-2 bg-black sticky top-12 z-30">
        <div className="flex border-t border-white/5">
          {[
            { id: 'grid', icon: Grid, label: '作品' },
            { id: 'private', icon: Lock, label: '私密' },
            { id: 'favorite', icon: Bookmark, label: '收藏' },
            { id: 'liked', icon: Heart, label: '喜欢' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center py-3 relative transition-colors",
                activeTab === tab.id ? "text-white" : "text-white/40"
              )}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-[10px] mt-1">{tab.label}</span>
              {activeTab === tab.id && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-400 animate-in fade-in duration-300" />}
            </button>
          ))}
        </div>
      </div>

      {/* Works Grid */}
      <div className="flex-1 bg-black min-h-screen">
        <div className="grid grid-cols-3 gap-0.5">
          {currentVideos.map((video, index) => (
            <div 
              key={`${video.id}-${index}`} 
              onClick={() => setShowVideoModal(video)}
              className="aspect-[3/4] bg-zinc-900 relative group cursor-pointer overflow-hidden active:scale-95 transition-transform"
            >
              <video 
                src={video.videoUrl} 
                className="w-full h-full object-cover" 
                muted 
                playsInline
                preload="metadata"
                onError={() => handleVideoError(video.id)}
              />
              <div className="absolute inset-0 bg-black/10 group-active:bg-black/30 transition-colors" />
              <div className="absolute bottom-1.5 left-1.5 flex items-center space-x-1 drop-shadow-md z-10">
                <Play className="w-3 h-3 text-white fill-white" />
                <span className="text-white text-[10px] font-bold">{video.likes}</span>
              </div>
              {activeTab === 'grid' && index < 2 && (
                <div className="absolute top-0 left-0 bg-yellow-400 text-black text-[8px] font-bold px-1.5 py-0.5 rounded-br-sm z-10">
                  置顶
                </div>
              )}
            </div>
          ))}
        </div>
        {currentVideos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-white/20">
            <Play className="w-16 h-16 mb-4 opacity-10" />
            <p>暂无视频</p>
          </div>
        )}
        <div className="h-40" />
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-slide-up">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <button onClick={() => setIsEditing(false)}><X className="w-6 h-6 text-white" /></button>
            <h2 className="text-white font-bold">编辑资料</h2>
            <button onClick={handleSaveProfile} className="text-red-500 font-bold">保存</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current.click()}>
                <img src={editForm.avatar} className="w-24 h-24 rounded-full object-cover brightness-75" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white opacity-80" />
                </div>
                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>
              <p className="text-xs text-white/40 mt-2">点击更换头像</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 py-4">
                <span className="text-white">名字</span>
                <input 
                  value={editForm.nickname}
                  onChange={e => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
                  className="bg-transparent text-right text-white/60 outline-none flex-1 ml-4"
                />
              </div>
              <div className="flex items-center justify-between border-b border-white/5 py-4">
                <span className="text-white">抖音号</span>
                <input 
                  value={editForm.douyinId}
                  onChange={e => setEditForm(prev => ({ ...prev, douyinId: e.target.value }))}
                  className="bg-transparent text-right text-white/60 outline-none flex-1 ml-4"
                />
              </div>
              <div className="space-y-2 py-4">
                <div className="flex justify-between">
                  <span className="text-white">简介</span>
                  <span className="text-[10px] text-white/20">{editForm.bio.length}/100</span>
                </div>
                <textarea 
                  value={editForm.bio}
                  onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value.slice(0, 100) }))}
                  className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm text-white/80 outline-none h-24 resize-none"
                  placeholder="填写你的简介..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Detail Modal (Simulation of clicking a video to play/manage) */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[110] bg-black flex flex-col">
          <div className="relative flex-1">
            <video 
              src={showVideoModal.videoUrl} 
              className="w-full h-full object-contain" 
              autoPlay 
              loop 
              playsInline
            />
            <button 
              onClick={() => setShowVideoModal(null)}
              className="absolute top-6 left-4 p-2 bg-black/20 rounded-full"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {/* Manage Options (only for own videos) */}
            {userVideos.some(v => v.id === showVideoModal.id) && (
              <div className="absolute bottom-10 right-4 flex flex-col gap-6 items-center">
                <button 
                  onClick={() => handleTogglePrivate(showVideoModal.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    {privateVideoIds.has(showVideoModal.id) ? <EyeOff className="w-6 h-6 text-yellow-400" /> : <Lock className="w-6 h-6 text-white" />}
                  </div>
                  <span className="text-[10px] text-white">{privateVideoIds.has(showVideoModal.id) ? '设为公开' : '设为私密'}</span>
                </button>
                <button 
                  onClick={() => handleDeleteVideo(showVideoModal.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Trash2 className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="text-[10px] text-white">删除作品</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
