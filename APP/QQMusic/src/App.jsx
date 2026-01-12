import React, { useState, useEffect, useRef } from 'react'
import { Howl } from 'howler'
import Home from './pages/Home'
import Player from './pages/Player'
import Album from './pages/Album'
import PlayList from './components/PlayList'
import MiniPlayer from './components/MiniPlayer'

import { musicService } from './utils/musicService'

function App() {
  const [currentPage, setCurrentPage] = useState('home') // home, player, album
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState({
    id: 'local_05',
    title: '黄金时代',
    artist: '陈奕迅',
    cover: '/covers/0569e542d658c81c9f17d63f0836f7f5.jpeg',
    url: '/songs/013362.mp3',
    localUrl: '/songs/013362.mp3',
    lyrics: '[00:00.00] 暂无歌词',
    isVip: true
  })
  const [playList, setPlayList] = useState([
    { id: 'local_05', title: '黄金时代', artist: '陈奕迅', cover: '/covers/0569e542d658c81c9f17d63f0836f7f5.jpeg', localUrl: '/songs/013362.mp3', isVip: true },
    { id: 'local_01', title: '晴天', artist: '周杰伦', cover: '/covers/3b0660743d436e058b8e4860a367c7d1.jpeg', localUrl: '/songs/000140.mp3', isVip: true },
    { id: 'local_02', title: '红玫瑰', artist: '陈奕迅', cover: '/covers/4cb202700292fde278e90e3b79499a6a.jpg', localUrl: '/songs/000709.mp3', isVip: true },
    { id: 'local_03', title: '富士山下', artist: '陈奕迅', cover: '/covers/5ac5bf54ca1f4e288bf9ecf10d71d8d4.jpeg', localUrl: '/songs/006367.mp3', isVip: true },
    { id: 'local_04', title: '七里香', artist: '周杰伦', cover: '/covers/5bc88c69f1dc2fa567fae3762193da2a.jpeg', localUrl: '/songs/006406.mp3', isVip: true },
    { id: 'local_mp4_01', title: '岁月如歌', artist: '陈奕迅', cover: '/covers/0569e542d658c81c9f17d63f0836f7f5.jpeg', localUrl: '/songs/岁月如歌.mp4', isVip: true },
    { id: 'local_mp4_02', title: '葡萄成熟时', artist: '陈奕迅', cover: '/covers/0f87796747695b36a0e03dad0eb64a5e.jpg', localUrl: '/songs/葡萄成熟时.mp4', isVip: true },
    { id: 'local_mp4_03', title: '黑暗中漫舞', artist: '陈奕迅', cover: '/covers/141cf4294f8242d8bb64f2bea76ed0f3.jpg', localUrl: '/songs/黑暗中暗舞.mp4', isVip: true },
    { id: 'local_mp4_04', title: '用背脊唱情歌', artist: '陈奕迅', cover: '/covers/34810b229c6b37af0613cbf7a817fbd5.jpg', localUrl: '/songs/用背脊唱情歌.mp4', isVip: true },
    { id: 'local_mp4_05', title: '稻香', artist: '周杰伦', cover: '/covers/3b0660743d436e058b8e4860a367c7d1.jpeg', localUrl: '/songs/稻香.mp4', isVip: true },
  ])

  const [isLoading, setIsLoading] = useState(false)

  const ensureHttps = (url) => {
    if (!url) return url
    return url.replace('http://', 'https://')
  }

  const handlePlaySong = async (songInfo, shouldNavigate = true) => {
    try {
      // If clicking current song and it's already playing, just show player
      if (currentSong.id === songInfo.id && isPlaying) {
        if (shouldNavigate) setCurrentPage('player')
        return
      }

      // Reset state for new song
      setCurrentTime(0)
      setIsPlaying(true)

      // Use local URL exclusively
      const fullSongInfo = {
        ...songInfo,
        url: songInfo.localUrl || songInfo.url,
        lyrics: songInfo.lyrics || '[00:00.00] 暂无歌词',
        platform: 'local',
        _retryCount: 0 
      }

      setCurrentSong(fullSongInfo)
      setIsPlayListOpen(false)
      
      // Add to playlist if not already there
      if (!playList.find(s => s.id === songInfo.id)) {
        setPlayList(prev => [fullSongInfo, ...prev])
      }
      
      if (shouldNavigate) setCurrentPage('player')
    } catch (error) {
      console.error('Error in handlePlaySong:', error)
    }
  }
  const [isPlayListOpen, setIsPlayListOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const soundRef = useRef(null)
  const timerRef = useRef(null)

  const handlePrevSong = () => {
    const currentIndex = playList.findIndex(s => s.id === currentSong.id)
    if (currentIndex > 0) {
      handlePlaySong(playList[currentIndex - 1], false)
    } else {
      handlePlaySong(playList[playList.length - 1], false)
    }
  }

  const handleNextSong = () => {
    const currentIndex = playList.findIndex(s => s.id === currentSong.id)
    if (currentIndex < playList.length - 1) {
      handlePlaySong(playList[currentIndex + 1], false)
    } else {
      handlePlaySong(playList[0], false)
    }
  }

  useEffect(() => {
    if (currentSong.url) {
      if (soundRef.current) {
        soundRef.current.unload()
      }
      console.log('Attempting to play:', currentSong.title, 'URL:', currentSong.url)
      
      soundRef.current = new Howl({
        src: [currentSong.url],
        html5: true,
        preload: true,
        format: ['mp3', 'mp4', 'm4a'],
        autoplay: isPlaying,
        volume: 1.0,
        onplay: () => {
          console.log('Howl: onplay successful')
          setIsPlaying(true)
          setDuration(soundRef.current.duration())
          startTimer()
          setIsLoading(false)
        },
        onload: () => {
          console.log('Howl: onload successful')
          setDuration(soundRef.current.duration())
          setIsLoading(false)
        },
        onloaderror: async (id, err) => {
          console.error('Howl: onloaderror', err, 'URL:', currentSong.url)
          
          // If the error is 4 (Decoding error) or the URL seems broken (404 redirected to HTML)
          // Try to fetch a fresh URL once before giving up
          if (!currentSong._retryCount || currentSong._retryCount < 1) {
            console.log('Attempting to re-fetch fresh URL for song:', currentSong.id)
            const freshUrl = await musicService.getSongUrl(currentSong.id)
            if (freshUrl && freshUrl !== currentSong.url) {
              setCurrentSong(prev => ({ 
                ...prev, 
                url: freshUrl,
                _retryCount: (prev._retryCount || 0) + 1 
              }))
              return
            }
          }

          // If retry fails or no fresh URL, skip to next song
          console.log('Audio load failed permanently, skipping to next song...')
          setIsLoading(false)
          handleNextSong()
        },
        onplayerror: (id, err) => {
          console.error('Howl: onplayerror', err)
          setIsLoading(false)
          soundRef.current.once('unlock', () => {
            soundRef.current.play()
          })
        },
        onend: () => {
          handleNextSong()
        }
      })

      if (isPlaying) {
        soundRef.current.play()
      }
    }
  }, [currentSong.url])

  const startTimer = () => {
    stopTimer()
    timerRef.current = setInterval(() => {
      if (soundRef.current) {
        setCurrentTime(soundRef.current.seek())
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const handleSeek = (time) => {
    if (soundRef.current) {
      soundRef.current.seek(time)
      setCurrentTime(time)
    }
  }

  useEffect(() => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.play()
      } else {
        soundRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (soundRef.current && isPlaying) {
        soundRef.current.play()
      }
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
    }
    window.addEventListener('click', handleFirstInteraction)
    window.addEventListener('touchstart', handleFirstInteraction)
    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [isPlaying])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} onPlaySong={handlePlaySong} />
      case 'player':
        return (
          <Player 
            onBack={() => setCurrentPage('home')} 
            song={currentSong} 
            isPlaying={isPlaying} 
            onTogglePlay={() => setIsPlaying(!isPlaying)} 
            onPrev={handlePrevSong}
            onNext={handleNextSong}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            isLoading={isLoading}
            onOpenPlaylist={() => setIsPlayListOpen(true)}
          />
        )
      case 'album':
        return <Album onBack={() => setCurrentPage('home')} onPlaySong={handlePlaySong} />
      default:
        return <Home onNavigate={setCurrentPage} onPlaySong={handlePlaySong} />
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-white">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderPage()}
      </div>

      {/* Mini Player */}
      {currentPage !== 'player' && (
        <MiniPlayer 
          song={currentSong} 
          isPlaying={isPlaying} 
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onClick={() => setCurrentPage('player')}
          onOpenList={() => setIsPlayListOpen(true)}
        />
      )}

      {/* Play List Popup */}
      <PlayList 
        isOpen={isPlayListOpen} 
        onClose={() => setIsPlayListOpen(false)} 
        currentSong={currentSong}
        playList={playList}
        onSelectSong={handlePlaySong}
      />
    </div>
  )
}

export default App
