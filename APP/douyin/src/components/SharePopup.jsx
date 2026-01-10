import React, { useState } from 'react';
import { X, Share2, Link2, Download, MessageSquare, Heart, Ban, Flag, Check } from 'lucide-react';

export default function SharePopup({ videoUrl, onClose }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showMessage = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      if (msg === '链接已复制') onClose();
    }, 1500);
  };

  const handleAction = (label) => {
    switch (label) {
      case '复制链接':
        navigator.clipboard.writeText(videoUrl || window.location.href);
        showMessage('链接已复制');
        break;
      case '不感兴趣':
        showMessage('将减少此类内容推荐');
        setTimeout(onClose, 1500);
        break;
      case '举报':
        showMessage('感谢举报，我们将尽快处理');
        setTimeout(onClose, 1500);
        break;
      default:
        showMessage(`分享到 ${label}`);
    }
  };

  const actions = [
    { label: '私信朋友', icon: <MessageSquare className="w-6 h-6" />, color: 'bg-green-500' },
    { label: '朋友圈', icon: <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600" />, color: '' },
    { label: '微信', icon: <div className="w-6 h-6 bg-green-500 rounded-full" />, color: '' },
    { label: '复制链接', icon: <Link2 className="w-6 h-6" />, color: 'bg-zinc-700' },
    { label: '保存视频', icon: <Download className="w-6 h-6" />, color: 'bg-zinc-700' },
  ];

  const moreActions = [
    { label: '不感兴趣', icon: <Ban className="w-6 h-6" /> },
    { label: '举报', icon: <Flag className="w-6 h-6" /> },
  ];

  return (
    <div className="absolute inset-0 z-[100] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-zinc-900 rounded-t-2xl p-4 animate-slide-up pb-10">
        <div className="flex justify-between items-center mb-6">
          <span className="text-white font-bold text-sm">分享到</span>
          <button onClick={onClose}><X className="w-6 h-6 text-white" /></button>
        </div>

        <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-6">
          {actions.map((action, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center flex-shrink-0 space-y-2 cursor-pointer active:scale-95 transition-transform"
              onClick={() => handleAction(action.label)}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color}`}>
                {action.icon}
              </div>
              <span className="text-[10px] text-zinc-400">{action.label}</span>
            </div>
          ))}
        </div>

        <div className="flex space-x-6 border-t border-white/10 pt-6">
          {moreActions.map((action, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center flex-shrink-0 space-y-2 cursor-pointer active:scale-95 transition-transform"
              onClick={() => handleAction(action.label)}
            >
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                {action.icon}
              </div>
              <span className="text-[10px] text-zinc-400">{action.label}</span>
            </div>
          ))}
        </div>
      </div>

      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[300] bg-zinc-800/95 text-white px-6 py-3 rounded-xl flex items-center gap-2 animate-fade-in shadow-2xl border border-white/10">
          <Check className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
