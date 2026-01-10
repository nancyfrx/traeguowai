import React, { useState } from 'react';
import { X, Heart, Send } from 'lucide-react';
import { mockComments } from '../data';
import { cn } from '../utils';

export default function CommentSection({ onClose }) {
  const [comments, setComments] = useState(mockComments);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newComment = {
      id: Date.now(),
      user: { nickname: '我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me' },
      content: inputValue,
      likes: 0,
      time: '刚刚'
    };
    setComments([newComment, ...comments]);
    setInputValue('');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-zinc-900 rounded-t-2xl h-[70vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="w-6" />
          <h3 className="text-white font-bold text-sm">{comments.length} 条评论</h3>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <img src={comment.user.avatar} className="w-8 h-8 rounded-full" alt="" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-white/60 text-xs font-bold">{comment.user.nickname}</span>
                  <div className="flex flex-col items-center">
                    <Heart className="w-4 h-4 text-white/40" />
                    <span className="text-white/40 text-[10px]">{comment.likes}</span>
                  </div>
                </div>
                <p className="text-white text-sm mt-1">{comment.content}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-white/40 text-xs">{comment.time}</span>
                  <button className="text-white/40 text-xs font-bold">回复</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 pb-8 border-t border-white/10 flex items-center space-x-3">
          <input 
            type="text" 
            placeholder="善语结善缘，恶言伤人心" 
            className="flex-1 bg-white/10 rounded-full py-2 px-4 text-white text-sm outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={cn("p-2 rounded-full", inputValue.trim() ? "bg-tiktok-red" : "bg-white/10")}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
