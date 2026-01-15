package com.blog.backend;

import com.blog.backend.entity.Article;
import com.blog.backend.entity.Category;
import com.blog.backend.entity.User;
import com.blog.backend.repository.ArticleRepository;
import com.blog.backend.repository.CategoryRepository;
import com.blog.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(ArticleRepository articleRepository, 
                                     UserRepository userRepository, 
                                     CategoryRepository categoryRepository,
                                     org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. 创建默认用户 (独立检查)
            User admin;
            if (userRepository.count() == 0) {
                admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("123456")); // 设置密码为 123456
                admin.setEmail("admin@example.com");
                admin.setNickname("匿名艺术家");
                admin.setRole("ROLE_ADMIN");
                admin = userRepository.save(admin);
            } else {
                admin = userRepository.findByUsername("admin").orElse(null);
                if (admin != null) {
                    admin.setPassword(passwordEncoder.encode("123456")); // 强制更新密码为 123456
                    userRepository.save(admin);
                }
            }

            if (articleRepository.count() == 0 && admin != null) {
                // 2. 创建分类
                Category art = new Category();
                art.setName("数字艺术");
                art.setDescription("digital-art");
                art = categoryRepository.save(art);

                Category tech = new Category();
                tech.setName("技术前沿");
                tech.setDescription("tech-frontier");
                tech = categoryRepository.save(tech);

                // 3. 随机生成中文文章
                String[] titles = {
                    "数字艺术的流动性与透明边界",
                    "赛博朋克：霓虹灯下的未来哲学",
                    "抽象表现主义在代码中的重生",
                    "光影交织：探索虚拟现实的视觉极限",
                    "算法之美：当数学公式转化为视觉盛宴",
                    "幻影维度：探索超现实主义的数字表达",
                    "永恒的星光闪耀：数字摄影的魅力",
                    "梦幻境地的色彩哲学：色彩对情绪的深层影响"
                };

                String[] summaries = {
                    "探索数字资产在透明物理空间中的存在感，重新定义艺术品与收藏家之间的交互方式。",
                    "在繁华的都市背景下，探讨人类灵魂与机械躯壳的冲突与共生。",
                    "代码不再仅仅是逻辑的载体，它正在成为艺术家手中最灵动的画笔。",
                    "VR技术如何打破次元壁，让我们身临其境地感受艺术家的精神世界。",
                    "揭秘那些令人惊叹的分形艺术背后的数学逻辑，感受逻辑与美感的统一。",
                    "在虚拟与现实的重叠地带，寻找那些被遗忘的视觉碎片，重构感官体验。",
                    "捕捉那些转瞬即逝的光影瞬间，用数字技术留住永恒的星空之美。",
                    "色彩不仅仅是视觉的感官，更是通往潜意识的钥匙，探讨其在艺术创作中的核心地位。"
                };

                String[] coverImages = {
                    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop"
                };

                for (int i = 0; i < titles.length; i++) {
                    Article article = new Article();
                    article.setTitle(titles[i]);
                    article.setSummary(summaries[i]);
                    article.setContent("# " + titles[i] + "\n\n" + summaries[i] + "\n\n" + 
                        "这是由系统自动生成的深度解析内容。在数字艺术的世界里，我们不断探索、不断突破。\n\n" +
                        "## 核心观点\n" +
                        "- **创新性**：将传统艺术形式与现代算法结合。\n" +
                        "- **交互性**：让观众成为艺术创作的一部分。\n" +
                        "- **永恒性**：在区块链上留下不可磨灭的印记。\n\n" +
                        "### 总结\n" +
                        "艺术是人类文明的火种，而数字技术则是让这火种燃烧得更旺的薪柴。");
                    article.setCoverImage(coverImages[i]);
                    article.setIsDraft(false);
                    article.setAuthor(admin);
                    article.setCategory(i % 2 == 0 ? art : tech);
                    article.setPublishedAt(LocalDateTime.now());
                    article.setViewCount((long) (Math.random() * 1000));
                    article.setLikeCount((long) (Math.random() * 500));
                    article.setPrice(0.1 + Math.random() * 2.0); // 随机生成 0.1 - 2.1 之间的价格
                    articleRepository.save(article);
                }
            }

            // 为所有没有价格的文章生成随机价格
            List<Article> allArticles = articleRepository.findAll();
            boolean updated = false;
            for (Article article : allArticles) {
                if (article.getPrice() == null) {
                    article.setPrice(0.1 + Math.random() * 2.0);
                    articleRepository.save(article);
                    updated = true;
                }
            }
            if (updated) {
                System.out.println("Initialized prices for existing articles.");
            }
        };
    }
}
