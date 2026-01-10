import React, { useState } from 'react';
import { Camera, Search, Plus, User, Heart, AtSign, MessageCircle, ChevronLeft } from 'lucide-react';
import { mockMessages } from '../data';

export default function MessagePage() {
  const [activeSubTab, setActiveSubTab] = useState(null); // 'fans', 'likes', 'at', 'comments'

  const subTabs = [
    { id: 'fans', label: '粉丝', icon: User, color: 'bg-blue-500', data: [
      { id: 1, user: '小美', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', action: '关注了你', time: '10分钟前' },
      { id: 2, user: '王路飞', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', action: '关注了你', time: '2小时前' },
      { id: 3, user: '索隆', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', action: '关注了你', time: '昨天' }
    ]},
    { id: 'likes', label: '点赞', icon: Heart, color: 'bg-red-500', data: [
      { id: 1, user: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', action: '赞了你的视频', time: '5分钟前', preview: 'https://images.unsplash.com/photo-1574333081543-f597e15303a4?w=50&h=50&fit=crop' },
      { id: 2, user: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', action: '赞了你的评论', time: '1小时前', preview: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=50&h=50&fit=crop' }
    ]},
    { id: 'at', label: '@我', icon: AtSign, color: 'bg-green-500', data: [
      { id: 1, user: '开发组', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6', action: '在评论中提到了你', time: '3小时前', content: '@前端开发者 来看这个新功能！' }
    ]},
    { id: 'comments', label: '评论', icon: MessageCircle, color: 'bg-yellow-500', data: [
      { id: 1, user: '陈同学', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7', action: '评论了你的视频', time: '20分钟前', content: '这个补光灯效果真不错，链接在哪？' },
      { id: 2, user: '老林', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8', action: '回复了你的评论', time: '昨天', content: '同感，我也买了一个。' }
    ]}
  ];

  if (activeSubTab) {
    const tab = subTabs.find(t => t.id === activeSubTab);
    return (
      <div className="flex-1 bg-black flex flex-col animate-slide-in">
        <div className="p-4 flex items-center border-b border-zinc-900">
          <button onClick={() => setActiveSubTab(null)} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-center font-bold">{tab.label}</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {tab.data.map(item => (
            <div key={item.id} className="flex items-start p-4 space-x-3 active:bg-zinc-900">
              <img src={item.avatar} className="w-12 h-12 rounded-full" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm">{item.user}</h3>
                  <span className="text-[10px] text-zinc-500">{item.time}</span>
                </div>
                <p className="text-sm text-zinc-400 mt-0.5">{item.action}</p>
                {item.content && (
                  <p className="text-sm text-white mt-2 p-2 bg-zinc-900 rounded-lg">{item.content}</p>
                )}
              </div>
              {item.preview && (
                <img src={item.preview} className="w-12 h-12 rounded-lg object-cover" alt="" />
              )}
            </div>
          ))}
          {tab.data.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <tab.icon className="w-16 h-16 mb-4 opacity-20" />
              <p>暂无消息</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-black flex flex-col overflow-hidden pb-20">
      <div className="p-4 flex items-center justify-between border-b border-zinc-900">
        <Camera className="w-6 h-6" />
        <h1 className="text-lg font-bold">消息</h1>
        <Plus className="w-6 h-6" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Interaction Icons */}
        <div className="flex justify-around py-6 border-b border-zinc-900">
          {subTabs.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveSubTab(item.id)}
              className="flex flex-col items-center active:scale-95 transition-transform"
            >
              <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white mb-1`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-xs text-zinc-400">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Message List */}
        <div className="divide-y divide-zinc-900">
          <div className="p-4 flex items-center space-x-3 active:bg-zinc-900">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm">新朋友</h3>
                <span className="text-[10px] text-zinc-500">2小时前</span>
              </div>
              <p className="text-sm text-zinc-400 truncate">可能有你认识的人</p>
            </div>
          </div>
          {mockMessages.map(msg => (
            <div key={msg.id} className="flex items-center p-4 space-x-3 active:bg-zinc-900">
              <img src={msg.user.avatar} className="w-12 h-12 rounded-full" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm truncate">{msg.user.nickname}</h3>
                  <span className="text-[10px] text-zinc-500">{msg.time}</span>
                </div>
                <p className="text-sm text-zinc-400 truncate">{msg.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
