import React from 'react'
import { Search, User, Menu, Music, Mic2, Radio, Heart, Disc, Play, ChevronRight, MoreHorizontal, LayoutGrid, RadioTower, Users, MessageSquare } from 'lucide-react'

const Home = ({ onNavigate, onPlaySong }) => {
  const tabs = ['推荐', '乐馆', '听书', '扑淘', 'bubble', '金币']
  
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

  const hotSongs = [
    { id: 'local_01', title: '晴天', artist: '周杰伦', cover: 'covers/3b0660743d436e058b8e4860a367c7d1.jpeg', tag: '本周热播', likes: '100w+', platform: 'local', localUrl: 'songs/000140.mp3' },
    { id: 'local_02', title: '红玫瑰', artist: '陈奕迅', cover: 'covers/4cb202700292fde278e90e3b79499a6a.jpg', tag: '经典粤语', likes: '50w+', platform: 'local', localUrl: 'songs/000709.mp3' },
    { id: 'local_03', title: '富士山下', artist: '陈奕迅', cover: 'covers/5ac5bf54ca1f4e288bf9ecf10d71d8d4.jpeg', tag: '深夜必听', likes: '80w+', platform: 'local', localUrl: 'songs/006367.mp3' },
    { id: 'local_04', title: '七里香', artist: '周杰伦', cover: 'covers/5bc88c69f1dc2fa567fae3762193da2a.jpeg', tag: '夏日回忆', likes: '120w+', platform: 'local', localUrl: 'songs/006406.mp3' },
    { id: 'local_mp4_01', title: '岁月如歌', artist: '陈奕迅', cover: 'covers/0569e542d658c81c9f17d63f0836f7f5.jpeg', tag: '经典金曲', likes: '90w+', platform: 'local', localUrl: 'songs/岁月如歌.mp4' },
    { id: 'local_mp4_02', title: '葡萄成熟时', artist: '陈奕迅', cover: 'covers/0f87796747695b36a0e03dad0eb64a5e.jpg', tag: '深夜治愈', likes: '75w+', platform: 'local', localUrl: 'songs/葡萄成熟时.mp4' },
    { id: 'local_mp4_03', title: '黑暗中漫舞', artist: '陈奕迅', cover: 'covers/141cf4294f8242d8bb64f2bea76ed0f3.jpg', tag: '小众神曲', likes: '40w+', platform: 'local', localUrl: 'songs/黑暗中暗舞.mp4' },
    { id: 'local_mp4_04', title: '用背脊唱情歌', artist: '陈奕迅', cover: 'covers/34810b229c6b37af0613cbf7a817fbd5.jpg', tag: '动人旋律', likes: '60w+', platform: 'local', localUrl: 'songs/用背脊唱情歌.mp4' },
    { id: 'local_mp4_05', title: '稻香', artist: '周杰伦', cover: 'covers/3b0660743d436e058b8e4860a367c7d1.jpeg', tag: '童年回忆', likes: '200w+', platform: 'local', localUrl: 'songs/稻香.mp4' },
  ]

  return (
    <div className="flex flex-col bg-[#f8f8f8] min-h-full pb-32">
      {/* Top Tabs */}
      <div className="flex items-center gap-6 px-4 pt-4 overflow-x-auto no-scrollbar whitespace-nowrap bg-[#f8f8f8]">
        {tabs.map((tab, i) => (
          <span key={tab} className={`text-lg ${i === 0 ? 'font-bold relative' : 'text-gray-500'}`}>
            {tab}
            {i === 0 && <div className="absolute -bottom-1 left-0 right-0 h-1 bg-secondary rounded-full" />}
          </span>
        ))}
      </div>

      {/* Search Bar */}
      <div className="px-4 mt-4 flex items-center gap-3">
        <div className="flex-1 h-10 bg-white rounded-full px-4 flex items-center gap-2 shadow-sm">
          <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-sm flex items-center justify-center text-[10px] text-white font-bold italic">M</div>
          <span className="text-gray-400 text-sm flex-1">泽野弘之 新歌</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm">¥</div>
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <Radio size={18} />
          </div>
        </div>
      </div>

      {/* User Info Bar */}
      <div className="px-4 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
            <img 
              src="covers/avatar.jpg" 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=F' }}
            />
          </div>
          <span className="text-sm font-bold">fengruxue</span>
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-[8px] px-1 rounded italic font-bold">VIP 7</div>
          <div className="bg-gray-200 text-gray-500 text-[8px] px-1 rounded flex items-center gap-0.5">
            <Music size={8} /> 首开¥1&gt;
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
          26 条新消息 <ChevronRight size={14} />
        </div>
      </div>

      {/* Banners */}
      <div className="px-4 mt-6 flex gap-3 overflow-x-auto no-scrollbar">
        {/* Banner 1 - 新歌榜 */}
        <div 
          className="flex-shrink-0 w-[300px] h-[150px] rounded-2xl relative overflow-hidden shadow-md flex group cursor-pointer"
          onClick={() => onNavigate('album')}
        >
          {/* Background Image for Banner - Blue Sky with Clouds */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=1000&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="sky"
            />
            {/* Soft overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-transparent" />
          </div>

          <div className="flex-1 p-5 flex flex-col justify-between relative z-10">
            <div>
              <h3 className="text-2xl font-black text-[#1a3a5f] tracking-tight">新歌榜</h3>
              <p className="text-[11px] text-[#2c4c7c] mt-1.5 leading-relaxed font-bold">此刻别无所<br/>求，只想...</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPlaySong(hotSongs[1]);
                }}
                className="w-11 h-11 bg-white/90 text-[#1db954] rounded-full flex items-center justify-center shadow-lg transform active:scale-90 transition-all hover:bg-white hover:scale-105"
              >
                <Play size={22} fill="currentColor" className="ml-1" />
              </button>
              <div className="text-[10px] text-[#1a3a5f] leading-tight font-bold drop-shadow-sm">
                红玫瑰 - 陈奕迅<br/><span className="opacity-70">猜你喜欢</span>
              </div>
            </div>
          </div>
          
          <div 
            className="w-[140px] h-full relative"
          >
            <img 
              src="/covers/8e309f7f4b2d1df174353c5c50271173.jpeg" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              alt="新歌榜"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          </div>
        </div>

        {/* Banner 2 - 每日30首 */}
        <div className="flex-shrink-0 w-[150px] h-[150px] rounded-2xl relative overflow-hidden shadow-sm group cursor-pointer">
          <img 
            src="/covers/8f7174c2239a01924a876e764125ab98.jpeg" 
            className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 p-3 flex flex-col justify-between">
            <div className="text-white">
              <p className="text-[10px] opacity-80">Memories-M</p>
              <p className="text-xs font-bold">每日30首</p>
            </div>
            <p className="text-white text-[11px] font-bold">Daily 30</p>
          </div>
        </div>
      </div>

      {/* Quick Entry */}
      <div className="px-4 mt-6 flex justify-between items-center text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <Radio size={24} />
          </div>
          <span className="text-[11px] text-gray-600">歌手</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <LayoutGrid size={24} />
          </div>
          <span className="text-[11px] text-gray-600">排行</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <Music size={24} />
          </div>
          <span className="text-[11px] text-gray-600">分类歌单</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <RadioTower size={24} />
          </div>
          <span className="text-[11px] text-gray-600">数字专辑</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <Mic2 size={24} />
          </div>
          <span className="text-[11px] text-gray-600">直播</span>
        </div>
      </div>

      {/* Recommended Playlists */}
      <section className="mt-8">
        <div className="px-4 flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">你的专属歌单推荐</h2>
          <ChevronRight size={20} className="text-gray-400" />
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-[110px]" onClick={() => onNavigate('album')}>
              <div className="relative w-[110px] h-[110px] rounded-xl overflow-hidden shadow-sm cursor-pointer">
                <img src={`/covers/${localCovers[i % localCovers.length]}`} className="w-full h-full object-cover" />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                  <Play size={12} fill="white" />
                </div>
                <div className="absolute top-1 right-2 text-white text-[10px] font-bold flex items-center gap-0.5">
                  <Play size={8} fill="white" /> 120万
                </div>
              </div>
              <p className="text-[11px] mt-2 line-clamp-2 leading-tight">粤语经典：那些年我们一起追过的港台金曲</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Songs Section */}
      <section className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">新歌新碟</h2>
            <div className="flex gap-4 text-gray-400 text-sm">
              <span className="text-gray-900 font-bold">新歌</span>
              <span>新碟</span>
              <span>数字专辑</span>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 pr-4">
          {hotSongs.map((song, i) => (
            <div key={i} className="flex flex-col gap-4 w-[280px] flex-shrink-0">
              <div className="flex items-center gap-3 w-full" onClick={() => onPlaySong(song)}>
                <img src={song.cover} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate">{song.title}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{song.artist}</p>
                </div>
                <div className="text-[10px] text-gray-300 border border-gray-100 px-1 rounded">SQ</div>
              </div>
              {/* Fallback songs for the column */}
              <div className="flex items-center gap-3 w-full opacity-60">
                <img src={hotSongs[(i+1)%hotSongs.length].cover} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate">{hotSongs[(i+1)%hotSongs.length].title}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{hotSongs[(i+1)%hotSongs.length].artist}</p>
                </div>
                <div className="text-[10px] text-gray-300 border border-gray-100 px-1 rounded">SQ</div>
              </div>
              <div className="flex items-center gap-3 w-full opacity-60">
                <img src={hotSongs[(i+2)%hotSongs.length].cover} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate">{hotSongs[(i+2)%hotSongs.length].title}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{hotSongs[(i+2)%hotSongs.length].artist}</p>
                </div>
                <div className="text-[10px] text-gray-300 border border-gray-100 px-1 rounded">SQ</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Song List Section */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">听「任我行」也会喜欢</h2>
            <span className="text-xl">💗</span>
            <div className="w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center">
              <Play size={12} fill="currentColor" className="ml-0.5" />
            </div>
          </div>
          <button className="text-gray-300">
            <LayoutGrid size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {hotSongs.map((song) => (
            <div 
              key={song.id} 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onPlaySong(song)}
            >
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                <img 
                  src={song.cover} 
                  className="w-full h-full object-cover" 
                  alt="" 
                  onError={(e) => {
                     e.target.src = getRandomCover() // Use random fallback
                   }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold truncate">{song.title}</h4>
                  {song.tag && (
                    <span className="text-[9px] bg-gray-100 text-gray-400 px-1 py-0.5 rounded flex-shrink-0">
                      {song.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{song.artist}</p>
              </div>
              <div className="flex flex-col items-center gap-0.5 text-gray-300">
                <Heart size={18} />
                <span className="text-[8px]">{song.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[375px] mx-auto bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around py-2 z-50">
        <div className="flex flex-col items-center gap-1 text-secondary">
          <LayoutGrid size={24} />
          <span className="text-[10px] font-bold">首页</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <Play size={24} />
          <span className="text-[10px]">直播</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <RadioTower size={24} />
          <span className="text-[10px]">雷达</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <MessageSquare size={24} />
          <span className="text-[10px]">社区</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <User size={24} />
          <span className="text-[10px]">我的</span>
        </div>
      </div>
    </div>
  )
}

export default Home
