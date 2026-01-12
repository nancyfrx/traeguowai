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

    public Optional<Article> getArticleById(Long id) {
        return articleRepository.findById(id);
    }

    @Transactional
    public void incrementViewCount(Long id) {
        articleRepository.incrementViewCount(id);
    }

    public Article saveArticle(Article article) {
        return articleRepository.save(article);
    }

    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }
}
