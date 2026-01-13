import React, { useState, useEffect } from 'react'
import { ChevronDown, Share2, Heart, Download, MessageSquare, Repeat, SkipBack, SkipForward, Play, Pause, ListMusic, MoreVertical, Bell, Radio } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Player = ({ song, isPlaying, onTogglePlay, onBack, onPrev, onNext, currentTime, duration, onSeek, isLoading, onOpenPlaylist }) => {
  const [showLyrics, setShowLyrics] = useState(false)

  const localCovers = [
    '0569e542d658c81c9f17d63f0836f7f5.jpeg', '0f87796747695b36a0e03dad0eb64a5e.jpg',
    '141cf4294f8242d8bb64f2bea76ed0f3.jpg', '34810b229c6b37af0613cbf7a817fbd5.jpg',
    '3b0660743d436e058b8e4860a367c7d1.jpeg', '4cb202700292fde278e90e3b79499a6a.jpg',
    '5ac5bf54ca1f4e288bf9ecf10d71d8d4.jpeg', '5bc88c69f1dc2fa567fae3762193da2a.jpeg',
    '646bdd9b72e8d76f40d663f5ed00c8a5.jpeg', '8e309f7f4b2d1df174353c5c50271173.jpeg',
    '8f7174c2239a01924a876e764125ab98.jpeg', '9b236fc2382c8fb995b50a24d834a3ca.jpeg',
    'b15d4acf25b0b964a4db99174ac2796d.jpg', 'bb8a1e83ca2ea004c48ff8877ef91acd.jpg',
    'cb078ec82dffe8f0944fe27a368fde3f.jpg', 'e374d36b7e9e0817897173358c942bd5.jpg',
    'e93d312c1b81bb27ea807d060c58e17b.jpg', 'fe0ec2411e6531ffcd89c10abd74b3ae.jpg'
  ]

  const getRandomCover = () => {
    const randomName = localCovers[Math.floor(Math.random() * localCovers.length)]
    return `covers/${randomName}`
  }

  const formatTime = (seconds) => {
    if (!seconds) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const parseLyrics = (lrc) => {
    if (!lrc) return []
    const lines = lrc.split('\n')
    return lines.map(line => {
      const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/)
      if (match) {
        return {
          time: parseInt(match[1]) * 60 + parseFloat(match[2]),
          text: match[3].trim()
        }
      }
      return null
    }).filter(line => line && line.text)
  }

  const lyricsList = parseLyrics(song.lyrics)
  const currentLyricIdx = lyricsList.findLastIndex(l => l.time <= currentTime)

  return (
    <div className="h-full flex flex-col bg-[#1c1c1e] text-white relative overflow-hidden">
      {/* Background Blur */}
      <div className="absolute inset-0 z-0">
        <img 
          src={song.cover} 
          className="w-full h-full object-cover blur-[80px] opacity-80 scale-150" 
          alt="" 
          onError={(e) => {
            e.target.src = getRandomCover()
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 pt-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2"><ChevronDown size={28} /></button>
        <div className="flex gap-4 items-center">
          <div className="w-1 h-1 bg-white/40 rounded-full" />
          <div className="w-1 h-1 bg-white rounded-full" />
          <div className="w-1 h-1 bg-white/40 rounded-full" />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-[8px] px-1 rounded-full">NEW</span>
          </button>
          <button><Share2 size={24} /></button>
        </div>
      </header>

      {/* Main Content: Record or Lyrics */}
      <main 
        className="flex-1 relative z-10 flex flex-col items-center justify-start pt-4 cursor-pointer"
        onClick={() => setShowLyrics(!showLyrics)}
      >
        <AnimatePresence mode="wait">
          {!showLyrics ? (
            <motion.div 
              key="record"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-[360px] h-[360px] bg-[#0c0c0c]/90 rounded-[50px] flex items-center justify-center shadow-[0_50px_100px_rgba(0,0,0,0.9),inset_0_2px_15px_rgba(255,255,255,0.08)] border border-white/5"
            >
              {/* Subtle top-down lighting on the container */}
              <div className="absolute inset-0 rounded-[50px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

              {/* Disc Container */}
              <div className="relative w-[310px] h-[310px] flex items-center justify-center">
                {/* Ambient glow behind the disc */}
                <div className="absolute w-[95%] h-[95%] rounded-full bg-black/60 blur-3xl opacity-60" />
                
                {/* Vinyl Record with ultra-high-fidelity LUSTROUS SILVER-GRAY metallic texture */}
                <div 
                  className={`w-full h-full rounded-full shadow-[inset_0_0_80px_rgba(0,0,0,0.35),0_40px_80px_rgba(0,0,0,0.6)] animate-spin-slow relative group`}
                  style={{ 
                    animationPlayState: isPlaying ? 'running' : 'paused',
                    background: `
                      radial-gradient(circle at center, 
                        #ffffff 0%, 
                        #f9fafb 8%, 
                        #f3f4f6 15%, 
                        #e5e7eb 30%, 
                        #d1d5db 50%, 
                        #9ca3af 70%, 
                        #4b5563 85%, 
                        #111827 100%
                      )
                    `,
                  }}
                >
                  {/* High-Fidelity Concentric Grooves (Refined Silver) - Lighter */}
                  <div className="absolute inset-0 rounded-full opacity-30" style={{
                    background: `
                      repeating-radial-gradient(circle at center, 
                        transparent 0px, 
                        transparent 8px, 
                        rgba(255,255,255,0.08) 9px, 
                        transparent 10px
                      )
                    `
                  }} />

                  {/* Added more specific concentric rings with 3D stereoscopic effect - Lighter and more frequent */}
                  <div className="absolute inset-0 rounded-full opacity-40 pointer-events-none" style={{
                    background: `
                      radial-gradient(circle at center,
                        transparent 32%,
                        rgba(0,0,0,0.3) 32.1%,
                        rgba(255,255,255,0.15) 32.2%,
                        transparent 32.3%,

                        transparent 37%,
                        rgba(0,0,0,0.25) 37.1%,
                        rgba(255,255,255,0.12) 37.2%,
                        transparent 37.3%,
                        
                        transparent 42%,
                        rgba(0,0,0,0.3) 42.1%,
                        rgba(255,255,255,0.15) 42.2%,
                        transparent 42.3%,

                        transparent 47%,
                        rgba(0,0,0,0.25) 47.1%,
                        rgba(255,255,255,0.12) 47.2%,
                        transparent 47.3%,

                        transparent 52%,
                        rgba(0,0,0,0.3) 52.1%,
                        rgba(255,255,255,0.15) 52.2%,
                        transparent 52.3%,

                        transparent 57%,
                        rgba(0,0,0,0.25) 57.1%,
                        rgba(255,255,255,0.12) 57.2%,
                        transparent 57.3%,

                        transparent 62%,
                        rgba(0,0,0,0.3) 62.1%,
                        rgba(255,255,255,0.15) 62.2%,
                        transparent 62.3%,

                        transparent 67%,
                        rgba(0,0,0,0.25) 67.1%,
                        rgba(255,255,255,0.12) 67.2%,
                        transparent 67.3%,

                        transparent 72%,
                        rgba(0,0,0,0.3) 72.1%,
                        rgba(255,255,255,0.15) 72.2%,
                        transparent 72.3%,

                        transparent 77%,
                        rgba(0,0,0,0.25) 77.1%,
                        rgba(255,255,255,0.12) 77.2%,
                        transparent 77.3%,

                        transparent 82%,
                        rgba(0,0,0,0.3) 82.1%,
                        rgba(255,255,255,0.15) 82.2%,
                        transparent 82.3%,

                        transparent 87%,
                        rgba(0,0,0,0.25) 87.1%,
                        rgba(255,255,255,0.12) 87.2%,
                        transparent 87.3%,

                        transparent 92%,
                        rgba(0,0,0,0.3) 92.1%,
                        rgba(255,255,255,0.15) 92.2%,
                        transparent 92.3%
                      )
                    `
                  }} />

                  {/* Secondary Micro-texture for metallic shimmer (Cool Gray) */}
                  <div className="absolute inset-0 rounded-full opacity-20" style={{
                    background: 'repeating-radial-gradient(circle at center, rgba(209,213,219,0.1), transparent 25px)'
                  }} />
                  
                  {/* Anisotropic reflections (Enhanced Luster with soft highlights) */}
                  <div className="absolute inset-0 rounded-full opacity-60 mix-blend-screen" style={{
                    background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.3) 45deg, transparent 90deg, rgba(255,255,255,0.3) 135deg, transparent 180deg, rgba(255,255,255,0.3) 225deg, transparent 270deg, rgba(255,255,255,0.3) 315deg, transparent 360deg)'
                  }} />

                  {/* Enhanced Luster: Top-down environmental highlight */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-black/10 opacity-50" />

                  {/* Center Album Art with Depth */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[155px] h-[155px] rounded-full overflow-hidden border-[1px] border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)] z-10">
                      <img 
                        src={song.cover} 
                        className="w-full h-full object-cover" 
                        alt="" 
                        onError={(e) => {
                          e.target.src = getRandomCover()
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Modern High-End Tonearm System */}
                <div 
                  className="absolute -top-16 -right-8 w-64 h-72 pointer-events-none z-30"
                  style={{
                    transform: isPlaying ? 'rotate(14deg)' : 'rotate(-15deg)',
                    transition: 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    transformOrigin: '85% 12%'
                  }}
                >
                  {/* Modern Pivot Base (Brushed Metal look) */}
                  <div className="absolute top-[8%] right-[8%] w-14 h-14 bg-gradient-to-br from-[#2a2a2a] to-[#0a0a0a] rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.6),inset_0_2px_5px_rgba(255,255,255,0.1)] border border-white/5 flex items-center justify-center z-40">
                    <div className="w-10 h-10 bg-[#111] rounded-full flex items-center justify-center shadow-inner border border-white/5">
                      <div className="w-6 h-6 bg-gradient-to-tr from-[#111] via-[#333] to-[#111] rounded-full border border-white/10" />
                    </div>
                  </div>

                  {/* Straight Carbon-Fiber Style Tonearm */}
                  <div className="absolute top-[18%] right-[16%] w-full h-full">
                    {/* Minimalist Geometric Headshell (Positioned at the END of the rod) */}
                    <div className="absolute top-[82px] right-[34px] w-4 h-7 transform rotate-[25deg] z-20">
                      {/* Sleek Rectangular Body */}
                      <div className="w-full h-full bg-gradient-to-b from-[#222] to-[#000] rounded-sm shadow-2xl border border-white/10 flex flex-col items-center pt-1">
                         <div className="w-[1px] h-2 bg-white/20" />
                      </div>
                    </div>

                    {/* The Main Rod (Shortened) */}
                    <div className="absolute top-[35px] right-[12px] w-[5px] h-14 bg-gradient-to-r from-[#1a1a1a] via-[#333] to-[#1a1a1a] origin-top transform rotate-[25deg] rounded-full shadow-2xl z-30 border-x border-white/[0.05]">
                      {/* Chrome Joint detail at the top */}
                      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#999] via-[#eee] to-[#999] rounded-t-full" />
                    </div>
                  </div>
                </div>
               </div>

               </motion.div>
          ) : (
            <motion.div 
              key="lyrics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center text-center px-8 overflow-y-auto no-scrollbar py-20"
            >
              <div className="space-y-6 text-gray-400">
                {lyricsList.length > 0 ? lyricsList.map((line, idx) => (
                  <p 
                    key={idx} 
                    className={`text-lg transition-all duration-300 ${idx === currentLyricIdx ? 'text-secondary scale-110 font-medium' : ''}`}
                  >
                    {line.text}
                  </p>
                )) : (
                  <p className="text-lg">暂无歌词</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Song Info Section */}
      <section className="relative z-10 px-8 pt-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate tracking-wide">{song.title}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[15px] text-gray-300 font-medium">{song.artist}</span>
              <div className="flex gap-1 items-center">
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] text-gray-400 font-bold border border-white/5">1k人在听</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] text-gray-400 font-bold border border-white/5">418</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] text-gray-400 font-bold border border-white/5">SQ</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] text-[#e5b15b] font-bold border border-[#e5b15b]/20">VIP</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] text-gray-400 font-bold border border-white/5">原声</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] text-gray-400 font-bold border border-white/5">视频</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-2 font-medium">词：林夕 / 曲：泽日生 / 编曲：唐奕聪</p>
          </div>
          <div className="flex flex-col items-center gap-1">
             <Heart size={28} className="text-white/80" />
             <span className="text-[9px] text-gray-500 font-bold">160w+</span>
          </div>
        </div>
      </section>

      {/* Middle Functional Buttons */}
      <section className="relative z-10 px-8 py-6 flex justify-between items-center opacity-80">
        <button className="flex flex-col items-center"><Bell size={24} className="text-gray-300" /></button>
        <button className="flex flex-col items-center text-gray-300 relative">
          <Radio size={24} />
          <span className="absolute -top-1 -right-3 text-[8px] font-bold">Off</span>
        </button>
        <button className="flex flex-col items-center"><Download size={24} className="text-gray-300" /></button>
        <button className="flex flex-col items-center relative">
          <MessageSquare size={24} className="text-gray-300" />
          <span className="absolute -top-1 -right-4 text-[8px] font-bold text-gray-400">999+</span>
        </button>
        <button className="flex flex-col items-center relative">
          <MoreVertical size={24} className="text-gray-300" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1c1c1e]" />
          <span className="absolute -top-4 -right-2 bg-red-500 text-[7px] px-1 py-0.5 rounded-full font-bold">听伴奏</span>
        </button>
      </section>

      {/* Footer Controls */}
      <footer className="relative z-10 px-8 pb-10 space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div 
            className="h-[3px] bg-white/10 rounded-full relative cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const percentage = x / rect.width
              onSeek(percentage * duration)
            }}
          >
            <div className="absolute h-full bg-white rounded-full" style={{ width: `${(currentTime / duration) * 100 || 0}%` }} />
            <div 
              className="absolute w-2 h-2 bg-white rounded-full -top-[2.5px] shadow-lg" 
              style={{ left: `calc(${(currentTime / duration) * 100 || 0}% - 4px)` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 font-bold">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between">
          <button className="text-gray-400"><Repeat size={24} /></button>
          <div className="flex items-center gap-10">
            <button onClick={onPrev}><SkipBack size={32} fill="white" className="text-white" /></button>
            <button 
              onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
              className="w-[72px] h-[72px] border-[2.5px] border-white/20 rounded-full flex items-center justify-center relative overflow-hidden"
            >
              {isLoading ? (
                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isPlaying ? <Pause size={36} fill="white" className="text-white" /> : <Play size={36} className="ml-1 text-white" fill="white" />
              )}
            </button>
            <button onClick={onNext}><SkipForward size={32} fill="white" className="text-white" /></button>
          </div>
          <button onClick={onOpenPlaylist} className="text-gray-400"><ListMusic size={26} /></button>
        </div>
      </footer>
    </div>
  )
}

export default Player

