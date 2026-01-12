import React, { useState, useEffect } from 'react';
import { X, Play } from 'lucide-react';

// Dynamically import all files from gallery folder
const galleryModules = import.meta.glob('../assets/gallery/*.{png,jpg,jpeg,webp,gif,mp4,mov,webm}', { eager: true });
const galleryFiles = Object.values(galleryModules).map(mod => mod.default);

const GalleryModal = ({ isOpen, onClose, onSelect, maxSelect = 9 }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const toggleSelect = (url) => {
    const isVideo = url.toLowerCase().match(/\.(mp4|mov|webm)$/);
    
    if (selectedFiles.includes(url)) {
      setSelectedFiles(selectedFiles.filter(item => item !== url));
    } else {
      // If selecting a video, we might want to limit to just one video and no images (standard WeChat behavior)
      // or just follow the maxSelect limit. Let's follow the user's "similar to images" request.
      if (selectedFiles.length < maxSelect) {
        setSelectedFiles([...selectedFiles, url]);
      }
    }
  };

  const handleConfirm = () => {
    onSelect(selectedFiles);
    onClose();
    setSelectedFiles([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-4 h-12 text-white border-b border-gray-800">
        <button onClick={onClose}>
          <X size={24} />
        </button>
        <h3 className="text-[17px] font-medium">最近项目</h3>
        <button 
          onClick={handleConfirm}
          disabled={selectedFiles.length === 0}
          className={`px-3 py-1 rounded-md text-[14px] ${
            selectedFiles.length > 0 ? 'bg-wechat-green text-white' : 'bg-gray-700 text-gray-400'
          }`}
        >
          确定({selectedFiles.length})
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-0.5">
        <div className="grid grid-cols-4 gap-0.5">
          {galleryFiles.map((url, idx) => {
            const isSelected = selectedFiles.includes(url);
            const selectIndex = selectedFiles.indexOf(url) + 1;
            const isVideo = url.toLowerCase().match(/\.(mp4|mov|webm)$/);
            
            return (
              <div 
                key={idx} 
                className="aspect-square relative cursor-pointer active:opacity-80 bg-gray-900"
                onClick={() => toggleSelect(url)}
              >
                {isVideo ? (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <video src={url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play size={24} className="text-white/80 fill-white/20" />
                    </div>
                  </div>
                ) : (
                  <img src={url} className="w-full h-full object-cover" alt="" />
                )}
                
                {/* Selection Circle */}
                <div className={`absolute top-1 right-1 w-5 h-5 rounded-full border border-white flex items-center justify-center text-[12px] z-10 ${
                  isSelected ? 'bg-wechat-green border-wechat-green text-white' : 'bg-black/20 text-transparent'
                }`}>
                  {isSelected ? selectIndex : ''}
                </div>
                
                {isSelected && <div className="absolute inset-0 bg-black/20 z-[5]" />}
              </div>
            );
          })}
          
          {/* Fill remaining space with placeholders if less than 20 items */}
          {galleryFiles.length < 20 && [...Array(20 - galleryFiles.length)].map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-gray-900" />
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="h-12 bg-[#191919] flex items-center px-4 justify-between border-t border-gray-800">
        <span className="text-white text-[15px]">预览</span>
        <div className="flex items-center gap-1">
          <span className="text-gray-400 text-[14px]">已选择</span>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
