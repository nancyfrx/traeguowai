import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getFileUrl } from '../api';

const Hero = ({ articles = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 默认幻灯片数据
  const defaultSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2000&auto=format&fit=crop",
      title: "幻影维度的艺术探索",
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

  // 如果有来自数据库的文章，则使用文章数据
  const slides = articles.length > 0 
    ? articles.map(art => ({
        id: art.id,
        image: getFileUrl(art.coverImage) || defaultSlides[0].image,
        title: art.title,
        subtitle: art.summary,
        author: art.author?.nickname || "匿名艺术家"
      })).slice(0, 4) // 只取前4篇
    : defaultSlides;

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full h-[90vh] min-h-[700px] overflow-hidden bg-black group">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${slides[currentIndex].id}-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset }) => {
            const swipe = offset.x;
            if (swipe < -100) {
              nextSlide();
            } else if (swipe > 100) {
              prevSlide();
            }
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          {/* 背景图 */}
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src={slides[currentIndex].image} 
              alt={slides[currentIndex].title}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>

          {/* 内容 */}
          <div className="relative z-10 h-full flex flex-col justify-end pb-32 px-12 max-w-[1600px] mx-auto pointer-events-none">
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
              <p className="text-white/60 text-lg md:text-2xl max-w-2xl font-medium tracking-tight italic">
                {slides[currentIndex].subtitle}
              </p>
              
              <div className="pt-8 pointer-events-auto">
                <Link 
                  to={slides[currentIndex].id ? `/article/${slides[currentIndex].id}` : "#"}
                  className="inline-flex items-center gap-4 px-10 py-4 bg-white text-black rounded-full text-xs font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform"
                >
                  探索作品 <ChevronRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 左右导航按钮 */}
      <div className="absolute bottom-12 right-12 z-20 flex items-center gap-4">
        <button 
          onClick={prevSlide}
          className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* 进度条指示器 */}
      <div className="absolute bottom-0 left-0 w-full h-1 flex gap-1 z-20">
        {slides.map((_, index) => (
          <div key={index} className="flex-1 h-full bg-white/10 overflow-hidden">
            {index === currentIndex && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-white"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
