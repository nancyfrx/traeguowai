const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api';

const artThemes = [
    { title: "幻影维度的艺术探索", summary: "探索艺术与梦幻的边界，揭示隐藏在视觉背后的深层逻辑。", categoryId: 1 },
    { title: "永恒的星光闪耀", summary: "记录每一个璀璨瞬间，捕捉宇宙中最动人的光影。", categoryId: 2 },
    { title: "数字艺术的新纪元", summary: "重新定义视觉交互，开启数字时代的审美新篇章。", categoryId: 1 },
    { title: "梦幻境地的色彩哲学", summary: "走进艺术家的精神世界，领略色彩构成的无限可能。", categoryId: 2 },
    { title: "几何抽象的节奏感", summary: "线条与形状的交响乐，演绎现代主义的纯粹美学。", categoryId: 1 },
    { title: "光影交织的瞬间", summary: "摄影艺术的巅峰对决，定格生命中最真实的面孔。", categoryId: 2 },
    { title: "极简主义的深度", summary: "少即是多，在留白中发现万物的本真。", categoryId: 1 },
    { title: "赛博朋克的视觉冲击", summary: "霓虹与暗影的对撞，预见未来的都市奇观。", categoryId: 2 },
    { title: "水墨丹青的现代转译", summary: "传统精髓与现代审美的融合，重塑东方韵味。", categoryId: 1 },
    { title: "超现实主义的梦境", summary: "打破逻辑的枷锁，在潜意识的荒原中漫游。", categoryId: 2 }
];

const images = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
    "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=1200",
    "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=1200",
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200",
    "https://images.unsplash.com/photo-1574169208507-84376144848b?w=1200",
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200",
    "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200",
    "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200",
    "https://images.unsplash.com/photo-1554188248-986adbb73be4?w=1200",
    "https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200"
];

const contentParagraphs = [
    "在当今瞬息万变的艺术领域，传统的边界正在被不断的创新所打破。艺术家们不再满足于单一的表达形式，而是通过跨媒介的融合，探索人类情感的更深层次。",
    "色彩不仅是视觉的语言，更是情绪的载体。在这组作品中，暖色调的大胆运用与冷色调的细腻点缀形成了强烈的视觉张力，仿佛在诉说着一段关于成长与蜕变的故事。",
    "技术的发展为艺术创作提供了无限可能。从数字绘画到算法生成的图形，科技不再是艺术的对立面，而是成为了激发灵感的全新引擎，开启了审美的新篇章。",
    "回归自然是艺术永恒的主题。通过对光影流动的捕捉，作品展现了自然界中最原始、最动人的瞬间，引导观者在繁忙的都市生活中寻找内心的片刻宁静。",
    "极简主义的核心不在于形式的简单，而在于意义的精准。每一根线条、每一个几何形状都经过深思熟虑，旨在剔除冗余，直抵事物的本真。"
];

async function seed() {
    console.log('Starting seed process...');
    
    try {
        // 由于已经通过 SQL 清理了数据库，这里直接开始插入
        console.log('Database cleared. Starting data insertion...');

        for (let i = 0; i < 30; i++) {
            const theme = artThemes[i % artThemes.length];
            const coverImage = images[i % images.length];
            
            const contentBlocks = [
                {
                    image: images[(i + 1) % images.length],
                    text: contentParagraphs[0] + " 艺术家在 Scene 1 中特别强调了这种冲突与和谐的统一。"
                },
                {
                    image: images[(i + 2) % images.length],
                    text: contentParagraphs[1] + " 来到 Scene 2，我们可以清晰地感受到那种扑面而来的生命力。"
                },
                {
                    image: images[(i + 3) % images.length],
                    text: contentParagraphs[2] + " Scene 3 则展示了技术介入后带来的超现实主义美感。"
                },
                {
                    image: images[(i + 4) % images.length],
                    text: contentParagraphs[3] + " 在最后的 Scene 4 中，一切归于平淡，展现了自然与艺术的终极融合。"
                }
            ];

            const articleData = {
                title: `${theme.title} #${i + 1}`,
                summary: theme.summary,
                content: `这是关于《${theme.title}》的深度解析。${contentParagraphs[4]} 艺术家通过这件作品，完美地诠释了当代艺术的复杂性与多变性。`,
                coverImage: coverImage,
                contentBlocks: JSON.stringify(contentBlocks),
                isDraft: false,
                category: { id: theme.categoryId },
                viewCount: Math.floor(Math.random() * 5000),
                likeCount: Math.floor(Math.random() * 500)
            };

            await axios.post(`${API_BASE_URL}/articles`, articleData);
            process.stdout.write(`.`); // 进度条
            if ((i + 1) % 10 === 0) console.log(` [${i + 1}/30]`);
        }

        console.log('\nSeeding completed successfully!');
    } catch (error) {
        console.error('\nSeed failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

seed();
