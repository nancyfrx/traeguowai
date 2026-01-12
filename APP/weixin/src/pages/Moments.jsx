import React, { useState, useEffect } from 'react';
import { ChevronLeft, Camera, MessageSquare, Heart } from 'lucide-react';

const initialMomentsData = [
  {
    id: 1,
    name: '林深见鹿',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=deer',
    text: '今天的落日真美，随手一拍都是大片。🌅',
    images: ['https://picsum.photos/seed/sunset/800/600'],
    time: '2分钟前',
    likes: ['李子明', '赵大叔', '孙尚香', '鲁班七号'],
    comments: [
      { name: '王阿姨', text: '中大奖🏆🏆' },
      { name: '张小帅', text: '这景色无敌了！' }
    ]
  },
  {
    id: 2,
    name: '星辰大海',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=star',
    text: '终于吃到了这家排队两小时的火锅，味道绝了！🥘',
    images: [
      'https://picsum.photos/seed/food1/300/300',
      'https://picsum.photos/seed/food2/300/300',
      'https://picsum.photos/seed/food3/300/300',
      'https://picsum.photos/seed/food4/300/300'
    ],
    time: '15分钟前',
    likes: ['周杰伦', '陈奕迅', '林俊杰'],
    comments: [
      { name: '蔡依林', text: '下次带我一起去！' }
    ]
  },
  {
    id: 3,
    name: '不负韶华',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=youth',
    text: '健身房打卡，又是元气满满的一天！💪',
    images: ['https://picsum.photos/seed/gym/800/1000'],
    time: '1小时前',
    likes: ['彭于晏', '吴彦祖'],
    comments: [
      { name: '郭德纲', text: '身材越来越棒了！' }
    ]
  },
  {
    id: 4,
    name: '一期一会',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=meet',
    text: '新买的乐高终于拼好了，成就感满满！🧩',
    images: [
      'https://picsum.photos/seed/lego1/300/300',
      'https://picsum.photos/seed/lego2/300/300',
      'https://picsum.photos/seed/lego3/300/300'
    ],
    time: '3小时前',
    likes: ['岳云鹏', '沈腾'],
    comments: [
      { name: '贾玲', text: '这个系列很经典啊。' }
    ]
  },
  {
    id: 5,
    name: '清风徐来',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=wind',
    text: '花果山的桃子熟了，欢迎各位来尝尝。🍑',
    images: ['https://picsum.photos/seed/peach/800/600'],
    time: '5小时前',
    likes: ['猪八戒', '沙和尚', '白龙马'],
    comments: [
      { name: '唐三藏', text: '悟空，给为师留两个。' }
    ]
  },
  {
    id: 6,
    name: '云淡风轻',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=cloud',
    text: '高老庄的饭菜还是那么香，真想天天吃。🍱',
    images: ['https://picsum.photos/seed/eat/800/600'],
    time: '8小时前',
    likes: ['孙悟空', '翠兰'],
    comments: [
      { name: '沙和尚', text: '二师兄又在想吃了。' }
    ]
  },
  {
    id: 7,
    name: '岁月静好',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=time',
    text: '流沙河的水清了不少，心情也跟着变好了。🌊',
    images: ['https://picsum.photos/seed/river/800/600'],
    time: '12小时前',
    likes: ['孙悟空', '猪八戒'],
    comments: [
      { name: '白龙马', text: '确实，水质变好了。' }
    ]
  },
  {
    id: 8,
    name: '浮生若梦',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=dream',
    text: '奔跑在草原上的感觉真自由。🐎',
    images: ['https://picsum.photos/seed/horse/800/600'],
    time: '昨天',
    likes: ['唐三藏', '观音姐姐'],
    comments: [
      { name: '孙悟空', text: '白龙师弟好兴致！' }
    ]
  }
];

