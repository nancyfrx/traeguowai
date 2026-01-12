import React from 'react'
import { Play, Pause, ListMusic, Heart, Menu } from 'lucide-react'

const MiniPlayer = ({ song, isPlaying, onTogglePlay, onClick, onOpenList }) => {
  if (!song) return null

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
    return `/covers/${randomName}`
  }

  return (
    <div className="fixed bottom-[68px] left-4 right-4 z-40">
      <div 
        className="h-14 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-full flex items-center px-2 gap-3 shadow-[0_8px_20px_rgba(0,0,0,0.1)] cursor-pointer"
        onClick={onClick}
      >
        {/* Cover */}
        <div className="relative flex-shrink-0">
          <div 
            className="w-10 h-10 rounded-full overflow-hidden shadow-lg animate-spin-slow" 
            style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
          >
            <img 
              src={song.cover} 
              alt={song.title} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.src = getRandomCover()
              }}
            />
          </div>
          {/* Record center dot */}
          <div className="absolute inset-0 m-auto w-2 h-2 bg-black rounded-full border border-gray-800" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-bold truncate text-gray-800">{song.title}</h4>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 pr-3" onClick={(e) => e.stopPropagation()}>
          <Heart size={20} className="text-gray-400" />
          <button 
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-800 border-2 border-gray-200"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
          <button 
            onClick={onOpenList}
            className="text-gray-800"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MiniPlayer
