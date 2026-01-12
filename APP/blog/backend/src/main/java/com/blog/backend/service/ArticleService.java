package com.blog.backend.service;

import com.blog.backend.entity.Article;
import com.blog.backend.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    public Page<Article> getAllPublishedArticles(Pageable pageable) {
        return articleRepository.findByIsDraftFalse(pageable);
    }

    public Page<Article> getFeaturedArticles(Pageable pageable) {
        return articleRepository.findByIsFeaturedTrueAndIsDraftFalse(pageable);
    }

    public Page<Article> getAllArticles(Pageable pageable) {
        return articleRepository.findAll(pageable);
    }

    public Optional<Article> getArticleById(Long id) {
        return articleRepository.findById(id);
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
        return articleRepository.save(article);
    }

    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }
}
