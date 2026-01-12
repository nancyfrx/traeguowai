import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, MoreHorizontal, Smile, PlusCircle, Mic, Image, Camera, Video, MapPin, Wallet, Gift, ArrowLeftRight, Keyboard } from 'lucide-react';

const ChatDetail = ({ chat, onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: chat.lastMsg, isMe: false, time: chat.time }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chat.name === '人大 23 级应用心理学硕士') {
      setMessages([
        { id: 1, text: '大家说，为什么熬夜的人多？', name: '学术宅', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=scholar', isMe: false, time: '10:00' },
        { id: 2, text: '因为白天的时间被生活绑架，夜晚的时间才属于灵魂。', name: '哲学家', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=philosopher', isMe: false, time: '10:01' },
        { id: 3, text: '胡说，明明是因为手机太好玩了！', name: '真话哥', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=truth', isMe: false, time: '10:02' },
        { id: 4, text: '心理学研究表明：报复性熬夜是对白天失去控制感的补偿。', name: '课代表', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=rep', isMe: false, time: '10:03' },
        { id: 5, text: '说人话？', name: '学术宅', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=scholar', isMe: false, time: '10:04' },
        { id: 6, text: '我不困，我还能卷！', name: '卷王', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=king', isMe: false, time: '10:05' },
        { id: 7, text: '卷王你走开，我现在只想躺平。', name: '咸鱼', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=fish', isMe: false, time: '10:06' },
        { id: 8, text: '躺平也是一种心理防御机制。', name: '课代表', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=rep', isMe: false, time: '10:07' },
        { id: 9, text: '你们能不能聊点轻松的？比如明早吃什么？', name: '干饭人', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=eat', isMe: false, time: '10:08' },
        { id: 10, text: '吃个屁，明早有专业课！', name: '学术宅', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=scholar', isMe: false, time: '10:09' }
      ]);
    }
  }, [chat.name]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageMsg = {
          id: Date.now(),
          image: event.target.result,
          isMe: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, imageMsg]);
      };
      reader.readAsDataURL(file);
    }
    setShowMore(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, showMore, showEmoji]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: input,
      isMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');

    // AI Robot Auto Reply
    if (chat.isRobot) {
      setIsTyping(true);
      try {
        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 00b08fee86f84b33a353f45b0b0f6c0f.tBYJiYISieVqrTjA`
          },
          body: JSON.stringify({
            model: 'glm-4-flash',
            messages: [
              { role: 'user', content: currentInput }
            ]
          })
        });

        const data = await response.json();
        const aiMsg = {
          id: Date.now() + 1,
          text: data.choices[0].message.content,
          isMe: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } catch (error) {
        console.error('AI Error:', error);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Normal contact auto reply
      setTimeout(() => {
        const replyMsg = {
          id: Date.now() + 1,
          text: '好的，我知道了。',
          isMe: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, replyMsg]);
      }, 1000);
    }
  };

  const moreItems = [
    { 
      icon: <Image size={28} className="text-[#4c4c4c]" />, 
      label: '照片',
      onClick: () => fileInputRef.current?.click()
    },
    { icon: <Camera size={28} className="text-[#4c4c4c]" />, label: '拍摄' },
    { icon: <Video size={28} className="text-[#4c4c4c]" />, label: '视频通话' },
    { icon: <MapPin size={28} className="text-[#4c4c4c]" />, label: '位置' },
    { icon: <Wallet size={28} className="text-[#4c4c4c]" />, label: '红包' },
    { icon: <Gift size={28} className="text-[#4c4c4c]" />, label: '礼物' },
    { icon: <ArrowLeftRight size={28} className="text-[#4c4c4c]" />, label: '转账' },
    { icon: <Mic size={28} className="text-[#4c4c4c]" />, label: '语音输入' },
  ];

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔'];

  return (
    <div className="flex flex-col h-full bg-[#ededed] absolute inset-0 z-[100]">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleImageUpload}
      />
      {/* Header */}
      <div className="flex justify-between items-center px-4 h-12 bg-[#ededed] border-b border-gray-200 shrink-0">
        <button onClick={onBack} className="flex items-center">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[17px] font-medium">{chat.name}</h1>
        <MoreHorizontal size={24} />
      </div>

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-start gap-2.5`}>
            {!msg.isMe && (
              <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${msg.avatar ? '' : (chat.avatarBg || 'bg-gray-200')}`}>
                <img src={msg.avatar || chat.avatar} className="w-10 h-10 rounded-md object-cover" crossOrigin="anonymous" alt="" />
              </div>
            )}
            <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
              {!msg.isMe && msg.name && (
                <span className="text-[12px] text-gray-500 mb-1 ml-1">{msg.name}</span>
              )}
              <div className={`relative px-3 py-2 rounded-lg text-[15px] ${
                msg.isMe ? 'bg-wechat-green text-black' : 'bg-white text-black'
              } ${msg.image ? 'p-1' : ''}`}>
                {msg.image ? (
                  <img src={msg.image} className="max-w-full rounded-md" alt="sent" />
                ) : (
                  msg.text
                )}
                {/* Arrow */}
                {!msg.image && (
                  <div className={`absolute top-3 w-2 h-2 rotate-45 ${
                    msg.isMe ? 'bg-wechat-green -right-1' : 'bg-white -left-1'
                  }`}></div>
                )}
              </div>
            </div>
            {msg.isMe && (
              <img 
                src="https://api.dicebear.com/7.x/avataaars/png?seed=Felix" 
                className="w-10 h-10 rounded-md bg-white flex-shrink-0" 
                crossOrigin="anonymous" 
                alt="" 
              />
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start items-start gap-2.5">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${chat.avatarBg || 'bg-gray-200'}`}>
              <img src={chat.avatar} className="w-8 h-8 object-contain" crossOrigin="anonymous" alt="" />
            </div>
            <div className="bg-white px-3 py-2 rounded-lg text-[15px]">
              正在输入...
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="bg-[#f7f7f7] border-t border-gray-200 px-3 py-2 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <Mic size={28} className="text-[#1a1a1a]" />
          <input 
            type="text" 
            className="flex-1 h-9 bg-white rounded-md px-3 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => { setShowMore(false); setShowEmoji(false); }}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={() => { setShowEmoji(!showEmoji); setShowMore(false); }}>
            {showEmoji ? <Keyboard size={28} className="text-[#1a1a1a]" /> : <Smile size={28} className="text-[#1a1a1a]" />}
          </button>
          {input.trim() ? (
            <button 
              onClick={handleSend}
              className="bg-wechat-green text-white px-3 py-1 rounded-md text-[14px] h-9"
            >
              发送
            </button>
          ) : (
            <button onClick={() => { setShowMore(!showMore); setShowEmoji(false); }}>
              <PlusCircle size={28} className="text-[#1a1a1a]" />
            </button>
          )}
        </div>
      </div>

      {/* Panels */}
      {(showMore || showEmoji) && (
        <div className="bg-[#f7f7f7] border-t border-gray-200 h-[280px] px-6 py-6 overflow-y-auto">
          {showMore && (
            <div className="grid grid-cols-4 gap-y-8">
              {moreItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={item.onClick}
                >
                  <div className="w-[60px] h-[60px] bg-white rounded-2xl flex items-center justify-center shadow-sm active:bg-gray-100 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-[12px] text-[#888888]">{item.label}</span>
                </div>
              ))}
            </div>
          )}
          {showEmoji && (
            <div className="grid grid-cols-7 gap-4">
              {emojis.map((emoji, idx) => (
                <button 
                  key={idx} 
                  className="text-2xl flex items-center justify-center aspect-square active:bg-gray-200 rounded-lg"
                  onClick={() => setInput(prev => prev + emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          
          {/* Page Indicator (dots) for showMore */}
          {showMore && (
            <div className="flex justify-center gap-2 mt-8">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatDetail;
