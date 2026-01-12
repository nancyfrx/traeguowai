import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = ({ featuredPost }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 使用图2风格的大图（美少女战士主题或高质量插画）
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2000&auto=format&fit=crop",
      title: "月亮公主的环球旅行",
      subtitle: "探索艺术与梦幻的边界",
      author: "艺术收藏家"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2000&auto=format&fit=crop",
      title: "永恒的星光闪耀",
      subtitle: "记录每一个璀璨瞬间",
      author: "星空摄影师"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2000&auto=format&fit=crop",
      title: "数字艺术的新纪元",
      subtitle: "重新定义视觉交互",
      author: "数字艺术家"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
      title: "梦幻境地的色彩哲学",
      subtitle: "走进艺术家的精神世界",
      author: "视觉设计师"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[90vh] min-h-[700px] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* 背景图 */}
          <div className="absolute inset-0">
            <img 
              src={slides[currentIndex].image} 
              alt={slides[currentIndex].title}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>

          {/* 内容 */}
          <div className="relative z-10 h-full flex flex-col justify-end pb-32 px-12 max-w-[1600px] mx-auto">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="w-12 h-[2px] bg-white"></span>
                <span className="text-white text-sm font-bold uppercase tracking-[0.3em]">
                  {slides[currentIndex].author}
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic">
                {slides[currentIndex].title}
              </h1>
              <p className="text-2xl text-white/70 max-w-2xl font-medium tracking-tight">
                {slides[currentIndex].subtitle}
              </p>
              <div className="pt-8">
                <button className="px-12 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-zinc-200 transition-all transform hover:scale-105 active:scale-95 shadow-2xl">
                  查看详情
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 控制按钮 */}
      <div className="absolute bottom-12 right-12 z-20 flex gap-4">
        <button 
          onClick={prevSlide}
          className="p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* 进度条 */}
      <div className="absolute bottom-12 left-12 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1 transition-all duration-500 rounded-full ${
              i === currentIndex ? 'w-16 bg-white' : 'w-8 bg-white/20'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
