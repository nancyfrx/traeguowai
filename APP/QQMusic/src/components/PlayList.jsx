import React from 'react'
import { X, Play, Link, Download, PlusSquare, Trash2, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PlayList = ({ isOpen, onClose, currentSong, playList, onSelectSong }) => {
  const tabs = [
    { name: '正在播放', count: playList.length, icon: <Link size={12} className="rotate-45" /> },
    { name: '已播歌曲', count: '999+' },
    { name: '已播歌单', count: 4 },
  ]

  const songs = playList.length > 0 ? playList : [
    { id: 1, title: '最佳损友', artist: '陈奕迅', isVip: true },
    { id: 2, title: 'K歌之王 (国语)', artist: '陈奕迅', isVip: true },
    { id: 3, title: 'Perfect', artist: 'Ed Sheeran', isVip: true },
    { id: 4, title: '12号', artist: '周柏豪', isVip: true },
    { id: 5, title: '生疏', artist: '常颖杰', isVip: true },
    { id: 6, title: '唯一', artist: 'G.E.M. 邓紫棋', isVip: true },
    { id: 7, title: '1000x', artist: 'Jarryd James/BROODS', isVip: true },
    { id: 8, title: 'Hold Us Together', artist: 'Wild', isVip: true },
    { id: 9, title: '我的宣言', artist: '周柏豪', isVip: true },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-[375px] mx-auto bg-white rounded-t-[24px] z-[60] flex flex-col max-h-[85vh] shadow-2xl overflow-hidden"
          >
            {/* Tabs Header */}
            <div className="flex items-center gap-6 px-6 pt-6 pb-2 border-b border-gray-50">
              {tabs.map((tab, i) => (
                <div key={tab.name} className="flex items-baseline gap-1 relative">
                  <span className={`text-sm font-bold ${i === 0 ? 'text-gray-900 border-b-2 border-secondary pb-1' : 'text-gray-400'}`}>
                    {tab.name}
                  </span>
                  {tab.icon && <span className="text-gray-400">{tab.icon}</span>}
                  <span className="text-[10px] text-gray-400">{tab.count}</span>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <Play size={14} className="rotate-180" />
                </motion.div>
                <span>顺序播放</span>
              </div>
              <div className="flex items-center gap-5 text-gray-400">
                <Download size={18} />
                <PlusSquare size={18} />
                <Trash2 size={18} />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 pb-8 no-scrollbar">
              {songs.map((song) => (
                <div 
                  key={song.id}
                  onClick={() => onSelectSong(song)}
                  className="flex items-center gap-3 py-4 group cursor-pointer"
                >
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className={`text-sm font-medium truncate ${currentSong.id === song.id ? 'text-secondary font-bold' : 'text-gray-800'}`}>
                      {song.title}
                    </span>
                    <span className="text-[10px] text-gray-400 truncate"> - {song.artist}</span>
                    {song.isVip && (
                      <span className="text-[8px] text-secondary border border-secondary/30 px-0.5 rounded font-bold scale-90">VIP</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-gray-300">
                    <X size={16} className="hover:text-gray-500" onClick={(e) => e.stopPropagation()} />
                    <Menu size={16} className="hover:text-gray-500" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PlayList
