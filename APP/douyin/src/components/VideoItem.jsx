import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2, VolumeX, Loader2, Heart } from 'lucide-react';
import VideoOverlay from './VideoOverlay';
import CommentSection from './CommentSection';
import SharePopup from './SharePopup';
import { cn } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoItem({ video, isActive }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [heartClicks, setHeartClicks] = useState([]);
  const videoRef = useRef(null);
  const lastTap = useRef(0);

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setHasError(false);
    
    const playVideo = async () => {
      if (!videoRef.current || !isActive) return;
      
      try {
        setIsLoading(true);
        videoRef.current.load();
        
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          if (!isCancelled) {
            setIsPlaying(true);
            setIsLoading(false);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          console.warn("Autoplay was prevented or interrupted:", error);
          setIsPlaying(false);
          setIsLoading(false);
        }
      }
    };

    if (isActive) {
      playVideo();
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [isActive, video.videoUrl]);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleDoubleClick = (e) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      // Double click
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newClick = { id: now, x, y };
      setHeartClicks(prev => [...prev, newClick]);
      
      // Remove heart after animation
      setTimeout(() => {
        setHeartClicks(prev => prev.filter(c => c.id !== now));
      }, 1000);
    } else {
      // Single click - toggle play
      togglePlay();
    }
    lastTap.current = now;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const currentVideoUrl = video.videoUrl;

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -100) {
      // Swipe left -> Author page
      alert('进入作者主页');
    } else if (info.offset.x > 100) {
      // Swipe right -> Exit/Back
      alert('退出播放页');
    }
  };

  return (
    <motion.div 
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="relative w-full h-full bg-black snap-start overflow-hidden"
    >
      {/* Video element */}
      <video
        ref={videoRef}
        key={video.videoUrl}
        className="w-full h-full object-contain"
        loop
        playsInline
        preload="auto"
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setHasError(false);
        }}
        onError={(e) => {
          console.error("Video Error Details:", e.target.error);
          setIsLoading(false);
          setHasError(true);
        }}
        onTimeUpdate={handleTimeUpdate}
        onClick={handleDoubleClick}
        muted={isMuted}
      >
        <source src={video.videoUrl} type="video/mp4" />
        您的浏览器不支持 HTML5 视频。
      </video>

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-50">
          <p className="text-white/60 mb-4">视频加载失败</p>
          <button 
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
              videoRef.current.load();
              videoRef.current.play();
            }}
            className="bg-tiktok-red px-6 py-2 rounded-full font-bold text-white"
          >
            重试
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Loader2 className="w-12 h-12 text-white/50 animate-spin" />
        </div>
      )}

      {/* Play/Pause Indicator */}
      {!isPlaying && !isLoading && !hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
          onClick={togglePlay}
        >
          <Play className="w-20 h-20 text-white/50 fill-white/20 transition-transform active:scale-90" />
        </div>
      )}

      {/* Mute/Unmute Indicator */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-20 right-4 p-2 bg-black/20 rounded-full text-white pointer-events-auto"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Floating Hearts for Double Click */}
      <AnimatePresence>
        {heartClicks.map(click => (
          <motion.div
            key={click.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [1.2, 1.5, 2], opacity: 0, y: -100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: 'absolute', left: click.x - 40, top: click.y - 40, pointerEvents: 'none', zIndex: 100 }}
          >
            <Heart className="w-20 h-20 text-tiktok-red fill-tiktok-red shadow-lg" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20 z-40">
        <div 
          className="h-full bg-white transition-all duration-100" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Overlay UI */}
      <VideoOverlay 
        video={video} 
        onCommentClick={() => setShowComment(true)} 
        onShareClick={() => setShowShare(true)}
      />

      {/* Comment Section Popup */}
      {showComment && <CommentSection onClose={() => setShowComment(false)} />}

      {/* Share Popup */}
      {showShare && <SharePopup videoUrl={video.videoUrl} onClose={() => setShowShare(false)} />}
    </motion.div>
  );
}
