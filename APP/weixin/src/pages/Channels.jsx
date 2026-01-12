import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  Search, 
  Camera, 
  ThumbsUp, 
  Share2, 
  Heart, 
  MessageSquare, 
  MoreHorizontal,
  Plus,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  X
} from 'lucide-react';
import GalleryModal from '../components/GalleryModal';

const followingVideos = [
  {
    id: 101,
    author: '陈奕迅 Eason Chan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=eason',
    title: '《十年》经典演唱会现场：每个人心中都有一首陈奕迅。🎤 #陈奕迅 #经典现场 #十年',
    likes: '52.1w',
    shares: '12.4w',
    favorites: '34.2w',
    comments: '8.8w',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    isFollowing: true
  },
  {
    id: 102,
    author: '周杰伦 Jay Chou',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=jay',
    title: '《青花瓷》：天青色等烟雨，而我在等你。这国风前奏真的绝了！🏮 #周杰伦 #国风 #经典',
    likes: '128w',
    shares: '45.2w',
    favorites: '89.1w',
    comments: '21.5w',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    isFollowing: true
  },
  {
    id: 103,
    author: 'G.E.M. 邓紫棋',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=gem',
    title: '《光年之外》：缘分让我们相遇乱世以外。铁肺唱将实力爆发！🚀 #邓紫棋 #高音 #音乐',
    likes: '88.4w',
    shares: '23.1w',
    favorites: '56.2w',
    comments: '15.4w',
    videoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    isFollowing: true
  },
  {
    id: 104,
    author: '林俊杰 JJ Lin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=jj',
    title: '《修炼爱情》：谁也无法取代，这行走的CD。💿 #林俊杰 #情感音乐 #Live',
    likes: '64.2w',
    shares: '11.5w',
    favorites: '32.1w',
    comments: '5.6w',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    isFollowing: true
  },
  {
    id: 105,
    author: '张国荣 Leslie',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=hk',
    title: '《风继续吹》：不忍远离，心里亦有泪。永远的哥哥。🕊️ #张国荣 #港乐经典 #怀旧',
    likes: '150w',
    shares: '67.4w',
    favorites: '112w',
    comments: '34.2w',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    isFollowing: true
  },
  {
    id: 106,
    author: '王菲 Faye Wong',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=faye',
    title: '《红豆》：还没为你把红豆，熬成缠绵的伤口。空灵之声。🍓 #王菲 #治愈系 #经典',
    likes: '72.1w',
    shares: '21.4w',
    favorites: '45.2w',
    comments: '12.8w',
    videoUrl: 'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
    isFollowing: true
  },
  {
    id: 107,
    author: '朴树 Studio',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=pushu',
    title: '《平凡之路》：我曾经跨过山和大海。送给每一个在路上的你。⛰️ #朴树 #民谣 #励志',
    likes: '95.4w',
    shares: '34.1w',
    favorites: '67.2w',
    comments: '18.4w',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    isFollowing: true
  },
  {
    id: 108,
    author: '李健 音乐',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=lijian',
    title: '《贝加尔湖畔》：那里的清晨，那里的黄昏。如诗般宁静。🌊 #李健 #治愈 #唯美',
    likes: '48.2w',
    shares: '12.5w',
    favorites: '25.1w',
    comments: '6.4w',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    isFollowing: true
  },
  {
    id: 109,
    author: '那英 Official',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=naying',
    title: '《默》：我被爱判处终身孤寂。这一版现场听哭了。🖤 #那英 #Live #深情',
    likes: '35.4w',
    shares: '8.1w',
    favorites: '15.2w',
    comments: '4.2w',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    isFollowing: true
  },
  {
    id: 110,
    author: '张杰 Studio',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=jason',
    title: '《逆战》：在这个风起云涌的战场上。热血瞬间开启！🔥 #张杰 #高燃 #逆战',
    likes: '112w',
    shares: '45.7w',
    favorites: '89.4w',
    comments: '23.1w',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isFollowing: true
  }
];

