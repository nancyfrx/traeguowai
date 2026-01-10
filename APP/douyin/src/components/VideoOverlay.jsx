import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Music2, Plus, MapPin } from 'lucide-react';
import { cn } from '../utils';

export default function VideoOverlay({ video, onCommentClick, onShareClick }) {
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute inset-0 flex flex-col justify-end pointer-events-none p-4 pb-12">
      {/* Right Sidebar */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6 pointer-events-auto">
        {/* Author Avatar */}
        <div className="relative mb-2">
          <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden active:scale-90 transition-transform">
            <img src={video.author.avatar} alt={video.author.nickname} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-tiktok-red rounded-full p-0.5 shadow-lg active:scale-125 transition-transform">
            <Plus className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Like */}
        <button 
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="flex flex-col items-center group"
        >
          <Heart className={cn("w-9 h-9 transition-all duration-300 group-active:scale-125", liked ? "fill-tiktok-red text-tiktok-red" : "text-white fill-white/10")} />
          <span className="text-white text-xs mt-1 font-medium">{liked ? '12.6w' : video.likes}</span>
        </button>

        {/* Comment */}
        <button 
          onClick={(e) => { e.stopPropagation(); onCommentClick(); }}
          className="flex flex-col items-center group"
        >
          <MessageCircle className="w-9 h-9 text-white fill-white/10 group-active:scale-125 transition-transform" />
          <span className="text-white text-xs mt-1 font-medium">{video.comments}</span>
        </button>

        {/* Favorite */}
        <button 
          onClick={(e) => { e.stopPropagation(); setFavorited(!favorited); }}
          className="flex flex-col items-center group"
        >
          <Bookmark className={cn("w-9 h-9 transition-all duration-300 group-active:scale-125", favorited ? "fill-yellow-400 text-yellow-400" : "text-white fill-white/10")} />
          <span className="text-white text-xs mt-1 font-medium">{video.favorites}</span>
        </button>

        {/* Share */}
        <button 
          onClick={(e) => { e.stopPropagation(); onShareClick(); }}
          className="flex flex-col items-center group"
        >
          <Share2 className="w-9 h-9 text-white fill-white/10 group-active:scale-125 transition-transform" />
          <span className="text-white text-xs mt-1 font-medium">{video.shares}</span>
        </button>

        {/* Rotating Music Disc */}
        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center animate-spin-slow border-8 border-zinc-900 shadow-xl overflow-hidden">
          <img src={video.author.avatar} className="w-full h-full opacity-50 blur-[1px]" alt="" />
          <Music2 className="w-4 h-4 text-white absolute" />
        </div>
      </div>

      {/* Bottom Info */}
      <div className="flex flex-col space-y-3 max-w-[80%] pointer-events-auto">
        <div className="flex flex-col space-y-1">
          <h3 className="text-white font-bold text-lg">@{video.author.nickname}</h3>
          <p className={cn(
            "text-white text-sm transition-all duration-300",
            !isExpanded && "line-clamp-2"
          )}>
            {video.description}
          </p>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/60 text-xs font-bold self-start"
          >
            {isExpanded ? '收起' : '展开'}
          </button>
        </div>

        <div className="flex items-center space-x-2 text-white/90 text-sm bg-white/10 w-fit px-2 py-0.5 rounded">
          <MapPin className="w-3 h-3" />
          <span>{video.location} · {video.time}</span>
        </div>

        <div className="flex items-center space-x-2 text-white text-sm overflow-hidden">
          <Music2 className="w-4 h-4 flex-shrink-0" />
          <div className="whitespace-nowrap animate-[scroll_10s_linear_infinite]">
            {video.music}
          </div>
        </div>
      </div>
    </div>
  );
}
