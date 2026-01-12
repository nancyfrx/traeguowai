import React from 'react';
import { 
  CreditCard, 
  Image, 
  Archive, 
  CreditCard as CardIcon, 
  Smile, 
  Settings, 
  ChevronRight,
  Camera,
  QrCode
} from 'lucide-react';

const Me = () => {
  const MenuItem = ({ icon, name, color }) => (
    <div className="flex justify-between items-center px-4 py-3 bg-white active:bg-gray-100 transition-colors border-b border-gray-50 last:border-none">
      <div className="flex gap-3 items-center">
        <div className={color}>{icon}</div>
        <span className="text-base">{name}</span>
      </div>
      <ChevronRight size={16} className="text-gray-300" />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f2f2f2]">
      {/* Header */}
      <div className="bg-white px-4 pt-16 pb-10 flex items-start justify-between">
        <div className="flex gap-4 items-center">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/png?seed=Felix" 
            className="w-[64px] h-[64px] rounded-lg bg-gray-100 object-cover" 
            alt="avatar" 
            crossOrigin="anonymous"
          />
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[22px] font-bold leading-tight">Felix</h2>
            <div className="flex items-center gap-1 text-gray-500 text-[14px]">
              <span>微信号: wechat_felix_123</span>
              <QrCode size={14} className="ml-1 opacity-60" />
              <ChevronRight size={16} className="opacity-40" />
            </div>
            {/* Status Button */}
            <div className="mt-1 flex">
              <div className="flex items-center gap-1 px-2 py-0.5 border border-gray-200 rounded-full text-[12px] text-gray-500 active:bg-gray-50">
                <span className="text-[14px] leading-none">+</span>
                <span>状态</span>
              </div>
            </div>
          </div>
        </div>
        <Camera size={22} className="text-black/80 mt-1" />
      </div>

      <div className="flex-1 overflow-y-auto pt-2">
        <div className="mb-2">
          <MenuItem icon={<CreditCard size={22} />} name="服务" color="text-green-600" />
        </div>

        <div className="mb-2">
          <MenuItem icon={<Archive size={22} />} name="收藏" color="text-[#f19c38]" />
          <MenuItem icon={<Image size={22} />} name="相册" color="text-[#4e8cee]" />
          <MenuItem icon={<CardIcon size={22} />} name="卡包" color="text-[#4e8cee]" />
          <MenuItem icon={<Smile size={22} />} name="表情" color="text-[#f19c38]" />
        </div>

        <div className="mb-2">
          <MenuItem icon={<Settings size={22} />} name="设置" color="text-[#4e8cee]" />
        </div>
      </div>
    </div>
  );
};

export default Me;
