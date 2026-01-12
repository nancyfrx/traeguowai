import React, { useState, useRef, useEffect } from 'react';
import { Search, Camera, Bell, User, Home, PlusSquare, ShoppingBag, MessageSquare } from 'lucide-react';
import VideoItem from './components/VideoItem';
import { mockVideos } from './data';
import { cn } from './utils';
import ShopPage from './components/ShopPage';
import MessagePage from './components/MessagePage';
import ProfilePage from './components/ProfilePage';
import PublishPage from './components/PublishPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [homeTab, setHomeTab] = useState('recommend'); // 'recommend' or 'following'
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const containerRef = useRef(null);

  // Filter videos based on home tab
  const getVideos = () => {
    if (homeTab === 'following') {
      // Return a subset of videos or specifically marked following videos
      return mockVideos.filter((_, index) => index % 2 === 0);
    }
    return mockVideos;
  };

  const currentVideos = getVideos();

  useEffect(() => {
    // Reset index when switching tabs
    setActiveIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [homeTab]);

  const handleScroll = (e) => {
    const height = e.target.clientHeight;
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / height);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsPublishing(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'shop':
        return <ShopPage />;
      case 'message':
        return <MessagePage />;
      case 'profile':
        return <ProfilePage />;
      case 'home':
      default:
        return (
          <div 
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar h-full bg-black"
            style={{ scrollBehavior: 'smooth' }}
          >
            {currentVideos.map((video, index) => (
              <div key={`${homeTab}-${video.id}`} className="w-full h-full snap-start shrink-0">
                <VideoItem 
                  video={video} 
                  isActive={index === activeIndex && activeTab === 'home'} 
                />
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col overflow-hidden max-w-md mx-auto">
      {/* Top Header - Only show on Home */}
      {activeTab === 'home' && (
        <div className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/40 to-transparent">
          <button onClick={() => setIsPublishing(true)} className="active:scale-90 transition-transform">
            <Camera className="w-6 h-6 text-white" />
          </button>
          <div className="flex space-x-6">
            <button 
              onClick={() => setHomeTab('following')}
              className={cn(
                "font-bold text-lg transition-all",
                homeTab === 'following' ? "text-white border-b-2 border-white pb-1" : "text-white/60"
              )}
            >
              关注
            </button>
            <button 
              onClick={() => setHomeTab('recommend')}
              className={cn(
                "font-bold text-lg transition-all",
                homeTab === 'recommend' ? "text-white border-b-2 border-white pb-1" : "text-white/60"
              )}
            >
              推荐
            </button>
          </div>
          <Search className="w-6 h-6 text-white" />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="w-full z-50 bg-black border-t border-white/10 px-6 py-2 pb-6 flex items-center justify-between">
        <button 
          onClick={() => handleTabChange('home')}
          className={cn("flex flex-col items-center", activeTab === 'home' ? "text-white" : "text-white/40")}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] mt-1">首页</span>
        </button>
        <button 
          onClick={() => handleTabChange('shop')}
          className={cn("flex flex-col items-center", activeTab === 'shop' ? "text-white" : "text-white/40")}
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] mt-1">商城</span>
        </button>
        <div 
          onClick={() => setIsPublishing(true)}
          className="relative cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-12 h-8 bg-tiktok-blue rounded-lg absolute left-1"></div>
          <div className="w-12 h-8 bg-tiktok-red rounded-lg absolute -left-1"></div>
          <div className="w-12 h-8 bg-white rounded-lg relative flex items-center justify-center">
            <PlusSquare className="w-6 h-6 text-black" />
          </div>
        </div>
        <button 
          onClick={() => handleTabChange('message')}
          className={cn("flex flex-col items-center", activeTab === 'message' ? "text-white" : "text-white/40")}
        >
          <MessageSquare className="w-6 h-6" />
          <span className="text-[10px] mt-1">消息</span>
        </button>
        <button 
          onClick={() => handleTabChange('profile')}
          className={cn("flex flex-col items-center", activeTab === 'profile' ? "text-white" : "text-white/40")}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] mt-1">我</span>
        </button>
      </div>

      {/* Publish Overlay */}
      {isPublishing && <PublishPage onClose={() => setIsPublishing(false)} />}
    </div>
  );
}
