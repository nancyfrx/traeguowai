import React from 'react';
import { Search, Plus, Star, BellOff } from 'lucide-react';

const chats = [
  { 
    id: 1, 
    name: '订阅号消息', 
    lastMsg: '[21条] 软件工程 3.0 时代：今年春节，程序员...', 
    time: '14:56', 
    unread: 1, 
    avatar: 'https://img.icons8.com/fluency/96/news.png', 
    isGroup: false,
    avatarBg: 'bg-[#ffbc32]'
  },
  { 
    id: 2, 
    name: '人大 23 级应用心理学硕士', 
    lastMsg: '[4 条] 冯如雪 Gary-深圳: 【通知: 现场确...', 
    time: '14:55', 
    unread: 1, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=group', 
    isGroup: true, 
    mute: true 
  },
  { id: 3, name: '冯如雪', lastMsg: '[链接] 年度反腐大片，明晚开播！', time: '14:51', unread: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=feng', isGroup: false },
  { id: 4, name: 'QQ 邮箱提醒', lastMsg: 'BOCHK: 提防您的银行账户成为傀儡户口 Be...', time: '14:15', unread: 0, avatar: 'https://img.icons8.com/color/96/gmail-new.png', isGroup: false, avatarBg: 'bg-white' },
  { id: 5, name: 'AI 助手 (GLM-4)', lastMsg: '你好！我是你的智能助手，有什么可以帮你的吗？', time: '14:10', unread: 0, avatar: 'https://img.icons8.com/fluency/96/bot.png', isGroup: false, isRobot: true, avatarBg: 'bg-white' },
  { id: 6, name: '腾讯新闻', lastMsg: '美国 32 岁世界顶级翼装飞行员身亡，以约...', time: '14:06', unread: 0, avatar: 'https://img.icons8.com/color/96/news.png', isGroup: false, mute: true, avatarBg: 'bg-white' },
  { id: 7, name: '服务号', lastMsg: '中山大学附属第三医院: 警惕腰腹疼痛信号！...', time: '12:13', unread: 0, avatar: 'https://img.icons8.com/fluency/96/customer-support.png', isGroup: false, avatarBg: 'bg-[#7586db]' },
  { id: 8, name: '微信支付', lastMsg: '记账日报', time: '09:27', unread: 1, avatar: 'https://img.icons8.com/color/96/weixing-pay.png', isGroup: false, mute: true, avatarBg: 'bg-white' },
  { id: 9, name: '文件传输助手', lastMsg: '[图片]', time: '昨天', unread: 0, avatar: 'https://img.icons8.com/fluency/96/folder-invoices.png', isGroup: false, avatarBg: 'bg-[#f0f0f0]' },
  { id: 10, name: '陈小明', lastMsg: '晚上一起吃饭吗？', time: '昨天', unread: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=chen', isGroup: false },
  { id: 11, name: '王美丽', lastMsg: '那个方案我发你邮箱了。', time: '昨天', unread: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=wang', isGroup: false },
  { id: 12, name: '李大壮', lastMsg: '好的，没问题。', time: '星期四', unread: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=li', isGroup: false },
  { id: 13, name: '赵六', lastMsg: '哈哈哈哈，太搞笑了。', time: '星期三', unread: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=zhao', isGroup: false },
  { id: 14, name: '孙悟空', lastMsg: '师傅，咱们到哪了？', time: '星期二', unread: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=sun', isGroup: false },
  { id: 15, name: '猪八戒', lastMsg: '猴哥，等等我！', time: '星期一', unread: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=zhu', isGroup: false },
  { id: 16, name: '沙和尚', lastMsg: '二师兄，师傅被妖怪抓走了！', time: '1/5', unread: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=sha', isGroup: false },
  { id: 17, name: '白龙马', lastMsg: '嘶鸣...', time: '1/4', unread: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=bai', isGroup: false },
];

const Wechat = ({ onChatOpen }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Navbar */}
      <div className="flex justify-between items-center px-4 h-12 bg-wechat-bg sticky top-0 z-10">
        <Star size={22} strokeWidth={1.5} />
        <h1 className="text-lg font-medium">微信</h1>
        <Plus size={24} strokeWidth={1.5} />
      </div>

      {/* Search Bar */}
      <div className="px-3 py-2 bg-wechat-bg">
        <div className="flex justify-center items-center gap-1.5 h-9 bg-white rounded-md text-gray-400">
          <Search size={16} />
          <span className="text-[15px]">搜索</span>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto pb-20">
        {chats.map(chat => (
          <div 
            key={chat.id} 
            onClick={() => onChatOpen && onChatOpen(chat)}
            className="flex gap-3 px-4 py-3 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-none cursor-pointer"
          >
            <div className="relative flex-shrink-0">
              {chat.isGroup ? (
                <div className="w-12 h-12 rounded-md bg-gray-100 grid grid-cols-2 gap-0.5 p-0.5">
                  <img src={`${chat.avatar}&1`} className="w-full h-full rounded-[1px]" crossOrigin="anonymous" />
                  <img src={`${chat.avatar}&2`} className="w-full h-full rounded-[1px]" crossOrigin="anonymous" />
                  <img src={`${chat.avatar}&3`} className="w-full h-full rounded-[1px]" crossOrigin="anonymous" />
                  <img src={`${chat.avatar}&4`} className="w-full h-full rounded-[1px]" crossOrigin="anonymous" />
                </div>
              ) : (
                <div className={`w-12 h-12 rounded-md flex items-center justify-center ${chat.avatarBg || 'bg-gray-100'}`}>
                  <img src={chat.avatar} alt={chat.name} className="w-10 h-10 object-contain" crossOrigin="anonymous" />
                </div>
              )}
              {chat.unread > 0 && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-wechat-red rounded-full border border-white"></div>
              )}
            </div>
            <div className="flex-1 min-w-0 py-0.5">
              <div className="flex justify-between items-center mb-0.5">
                <h3 className="text-[17px] font-normal text-[#191919] truncate leading-tight">{chat.name}</h3>
                <span className="text-[11px] text-[#b2b2b2]">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[14px] text-[#b2b2b2] truncate flex-1 leading-snug">{chat.lastMsg}</p>
                {chat.mute && (
                  <BellOff size={12} className="text-[#cccccc] ml-2" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wechat;