const recommendedVideos = [
  {
    id: 1,
    author: '告五人 Accusefive',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=accusefive',
    title: '《给你一瓶魔法药水》：带你进入梦幻仲夏夜。✨ #告五人 #乐团 #浪漫',
    likes: '12.5w',
    shares: '5.2w',
    favorites: '8.4w',
    comments: '1.2w',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    isFollowing: false
  },
  {
    id: 2,
    author: '落日飞车 Sunset',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=sunset',
    title: '《My Jinji》：海边、落日、和你。旋律太浪漫了。🌅 #落日飞车 #氛围感 #浪漫',
    likes: '8.4w',
    shares: '3.1w',
    favorites: '5.6w',
    comments: '9842',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isFollowing: false
  },
  {
    id: 3,
    author: '毛不易工作室',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=maobuyi',
    title: '《消愁》：一杯敬明天，一杯敬过往。深夜必备。🥃 #毛不易 #故事感 #音乐',
    likes: '45.2w',
    shares: '12.1w',
    favorites: '23.4w',
    comments: '4.5w',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    isFollowing: false
  },
  {
    id: 4,
    author: '薛之谦 Joker Xue',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=joker',
    title: '《演员》：其实我很少说话，只是想看你表演。🎭 #薛之谦 #伤感歌曲 #演员',
    likes: '32.1w',
    shares: '8.4w',
    favorites: '15.6w',
    comments: '2.1w',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    isFollowing: false
  },
  {
    id: 5,
    author: '华晨宇 Studio',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=hua',
    title: '《烟火里的尘埃》：我就是我，不一样的烟火。🔥 #华晨宇 #Live现场 #高音',
    likes: '56.4w',
    shares: '15.2w',
    favorites: '28.1w',
    comments: '6.7w',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    isFollowing: false
  },
  {
    id: 6,
    author: '新裤子乐队',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=newpants',
    title: '《你要跳舞吗》：在派对里尽情摇摆！蹦迪曲目。🕺 #新裤子 #摇滚 #快乐',
    likes: '23.1w',
    shares: '6.4w',
    favorites: '12.5w',
    comments: '3.2w',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackAds.mp4',
    isFollowing: false
  },
  {
    id: 7,
    author: '李荣浩 音乐',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=lironghao',
    title: '《年少有为》：假如我年少有为不自卑。唱出了多少人的遗憾。🎸 #李荣浩 #共鸣 #年少有为',
    likes: '41.2w',
    shares: '9.5w',
    favorites: '18.4w',
    comments: '5.2w',
    videoUrl: 'https://filesamples.com/samples/video/mp4/sample_960x540.mp4',
    isFollowing: false
  },
  {
    id: 8,
    author: '五月天 Mayday',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=mayday',
    title: '《突然好想你》：最怕空气突然安静。演唱会万人大合唱。😭 #五月天 #青春 #感动',
    likes: '89.5w',
    shares: '34.2w',
    favorites: '67.1w',
    comments: '12.4w',
    videoUrl: 'https://filesamples.com/samples/video/mp4/sample_1280x720.mp4',
    isFollowing: false
  },
  {
    id: 9,
    author: '孙燕姿 Yanzi',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=yanzi',
    title: '《遇见》：我遇见谁会有怎样的对白。依然是那个短发女孩。🌈 #孙燕姿 #经典歌曲 #遇见',
    likes: '56.2w',
    shares: '18.4w',
    favorites: '32.1w',
    comments: '8.9w',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    isFollowing: false
  },
  {
    id: 10,
    author: 'Beyond 乐队',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=beyond',
    title: '《海阔天空》：原谅我这一生不羁放纵爱自由。精神信仰。🕊️ #Beyond #信仰 #经典',
    likes: '230w',
    shares: '98.4w',
    favorites: '156w',
    comments: '45.2w',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    isFollowing: false
  }
];

