import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MarqueeSection = ({ articles = [] }) => {
  // 提取所有图片
  const allImages = useMemo(() => {
    const images = [];
    articles.forEach(article => {
      // 添加封面图
      if (article.coverImage) {
        images.push({
          id: `${article.id}-cover`,
          articleId: article.id,
          url: article.coverImage,
          title: article.title,
          author: article.author?.nickname || '艺术家',
          price: (article.likeCount / 1000 + 0.5).toFixed(3) // 模拟价格
        });
      }
      
      // 解析内容块中的图片
      if (article.contentBlocks) {
        try {
          const blocks = typeof article.contentBlocks === 'string' 
            ? JSON.parse(article.contentBlocks) 
            : article.contentBlocks;
            
          blocks.forEach((block, index) => {
            if (block.image) {
              images.push({
                id: `${article.id}-block-${index}`,
                articleId: article.id,
                url: block.image,
                title: article.title,
                author: article.author?.nickname || '艺术家',
                price: (article.likeCount / 1000 + Math.random()).toFixed(3)
              });
            }
          });
        } catch (e) {
          console.error('Failed to parse content blocks for marquee', e);
        }
      }
    });

    // 随机打乱
    return images.sort(() => Math.random() - 0.5);
  }, [articles]);

  // 如果没有图片，返回空
  if (allImages.length === 0) return null;

  // 为了实现无缝滚动，我们需要重复图片数组
  const duplicatedImages = [...allImages, ...allImages];
  const itemWidth = 280;
  const gap = 32;
  const totalWidth = (itemWidth + gap) * allImages.length;

  return (
    <section className="py-24 bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-900">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="relative overflow-hidden rounded-sm">
          {/* 渐变遮罩，使边缘过渡更自然 */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none" />
          
          <motion.div
            className="flex gap-8"
            animate={{
              x: [0, -totalWidth],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: allImages.length * 4,
                ease: "linear",
              },
            }}
            style={{ width: "max-content" }}
          >
          {duplicatedImages.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              to={`/article/${item.articleId}`}
              className="flex-shrink-0 group"
            >
              <div className="w-[280px] space-y-4">
                {/* 图片容器 */}
                <div className="aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-sm relative">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                </div>
                
                {/* 元数据 */}
                <div className="space-y-1">
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100 truncate">
                    {item.author}
                  </h3>
                  <p className="text-[10px] font-medium text-zinc-400">
                    {item.price}Ξ <span className="opacity-60">(${(parseFloat(item.price) * 3100).toLocaleString()})</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MarqueeSection;