const Moments = ({ onBack, onCamera, onUserClick, newMoments = [] }) => {
  const [moments, setMoments] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [commentInput, setCommentInput] = useState({ id: null, text: '' });

  useEffect(() => {
    // Process new moments from props
    const processedNewMoments = newMoments.map(m => ({
      ...m,
      likes: m.likes || [],
      comments: m.comments || []
    }));
    setMoments([...processedNewMoments, ...initialMomentsData]);
  }, [newMoments]);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleLike = (id) => {
    setMoments(prev => prev.map(m => {
      if (m.id === id) {
        const hasLiked = m.likes.includes('fengruxue');
        return {
          ...m,
          likes: hasLiked 
            ? m.likes.filter(name => name !== 'fengruxue')
            : [...m.likes, 'fengruxue']
        };
      }
      return m;
    }));
    setActiveMenuId(null);
  };

  const handleCommentSubmit = (e) => {
    if (e.key === 'Enter' && commentInput.text.trim()) {
      setMoments(prev => prev.map(m => {
        if (m.id === commentInput.id) {
          return {
            ...m,
            comments: [...m.comments, { name: 'fengruxue', text: commentInput.text }]
          };
        }
        return m;
      }));
      setCommentInput({ id: null, text: '' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative" onClick={() => setActiveMenuId(null)}>
      {/* Navbar */}
      <div className={`flex justify-between items-center px-4 h-12 absolute top-8 left-0 right-0 z-50 transition-colors ${isScrolled ? 'bg-wechat-bg text-black' : 'bg-transparent text-white'}`}>
        <button onClick={onBack} className="flex items-center p-2 -ml-2 drop-shadow-md">
          <ChevronLeft size={28} />
        </button>
        <h1 className={`text-[17px] font-bold transition-opacity ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>朋友圈</h1>
        <button onClick={onCamera} className="p-2 -mr-2 drop-shadow-md">
          <Camera size={24} />
        </button>
      </div>

      <div 
        className="flex-1 overflow-y-auto scrollbar-hide"
        onScroll={(e) => setIsScrolled(e.target.scrollTop > 200)}
      >
        {/* Cover */}
        <div className="relative h-80 mb-16 bg-gray-200">
          <img 
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80" 
            className="w-full h-full object-cover" 
            alt="cover"
          />
          <div className="absolute -bottom-6 right-4 flex items-center gap-3">
            <span className="text-white font-bold text-lg mb-6 drop-shadow-md">fengruxue</span>
            <img 
              src="https://api.dicebear.com/7.x/avataaars/png?seed=shiba" 
              className="w-18 h-18 rounded-lg border-2 border-white shadow-sm bg-white cursor-pointer" 
              alt="avatar"
              crossOrigin="anonymous"
              onClick={() => onUserClick({ name: 'fengruxue', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=shiba' })}
            />
          </div>
        </div>

        {/* Moments Stream */}
        <div className="px-4 space-y-8 pb-10">
          {moments.map(post => (
            <div key={post.id} className="flex gap-3 border-b border-gray-100 pb-6 last:border-none">
              <img 
                src={post.avatar} 
                className="w-11 h-11 rounded-md bg-gray-100 flex-shrink-0 cursor-pointer" 
                alt="" 
                crossOrigin="anonymous" 
                onClick={() => onUserClick(post)}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-wechat-link font-bold text-[15px] mb-1.5 cursor-pointer" onClick={() => onUserClick(post)}>{post.name}</h4>
                <p className="text-[15px] mb-3 text-black leading-snug whitespace-pre-wrap">{post.text}</p>
                
                {/* Media Content */}
                {post.video ? (
                  <div className="mb-3 w-full aspect-video bg-black rounded-sm overflow-hidden relative group">
                    <video 
                      src={post.video} 
                      className="w-full h-full object-contain" 
                      onClick={(e) => {
                        const v = e.target;
                        if (v.paused) v.play();
                        else v.pause();
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  post.images && post.images.length > 0 && (
                    <div className={`grid gap-1 mb-3 ${
                      post.images.length === 1 ? 'grid-cols-1' : 
                      post.images.length === 4 ? 'grid-cols-2 w-[240px]' : 
                      'grid-cols-3 w-full'
                    }`}>
                      {post.images.map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          className={`object-cover bg-gray-50 cursor-pointer ${
                            post.images.length === 1 ? 'max-w-[180px] max-h-[180px] rounded-sm' : 
                            'aspect-square w-full rounded-sm'
                          }`}
                          alt="" 
                          onClick={() => setPreviewImage(img)}
                        />
                      ))}
                    </div>
                  )
                )}

                <div className="flex justify-between items-center mt-2 relative">
                  <span className="text-[13px] text-gray-400">{post.time}</span>
                  
                  <div className="flex items-center gap-2">
                    {/* Interaction Menu */}
                    {activeMenuId === post.id && (
                      <div className="absolute right-10 top-1/2 -translate-y-1/2 bg-[#4c4c4c] rounded-md flex items-center overflow-hidden animate-in fade-in slide-in-from-right-2 duration-200 z-10">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-1.5 px-4 py-2 text-white text-[14px] hover:bg-black/20"
                        >
                          <Heart size={16} fill={post.likes.includes('fengruxue') ? 'white' : 'transparent'} />
                          <span>{post.likes.includes('fengruxue') ? '取消' : '赞'}</span>
                        </button>
                        <div className="w-[1px] h-4 bg-black/20"></div>
                        <button 
                          onClick={() => {
                            setCommentInput({ id: post.id, text: '' });
                            setActiveMenuId(null);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 text-white text-[14px] hover:bg-black/20"
                        >
                          <MessageSquare size={16} />
                          <span>评论</span>
                        </button>
                      </div>
                    )}

                    <button 
                      onClick={(e) => toggleMenu(e, post.id)}
                      className="bg-[#f7f7f7] p-1 px-2 rounded-sm active:bg-gray-200 transition-colors"
                    >
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-wechat-link rounded-full"></div>
                        <div className="w-1 h-1 bg-wechat-link rounded-full"></div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Likes & Comments Section */}
                {(post.likes.length > 0 || post.comments.length > 0) && (
                  <div className="mt-2 bg-[#f7f7f7] rounded-sm overflow-hidden">
                    {/* Likes */}
                    {post.likes.length > 0 && (
                      <div className={`p-2 px-3 flex items-start gap-2 ${post.comments.length > 0 ? 'border-b border-gray-200/50' : ''}`}>
                        <Heart size={14} className="text-wechat-link mt-1 shrink-0" />
                        <div className="text-wechat-link text-[14px] font-medium leading-relaxed">
                          {post.likes.join(', ')}
                        </div>
                      </div>
                    )}
                    
                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="p-2 px-3 space-y-1">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="text-[14px] leading-relaxed">
                            <span className="text-wechat-link font-medium">{comment.name}: </span>
                            <span className="text-black">{comment.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Inline Comment Input */}
                {commentInput.id === post.id && (
                  <div className="mt-2 flex gap-2">
                    <input 
                      autoFocus
                      type="text"
                      placeholder="评论"
                      className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-[14px] outline-none focus:border-wechat-green"
                      value={commentInput.text}
                      onChange={(e) => setCommentInput(prev => ({ ...prev, text: e.target.value }))}
                      onKeyDown={handleCommentSubmit}
                      onBlur={() => !commentInput.text && setCommentInput({ id: null, text: '' })}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Preview Overlay */}
      {previewImage && (
        <div 
          className="absolute inset-0 bg-black z-[100] flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} className="max-w-full max-h-full object-contain" alt="preview" />
        </div>
      )}
    </div>
  );
};

export default Moments;
