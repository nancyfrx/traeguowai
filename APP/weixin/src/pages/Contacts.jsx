import React from 'react';
import { Search, UserPlus, Users, Tag, MessageSquare, ShoppingBag, Briefcase, ChevronRight } from 'lucide-react';

const functionalItems = [
  { id: 'new', name: '新的朋友', icon: <UserPlus size={22} className="text-white" />, color: 'bg-[#fa9d3b]' },
  { id: 'chat_only', name: '仅聊天', icon: <MessageSquare size={22} className="text-white" />, color: 'bg-[#fa9d3b]' },
  { id: 'group', name: '群聊', icon: <Users size={22} className="text-white" />, color: 'bg-[#07c160]' },
  { id: 'tag', name: '标签', icon: <Tag size={22} className="text-white" />, color: 'bg-[#10aeff]' },
  { id: 'pub', name: '公众号', icon: <MessageSquare size={22} className="text-white" />, color: 'bg-[#10aeff]' },
  { id: 'service', name: '服务号', icon: <ShoppingBag size={22} className="text-white" />, color: 'bg-[#ff6e40]' },
  { id: 'enterprise', name: '企业微信联系人', icon: <Briefcase size={22} className="text-white" />, color: 'bg-[#10aeff]' },
];

const friendGroups = [
  {
    letter: 'A',
    friends: [
      { id: 201, name: '安琦', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=anqi' },
    ]
  },
  {
    letter: 'B',
    friends: [
      { id: 202, name: '白敬亭', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=baijingting' },
    ]
  },
  {
    letter: 'D',
    friends: [
      { id: 203, name: '丁真', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=dingzhen' },
    ]
  },
  {
    letter: 'F',
    friends: [
      { id: 204, name: '范丞丞', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=fanchengcheng' },
    ]
  },
  {
    letter: 'G',
    friends: [
      { id: 205, name: '关晓彤', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=guanxiaotong' },
    ]
  },
  {
    letter: 'L',
    friends: [
      { id: 206, name: '刘亦菲', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=liuyifei' },
      { id: 207, name: '鹿晗', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=luhan' },
    ]
  },
  {
    letter: 'S',
    friends: [
      { id: 208, name: '沈腾', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=shenteng' },
    ]
  },
  {
    letter: 'W',
    friends: [
      { id: 209, name: '王一博', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=wangyibo' },
    ]
  },
  {
    letter: 'X',
    friends: [
      { id: 210, name: '肖战', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=xiaozhan' },
    ]
  }
];

const Contacts = () => {
  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Navbar */}
      <div className="flex justify-center items-center px-4 h-12 bg-wechat-bg sticky top-0 z-10">
        <h1 className="text-[17px] font-medium text-[#191919]">通讯录</h1>
        <div className="absolute right-4">
          <UserPlus size={24} strokeWidth={1.5} />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {/* Functional Items */}
        <div className="bg-white">
          {functionalItems.map(item => (
            <div key={item.id} className="flex gap-4 items-center px-4 py-3 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-none">
              <div className={`w-10 h-10 ${item.color} rounded-md flex items-center justify-center`}>
                {item.icon}
              </div>
              <span className="text-[17px] text-[#191919]">{item.name}</span>
            </div>
          ))}
        </div>

        {/* Enterprise Section */}
        <div className="mt-2">
          <div className="px-4 py-2 text-[14px] text-[#808080] bg-white border-b border-gray-100">
            我的企业
          </div>
          <div className="flex gap-4 items-center px-4 py-3 active:bg-gray-100 transition-colors bg-white">
            <div className="w-10 h-10 bg-[#10aeff] rounded-md flex items-center justify-center">
              <MessageSquare size={22} className="text-white" />
            </div>
            <span className="text-[17px] text-[#191919]">学校通知</span>
          </div>
        </div>

        {/* Friend Groups */}
        {friendGroups.map(group => (
          <div key={group.letter} className="mt-2">
            <div className="px-4 py-1.5 text-[14px] text-[#808080] bg-wechat-bg font-medium">
              {group.letter}
            </div>
            {group.friends.map(friend => (
              <div key={friend.id} className="flex gap-4 items-center px-4 py-3 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-none bg-white">
                <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-md bg-gray-100" crossOrigin="anonymous" />
                <span className="text-[17px] text-[#191919]">{friend.name}</span>
              </div>
            ))}
          </div>
        ))}
        
        {/* Footer info */}
        <div className="py-6 text-center text-[#808080] text-[16px] bg-white">
          10位联系人
        </div>
      </div>

      {/* Alphabet Index */}
      <div className="absolute right-1 top-24 bottom-24 flex flex-col justify-center gap-0.5 text-[10px] font-bold text-[#555555] z-20">
        {'QABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('').map(char => (
          <div key={char} className="w-4 h-[14px] flex items-center justify-center">
            {char}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
