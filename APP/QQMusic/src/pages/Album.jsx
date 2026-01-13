import React from 'react'
import { ChevronLeft, MoreVertical, Play, Heart, Download, Share2 } from 'lucide-react'

const Album = ({ onBack, onPlaySong }) => {
  const songs = [
    { id: '003mU9v029J6vG', title: '晴天', artist: '周杰伦', duration: '04:29', platform: 'qq' },
    { id: '001A9fX62S6O5I', title: '红玫瑰', artist: '陈奕迅', duration: '04:02', platform: 'qq' },
    { id: '001pX7780pXU97', title: '富士山下', artist: '陈奕迅', duration: '04:18', platform: 'qq' },
    { id: '0039M0S406vSpx', title: '七里香', artist: '周杰伦', duration: '04:59', platform: 'qq' },
    { id: '001Yxpxg197u96', title: '十年', artist: '陈奕迅', duration: '03:22', platform: 'qq' },
    { id: '002N9m9k3oK6vH', title: '告白气球', artist: '周杰伦', duration: '03:35', platform: 'qq' },
  ]

  const albumInfo = {
    title: '华语经典金曲',
    cover: 'covers/9b236fc2382c8fb995b50a24d834a3ca.jpeg',
    author: 'QQ音乐官方',
    desc: '精选华语乐坛最具代表性的经典金曲，带你重温那些感动瞬间。',
    playCount: '1.2亿',
    collectCount: '850万'
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Background Blur */}
      <div className="absolute top-0 left-0 right-0 h-80 overflow-hidden z-0">
        <img src={albumInfo.cover} className="w-full h-full object-cover blur-3xl opacity-50 scale-150" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-white/40 to-white" />
      </div>

      <header className="relative z-10 flex justify-between items-center px-4 pt-6">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5">
          <ChevronLeft size={28} />
        </button>
        <h2 className="text-lg font-bold">歌单</h2>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5">
          <MoreVertical size={24} />
        </button>
      </header>

      <div className="relative z-10 px-6 pt-6 flex gap-5">
        <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border-2 border-white/50">
          <img src={albumInfo.cover} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex-1 pt-1">
          <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{albumInfo.title}</h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-secondary rounded-full" />
            </div>
            <span className="text-sm font-bold text-gray-600">{albumInfo.author}</span>
          </div>
          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed font-medium">{albumInfo.desc}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="relative z-10 px-6 mt-6 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center gap-1">
            <button className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-600 active:scale-95 transition-transform border border-gray-100">
              <Heart size={20} />
            </button>
            <span className="text-[10px] text-gray-400 font-bold">{albumInfo.collectCount}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-600 active:scale-95 transition-transform border border-gray-100">
              <Download size={20} />
            </button>
            <span className="text-[10px] text-gray-400 font-bold">下载</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-600 active:scale-95 transition-transform border border-gray-100">
              <Share2 size={20} />
            </button>
            <span className="text-[10px] text-gray-400 font-bold">分享</span>
          </div>
        </div>
        
        <button 
          className="w-14 h-14 bg-[#1db954] text-white rounded-full flex items-center justify-center shadow-xl transform hover:scale-105 active:scale-95 transition-all"
          onClick={() => onPlaySong({
            ...songs[0],
            cover: albumInfo.cover
          })}
        >
          <Play size={28} fill="white" className="ml-1" />
        </button>
      </div>

      {/* Song List Header */}
      <div className="relative z-10 flex-1 mt-8 bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgb(0,0,0,0.04)] px-6 pt-6 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center">
              <Play size={14} className="text-secondary ml-0.5" fill="currentColor" />
            </div>
            <span className="font-black text-gray-900">播放全部</span>
            <span className="text-xs text-gray-400 font-bold">({songs.length})</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          <div className="space-y-6">
            {songs.map((song, index) => (
              <div 
                key={song.id} 
                className="flex items-center gap-4 cursor-pointer group active:opacity-70 transition-opacity"
                onClick={() => onPlaySong({
                  ...song,
                  cover: albumInfo.cover
                })}
              >
                <span className={`w-4 text-center text-sm font-bold ${index < 3 ? 'text-secondary' : 'text-gray-300'}`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-secondary transition-colors">{song.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] bg-secondary/10 text-secondary px-1 rounded font-bold">HQ</span>
                    <p className="text-[11px] text-gray-400 truncate font-medium">{song.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-300">
                  <Play size={16} />
                  <MoreVertical size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Album
