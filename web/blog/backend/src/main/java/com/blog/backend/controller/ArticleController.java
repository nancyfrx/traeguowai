package com.blog.backend.controller;

import com.blog.backend.entity.Article;
import com.blog.backend.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "*")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public ResponseEntity<Page<Article>> getAllArticles(
            @RequestParam(required = false, defaultValue = "true") boolean publishedOnly,
            @RequestParam(required = false, defaultValue = "false") boolean featuredOnly,
            Pageable pageable) {
        if (featuredOnly) {
            return ResponseEntity.ok(articleService.getFeaturedArticles(pageable));
        }
        if (publishedOnly) {
            return ResponseEntity.ok(articleService.getAllPublishedArticles(pageable));
        } else {
            return ResponseEntity.ok(articleService.getAllArticles(pageable));
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likeArticle(@PathVariable Long id) {
        articleService.incrementLikeCount(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/unlike")
    public ResponseEntity<Void> unlikeArticle(@PathVariable Long id) {
        articleService.decrementLikeCount(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Void> viewArticle(@PathVariable Long id) {
        articleService.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticle(@PathVariable Long id) {
        return articleService.getArticleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody Article article) {
        return ResponseEntity.ok(articleService.saveArticle(article));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long id, @RequestBody Article article) {
        article.setId(id);
        return ResponseEntity.ok(articleService.saveArticle(article));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}
