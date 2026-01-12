import React, { useState } from 'react';
import { Camera, MapPin, AtSign, Users, ChevronRight, Video, X } from 'lucide-react';
import GalleryModal from '../components/GalleryModal';

const PublishMoment = ({ onCancel, onPost }) => {
  const [text, setText] = useState('');
  const [media, setMedia] = useState({ type: null, files: [] });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleGallerySelect = (files) => {
    if (files.length === 0) return;

    // Check if any selected file is a video
    const hasVideo = files.some(file => file.toLowerCase().match(/\.(mp4|mov|webm)$/));

    if (hasVideo) {
      // If video is selected, take only the first video and clear any images
      const videoFile = files.find(file => file.toLowerCase().match(/\.(mp4|mov|webm)$/));
      setMedia({ 
        type: 'video', 
        files: [videoFile] 
      });
    } else {
      // If only images, append to existing images if current type is image
      setMedia({ 
        type: 'image', 
        files: [...(media.type === 'image' ? media.files : []), ...files].slice(0, 9) 
      });
    }
  };

  const handleImageChange = (e) => {
    // Keep this for now but we'll prioritize the mock gallery
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setMedia({ type: 'image', files: [...(media.type === 'image' ? media.files : []), ...newImages] });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setMedia({ type: 'video', files: [videoUrl] });
    }
  };

  const removeMedia = (idx) => {
    const newFiles = [...media.files];
    newFiles.splice(idx, 1);
    setMedia({ 
      type: newFiles.length === 0 ? null : media.type, 
      files: newFiles 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white absolute inset-0 z-[110]">
      {/* Header */}
      <div className="flex justify-between items-center px-4 h-12 border-b border-gray-100">
        <button onClick={onCancel} className="text-[16px] text-[#191919]">取消</button>
        <button 
          onClick={() => onPost({ text, images: media.type === 'image' ? media.files : [], video: media.type === 'video' ? media.files[0] : null })}
          disabled={!text.trim() && media.files.length === 0}
          className={`px-4 py-1.5 rounded-md text-[15px] font-medium ${
            (text.trim() || media.files.length > 0) ? 'bg-wechat-green text-white' : 'bg-[#f7f7f7] text-[#b2b2b2]'
          }`}
        >
          发表
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Text Input */}
        <textarea 
          placeholder="这一刻的想法..."
          className="w-full h-32 text-[17px] outline-none resize-none placeholder-gray-300 mb-6"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Media Grid */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          {media.type === 'image' && media.files.map((img, idx) => (
            <div key={idx} className="aspect-square relative group">
              <img src={img} className="w-full h-full object-cover rounded-sm" alt="" />
              <button 
                onClick={() => removeMedia(idx)}
                className="absolute -top-1.5 -right-1.5 bg-black/50 text-white rounded-full p-0.5 z-10"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {media.type === 'video' && media.files.map((video, idx) => (
            <div key={idx} className="aspect-square relative bg-black rounded-sm overflow-hidden">
              <video src={video} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Video size={24} className="text-white/80 fill-white/20" />
              </div>
              <button 
                onClick={() => removeMedia(idx)}
                className="absolute -top-1.5 -right-1.5 bg-black/50 text-white rounded-full p-0.5 z-10"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {/* Upload Buttons - Separate Image and Video */}
          {media.files.length === 0 ? (
            <>
              <div 
                onClick={() => setIsGalleryOpen(true)}
                className="aspect-square bg-[#f7f7f7] flex flex-col items-center justify-center cursor-pointer rounded-sm active:bg-gray-200 gap-1"
              >
                <Camera size={28} className="text-[#b2b2b2]" />
                <span className="text-[10px] text-[#b2b2b2]">图片</span>
              </div>
              <div 
                onClick={() => setIsGalleryOpen(true)}
                className="aspect-square bg-[#f7f7f7] flex flex-col items-center justify-center cursor-pointer rounded-sm active:bg-gray-200 gap-1"
              >
                <Video size={28} className="text-[#b2b2b2]" />
                <span className="text-[10px] text-[#b2b2b2]">视频</span>
              </div>
            </>
          ) : media.type === 'image' && media.files.length < 9 ? (
            <div 
              onClick={() => setIsGalleryOpen(true)}
              className="aspect-square bg-[#f7f7f7] flex flex-col items-center justify-center cursor-pointer rounded-sm active:bg-gray-200 gap-1"
            >
              <Camera size={28} className="text-[#b2b2b2]" />
              <span className="text-[10px] text-[#b2b2b2]">图片</span>
            </div>
          ) : null}
        </div>

        {/* Gallery Modal */}
        <GalleryModal 
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          onSelect={handleGallerySelect}
          maxSelect={9 - media.files.length}
        />

        {/* Options */}
        <div className="border-t border-gray-100">
          <div className="flex justify-between items-center py-4 border-b border-gray-50 active:bg-gray-50">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-[#191919]" />
              <span className="text-[16px]">所在位置</span>
            </div>
            <ChevronRight size={18} className="text-[#b2b2b2]" />
          </div>
          <div className="flex justify-between items-center py-4 border-b border-gray-50 active:bg-gray-50">
            <div className="flex items-center gap-3">
              <AtSign size={20} className="text-[#191919]" />
              <span className="text-[16px]">提醒谁看</span>
            </div>
            <ChevronRight size={18} className="text-[#b2b2b2]" />
          </div>
          <div className="flex justify-between items-center py-4 border-b border-gray-50 active:bg-gray-50">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-[#191919]" />
              <span className="text-[16px]">谁可以看</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[16px] text-[#b2b2b2]">公开</span>
              <ChevronRight size={18} className="text-[#b2b2b2]" />
            </div>
          </div>
        </div>
        
        <div className="mt-4 px-4 text-[13px] text-wechat-link">
          上次分组: 朋友
        </div>
      </div>
    </div>
  );
};

export default PublishMoment;
