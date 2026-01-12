import React, { useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  Compass, 
  User, 
  Search, 
  PlusCircle, 
  Camera, 
  ChevronLeft,
  MoreHorizontal,
  Contact
} from 'lucide-react';
import Wechat from './pages/Wechat';
import Contacts from './pages/Contacts';
import Discover from './pages/Discover';
import Me from './pages/Me';
import Moments from './pages/Moments';
import ChatDetail from './pages/ChatDetail';
import PublishMoment from './pages/PublishMoment';
import UserProfile from './pages/UserProfile';
import Channels from './pages/Channels';

const App = () => {
  const [activeTab, setActiveTab] = useState('wechat');
  const [showMoments, setShowMoments] = useState(false);
  const [showChannels, setShowChannels] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [showPublish, setShowPublish] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);
  const [momentsList, setMomentsList] = useState([]);

  const handlePostMoment = (newMoment) => {
    const moment = {
      id: Date.now(),
      name: 'fengruxue',
      avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=shiba',
      text: newMoment.text,
      images: newMoment.images || [],
      video: newMoment.video || null,
      time: '刚刚',
      likes: [],
      comments: []
    };
    setMomentsList(prev => [moment, ...prev]);
    setShowPublish(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // 切换主菜单时，关闭所有二级页面
    setShowMoments(false);
    setShowChannels(false);
    setActiveChat(null);
    setShowPublish(false);
    setActiveProfile(null);
  };

  const renderPage = () => {
    if (activeProfile) return <UserProfile user={activeProfile} onBack={() => setActiveProfile(null)} />;
    if (showPublish) return <PublishMoment onCancel={() => setShowPublish(false)} onPost={handlePostMoment} />;
    if (showChannels) return <Channels onBack={() => setShowChannels(false)} />;
    if (showMoments) return (
      <Moments 
        onBack={() => setShowMoments(false)} 
        onCamera={() => setShowPublish(true)}
        onUserClick={(user) => setActiveProfile(user)}
        newMoments={momentsList}
      />
    );
    if (activeChat) return <ChatDetail chat={activeChat} onBack={() => setActiveChat(null)} />;
    
    switch (activeTab) {
      case 'wechat': return <Wechat onChatOpen={(chat) => setActiveChat(chat)} />;
      case 'contacts': return <Contacts />;
      case 'discover': return <Discover onMoments={() => setShowMoments(true)} onChannels={() => setShowChannels(true)} />;
      case 'me': return <Me />;
      default: return <Wechat onChatOpen={(chat) => setActiveChat(chat)} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[375px] mx-auto bg-wechat-bg overflow-hidden relative">
      {/* Status Bar */}
      <div className={`flex justify-between items-center px-6 py-3 text-[11px] font-bold z-[100] ${(showMoments || activeChat || showPublish || activeProfile || showChannels) ? ((showMoments || showChannels) && !showPublish && !activeProfile ? 'text-white absolute top-0 left-0 right-0' : 'text-black bg-[#ededed]') : 'text-black bg-wechat-bg'}`}>
        <span>14:59</span>
        <div className="flex gap-1.5 items-center">
          <div className="flex gap-0.5 items-end h-2.5">
            <div className="w-0.5 h-1 bg-current rounded-full"></div>
            <div className="w-0.5 h-1.5 bg-current rounded-full"></div>
            <div className="w-0.5 h-2 bg-current rounded-full"></div>
            <div className="w-0.5 h-2.5 bg-current rounded-full"></div>
          </div>
          <span className="font-bold">5G</span>
          <div className="relative w-5 h-2.5 border border-current/30 rounded-[2px] px-[1px] flex items-center">
            <div className="bg-current h-[6px] w-[14px] rounded-[1px]"></div>
            <div className="absolute -right-[3px] w-[2px] h-[4px] bg-current/30 rounded-r-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {renderPage()}
      </div>

      {/* Tab Bar */}
      {(!showMoments && !activeChat && !showPublish && !activeProfile && !showChannels) && (
        <div className="flex items-center justify-around h-[84px] bg-[#f7f7f7] border-t border-[#e5e5e5] pb-6">
          <button 
            onClick={() => handleTabChange('wechat')}
            className={`flex flex-col items-center gap-0.5 flex-1 pt-2 ${activeTab === 'wechat' ? 'text-wechat-green' : 'text-[#1a1a1a]'}`}
          >
            <MessageSquare size={24} fill={activeTab === 'wechat' ? 'currentColor' : 'none'} strokeWidth={activeTab === 'wechat' ? 0 : 1.5} />
            <span className={`text-[10px] ${activeTab === 'wechat' ? 'font-medium' : ''}`}>微信</span>
          </button>
          <button 
            onClick={() => handleTabChange('contacts')}
            className={`flex flex-col items-center gap-0.5 flex-1 pt-2 ${activeTab === 'contacts' ? 'text-wechat-green' : 'text-[#1a1a1a]'}`}
          >
            <Contact size={24} fill={activeTab === 'contacts' ? 'currentColor' : 'none'} strokeWidth={activeTab === 'contacts' ? 0 : 1.5} />
            <span className={`text-[10px] ${activeTab === 'contacts' ? 'font-medium' : ''}`}>通讯录</span>
          </button>
          <button 
            onClick={() => handleTabChange('discover')}
            className={`flex flex-col items-center gap-0.5 flex-1 pt-2 ${activeTab === 'discover' ? 'text-wechat-green' : 'text-[#1a1a1a]'}`}
          >
            <Compass size={24} fill={activeTab === 'discover' ? 'currentColor' : 'none'} strokeWidth={activeTab === 'discover' ? 0 : 1.5} />
            <span className={`text-[10px] ${activeTab === 'discover' ? 'font-medium' : ''}`}>发现</span>
          </button>
          <button 
            onClick={() => handleTabChange('me')}
            className={`flex flex-col items-center gap-0.5 flex-1 pt-2 ${activeTab === 'me' ? 'text-wechat-green' : 'text-[#1a1a1a]'}`}
          >
            <User size={24} fill={activeTab === 'me' ? 'currentColor' : 'none'} strokeWidth={activeTab === 'me' ? 0 : 1.5} />
            <span className={`text-[10px] ${activeTab === 'me' ? 'font-medium' : ''}`}>我</span>
          </button>
        </div>
      )}

      {/* Home Indicator Overlay */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full pointer-events-none"></div>
    </div>
  );
};

export default App;
