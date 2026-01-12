import React from 'react';
import { 
  Aperture, 
  Video, 
  Scan, 
  Search,
  Box,
  ChevronRight,
  Circle
} from 'lucide-react';

const Discover = ({ onMoments, onChannels }) => {
  const MenuItem = ({ icon, name, onClick, hasBadge, color, badgeText }) => (
    <div 
      onClick={onClick}
      className="flex justify-between items-center px-4 py-3.5 bg-white active:bg-gray-100 transition-colors border-b border-gray-100 last:border-none"
    >
      <div className="flex gap-3.5 items-center">
        <div className={color}>{icon}</div>
        <span className="text-[17px] text-[#191919]">{name}</span>
      </div>
      <div className="flex gap-2 items-center">
        {hasBadge && (
          <div className="w-2.5 h-2.5 bg-wechat-red rounded-full"></div>
        )}
        {badgeText && (
          <div className="flex items-center gap-2">
            <img src="https://api.dicebear.com/7.x/avataaars/png?seed=Felix" className="w-8 h-8 rounded-sm" crossOrigin="anonymous" />
            <div className="w-2 h-2 bg-wechat-red rounded-full"></div>
          </div>
        )}
        <ChevronRight size={18} className="text-[#c7c7c7]" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-wechat-bg">
      {/* Navbar */}
      <div className="flex justify-center items-center px-4 h-12 bg-wechat-bg sticky top-0 z-10">
        <h1 className="text-[17px] font-medium text-[#191919]">发现</h1>
      </div>

      <div className="flex-1 overflow-y-auto pt-2">
        <div className="mb-2">
          <MenuItem 
            icon={<Aperture size={22} />} 
            name="朋友圈" 
            onClick={onMoments}
            badgeText={true}
            color="text-orange-500"
          />
        </div>

        <div className="mb-2">
          <MenuItem 
            icon={<Video size={22} />} 
            name="视频号" 
            color="text-orange-600"
            onClick={onChannels}
          />
        </div>

        <div className="mb-2">
          <MenuItem icon={<Scan size={22} />} name="扫一扫" color="text-blue-500" />
        </div>

        <div className="mb-2">
          <MenuItem icon={<Search size={22} />} name="搜一搜" color="text-red-500" />
        </div>

        <div className="mb-2">
          <MenuItem icon={<Box size={22} />} name="小程序" color="text-indigo-500" />
        </div>
      </div>
    </div>
  );
};

export default Discover;