const Channels = ({ onBack }) => {
  const [recommendedList, setRecommendedList] = useState(recommendedVideos);
  const [activeTab, setActiveTab] = useState('recommended'); // 'following' or 'recommended'
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default muted as per common practice
  const [toast, setToast] = useState('');
  const [showPublish, setShowPublish] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [publishForm, setPublishForm] = useState({ videoUrl: '', title: '', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=user' });
  const containerRef = useRef(null);

  const videos = activeTab === 'following' ? followingVideos : recommendedList;

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2000);
  };

  const handleGallerySelect = (files) => {
    if (files.length === 0) return;
    
    // For Channels, we only care about the first video selected
    const videoFile = files.find(file => file.toLowerCase().match(/\.(mp4|mov|webm)$/));
    
    if (videoFile) {
      setPublishForm({ ...publishForm, videoUrl: videoFile });
    } else {
      showToast('请选择视频文件');
    }
  };

  const handlePublish = () => {
    if (!publishForm.videoUrl || !publishForm.title) {
      showToast('请选择视频并输入文案');
      return;
    }

    const newVideo = {
      id: Date.now(),
      author: '我',
      avatar: publishForm.avatar,
      title: publishForm.title,
      likes: '0',
      shares: '0',
      favorites: '0',
      comments: '0',
      videoUrl: publishForm.videoUrl,
      isFollowing: true
    };

    setRecommendedList([newVideo, ...recommendedList]);
    setActiveTab('recommended');
    setCurrentVideoIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    setShowPublish(false);
    setPublishForm({ videoUrl: '', title: '', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=user' });
    showToast('发布成功');
  };

  const currentVideo = videos[currentVideoIndex];

  const handleScroll = (e) => {
    const scrollPos = e.target.scrollTop;
    const height = e.target.clientHeight;
    const index = Math.round(scrollPos / height);
    if (index !== currentVideoIndex && index < videos.length) {
      setCurrentVideoIndex(index);
    }
  };

  useEffect(() => {
    // Reset index when tab changes
    setCurrentVideoIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col h-full bg-black relative text-white select-none">
      {/* Header Overlay */}
      <div className="absolute top-8 left-0 right-0 z-[60] flex justify-between items-center px-4 h-12 bg-gradient-to-b from-black/40 to-transparent">
        <div className="flex items-center gap-1">
          <button onClick={onBack} className="p-2 -ml-2 drop-shadow-lg">
            <ChevronLeft size={28} />
          </button>
          <button className="p-2 drop-shadow-lg">
            <MoreHorizontal size={24} />
          </button>
        </div>
        
        <div className="flex gap-6 text-[17px] font-medium drop-shadow-lg relative">
          <button 
            onClick={() => setActiveTab('following')}
            className={`transition-all ${activeTab === 'following' ? 'text-white scale-110' : 'text-white/60'}`}
          >
            关注
          </button>
          <button 
            onClick={() => setActiveTab('recommended')}
            className={`transition-all relative ${activeTab === 'recommended' ? 'text-white scale-110' : 'text-white/60'}`}
          >
            推荐
            {activeTab === 'recommended' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full"></div>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 drop-shadow-lg">
            <Search size={24} />
          </button>
          <button 
            onClick={() => setShowPublish(true)}
            className="p-2 -mr-2 drop-shadow-lg"
          >
            <Camera size={24} />
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
      >
        {videos.map((video, idx) => (
          <VideoItem 
            key={video.id} 
            video={video} 
            isActive={idx === currentVideoIndex} 
            isMuted={isMuted}
            onMuteToggle={() => setIsMuted(!isMuted)}
            onCommentClick={() => setShowComments(true)}
            onShowToast={showToast}
          />
        ))}
      </div>

      {/* Internal Toast Notification */}
      {toast && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-black/80 px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in zoom-in duration-200">
          {toast}
        </div>
      )}

      {/* Publish Video Modal */}
      {showPublish && (
        <div className="absolute inset-0 z-[150] flex flex-col bg-black animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <button onClick={() => setShowPublish(false)} className="text-white">取消</button>
            <span className="font-bold">发布视频</span>
            <button onClick={handlePublish} className="bg-[#07c160] px-4 py-1 rounded text-white text-sm font-medium">发表</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">视频文案</label>
              <textarea 
                className="w-full bg-white/5 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#07c160] min-h-[100px]"
                placeholder="这一刻的想法..."
                value={publishForm.title}
                onChange={(e) => setPublishForm({ ...publishForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">本地视频</label>
              <div 
                onClick={() => setIsGalleryOpen(true)}
                className="w-full aspect-video bg-white/5 rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors relative overflow-hidden"
              >
                {publishForm.videoUrl ? (
                  <>
                    <video src={publishForm.videoUrl} className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPublishForm({ ...publishForm, videoUrl: '' });
                      }}
                      className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white/80 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <Plus size={32} className="text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">点击上传本地视频</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <GalleryModal 
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
            onSelect={handleGallerySelect}
            maxSelect={1}
          />
        </div>
      )}

      {/* Comments Drawer */}
      {showComments && (
        <div className="absolute inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowComments(false)}></div>
          <div className="bg-[#191919] rounded-t-2xl h-[70%] flex flex-col relative animate-in slide-in-from-bottom duration-300">
            <div className="p-4 flex justify-between items-center border-b border-white/5">
              <span className="font-medium text-[15px]">{currentVideo.comments}条评论</span>
              <button onClick={() => setShowComments(false)} className="text-gray-400">
                <ChevronLeft size={24} className="rotate-[-90deg]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex gap-3">
                <img src="https://api.dicebear.com/7.x/avataaars/png?seed=u1" className="w-8 h-8 rounded-full" alt="" />
                <div className="flex-1">
                  <div className="text-gray-400 text-xs mb-1">路人甲</div>
                  <div className="text-sm">支持！视频质量真不错。✨</div>
                </div>
              </div>
              <div className="flex gap-3">
                <img src="https://api.dicebear.com/7.x/avataaars/png?seed=u2" className="w-8 h-8 rounded-full" alt="" />
                <div className="flex-1">
                  <div className="text-gray-400 text-xs mb-1">音乐迷</div>
                  <div className="text-sm">这首歌太好听了，求完整版链接！</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#262626] flex gap-3 items-center">
              <div className="flex-1 bg-white/5 rounded-full px-4 py-2 text-sm text-white/40">
                发条评论吧...
              </div>
              <Heart size={20} className="text-gray-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const VideoItem = ({ video, isActive, isMuted, onMuteToggle, onCommentClick, onShowToast }) => {
  const videoRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFollowing, setIsFollowing] = useState(video.isFollowing);
  const [showHeart, setShowHeart] = useState(false);
  const [heartPos, setHeartPos] = useState({ x: 0, y: 0 });
  const [showMuteIndicator, setShowMuteIndicator] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const lastTap = useRef(0);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().then(() => {
        setIsPaused(false);
      }).catch(() => {
        setIsPaused(true);
      });
    } else {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
      setIsPaused(false);
    }
  }, [isActive]);

  // Show indicator when isMuted changes
  useEffect(() => {
    if (isActive) {
      setShowMuteIndicator(true);
      const timer = setTimeout(() => setShowMuteIndicator(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isMuted]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const handleDoubleTap = (e) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      // Double tap detected
      const rect = e.currentTarget.getBoundingClientRect();
      setHeartPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setShowHeart(true);
      setIsLiked(true);
      setTimeout(() => setShowHeart(false), 800);
    } else {
      // Single tap - toggle play/pause
      togglePlay();
    }
    lastTap.current = now;
  };

  return (
    <div className="h-full w-full snap-start relative flex-shrink-0 bg-black overflow-hidden" onClick={handleDoubleTap}>
      <video 
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full object-contain"
        loop
        playsInline
        muted={isMuted}
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
      />

      {/* Mute Indicator Overlay */}
      {showMuteIndicator && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-black/50 p-4 rounded-full animate-in fade-in zoom-in duration-200">
          {isMuted ? <VolumeX size={40} className="text-white" /> : <Volume2 size={40} className="text-white" />}
        </div>
      )}

      {/* Play/Pause Icon Overlay */}
      {isPaused && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-60">
          <div className="bg-black/20 p-6 rounded-full">
            <Play size={60} className="text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Small Mute Button Overlay (Bottom Right) */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onMuteToggle();
        }}
        className="absolute bottom-32 right-4 z-40 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-colors"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Double Tap Heart Animation */}
      {showHeart && (
        <div 
          className="absolute z-50 pointer-events-none animate-heart-pop"
          style={{ left: heartPos.x - 40, top: heartPos.y - 40 }}
        >
          <Heart size={80} className="text-red-500 fill-red-500" />
        </div>
      )}

      {/* Bottom Content Area - Redesigned for higher fidelity */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-32 pb-6 px-4">
        {/* 1. Title/Description - Now above everything else */}
        <div className="mb-4">
          <p className="text-[15px] leading-relaxed line-clamp-2 font-normal text-white/95">
            {video.title}
          </p>
        </div>

        {/* 2. Interaction Row - Avatar, Name, and Buttons in a clean layout */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Author Info */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <img src={video.avatar} className="w-9 h-9 rounded-full border border-white/10" alt="" />
              <div className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 bg-yellow-500 rounded-full flex items-center justify-center border border-black">
                <Plus size={10} className="text-black font-bold" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-semibold truncate">{video.author}</span>
                {!isFollowing && (
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setIsFollowing(true);
                      onShowToast('已关注');
                    }}
                    className="text-[10px] bg-[#07c160] px-1.5 py-0.5 rounded-sm text-white font-medium whitespace-nowrap min-w-[32px] flex items-center justify-center"
                  >
                    关注
                  </button>
                )}
                {isFollowing && (
                  <span className="text-[10px] bg-white/10 px-1 rounded text-white/60 whitespace-nowrap">已关注</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Interaction Buttons (Like, Comment, Favorite, Share) */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
              className="flex flex-col items-center gap-0.5 active:scale-125 transition-transform"
            >
              <ThumbsUp size={22} className={`transition-colors ${isLiked ? 'text-orange-500 fill-orange-500' : 'text-white'}`} />
              <span className="text-[10px] font-medium text-white/80">{video.likes}</span>
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); onCommentClick(); }}
              className="flex flex-col items-center gap-0.5 active:scale-125 transition-transform"
            >
              <MessageSquare size={22} className="text-white" />
              <span className="text-[10px] font-medium text-white/80">{video.comments}</span>
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); setIsFavorited(!isFavorited); }}
              className="flex flex-col items-center gap-0.5 active:scale-125 transition-transform"
            >
              <Heart size={22} className={`transition-colors ${isFavorited ? 'text-red-500 fill-red-500' : 'text-white'}`} />
              <span className="text-[10px] font-medium text-white/80">{video.favorites}</span>
            </button>

            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                navigator.clipboard.writeText(video.videoUrl).then(() => {
                  onShowToast('链接已复制');
                });
              }}
              className="flex flex-col items-center gap-0.5 active:scale-125 transition-transform"
            >
              <Share2 size={22} className="text-white" />
              <span className="text-[10px] font-medium text-white/80">{video.shares}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channels;
