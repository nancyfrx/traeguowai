package com.blog.backend.service;

import com.blog.backend.entity.Article;
import com.blog.backend.repository.ArticleRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private OssService ossService;

    @Autowired
    private ObjectMapper objectMapper;

    public Page<Article> getAllPublishedArticles(Pageable pageable) {
        Page<Article> articles = articleRepository.findByIsDraftFalse(pageable);
        articles.forEach(this::proxyArticleUrls);
        return articles;
    }

    public Page<Article> getFeaturedArticles(Pageable pageable) {
        Page<Article> articles = articleRepository.findByIsFeaturedTrueAndIsDraftFalse(pageable);
        articles.forEach(this::proxyArticleUrls);
        return articles;
    }

    public Page<Article> getAllArticles(Pageable pageable) {
        Page<Article> articles = articleRepository.findAll(pageable);
        articles.forEach(this::proxyArticleUrls);
        return articles;
    }

    public Optional<Article> getArticleById(Long id) {
        Optional<Article> article = articleRepository.findById(id);
        article.ifPresent(this::proxyArticleUrls);
        return article;
    }

    private void proxyArticleUrls(Article article) {
        // Use proxy URLs instead of signed URLs to hide OSS credentials and signatures
        // from the browser while maintaining access to private bucket content.
        
        if (article.getCoverImage() != null && article.getCoverImage().startsWith("http")) {
            article.setCoverImage(ossService.getProxyUrl(article.getCoverImage()));
        }

        if (article.getAuthor() != null && article.getAuthor().getAvatar() != null && article.getAuthor().getAvatar().startsWith("http")) {
            article.getAuthor().setAvatar(ossService.getProxyUrl(article.getAuthor().getAvatar()));
        }

        if (article.getContentBlocks() != null) {
            try {
                List<Map<String, Object>> blocks = objectMapper.readValue(
                    article.getContentBlocks(), 
                    new TypeReference<List<Map<String, Object>>>() {}
                );
                
                boolean modified = false;
                for (Map<String, Object> block : blocks) {
                    Object image = block.get("image");
                    if (image instanceof String && ((String) image).startsWith("http")) {
                        block.put("image", ossService.getProxyUrl((String) image));
                        modified = true;
                    }
                }
                
                if (modified) {
                    article.setContentBlocks(objectMapper.writeValueAsString(blocks));
                }
            } catch (Exception e) {
                // Ignore parsing errors for proxying
            }
        }
    }

    @Transactional
    public void incrementViewCount(Long id) {
        articleRepository.incrementViewCount(id);
    }

    @Transactional
    public void incrementLikeCount(Long id) {
        articleRepository.incrementLikeCount(id);
    }

    @Transactional
    public void decrementLikeCount(Long id) {
        articleRepository.decrementLikeCount(id);
    }

    @Transactional
    public Article saveArticle(Article article) {
        if (Boolean.TRUE.equals(article.getIsFeatured())) {
            articleRepository.clearFeatured();
        }
        Article savedArticle = articleRepository.save(article);
        proxyArticleUrls(savedArticle);
        return savedArticle;
    }

    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }
}
