package com.blog.backend.repository;

import com.blog.backend.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    Page<Article> findByIsDraftFalse(Pageable pageable);
    
    Page<Article> findByIsFeaturedTrueAndIsDraftFalse(Pageable pageable);
    
    @Modifying
    @Query("UPDATE Article a SET a.viewCount = COALESCE(a.viewCount, 0) + 1 WHERE a.id = :id")
    void incrementViewCount(Long id);

    @Modifying
    @Query("UPDATE Article a SET a.likeCount = COALESCE(a.likeCount, 0) + 1 WHERE a.id = :id")
    void incrementLikeCount(Long id);

    @Modifying
    @Query("UPDATE Article a SET a.likeCount = CASE WHEN a.likeCount > 0 THEN a.likeCount - 1 ELSE 0 END WHERE a.id = :id")
    void decrementLikeCount(Long id);

    @Modifying
    @Query("UPDATE Article a SET a.isFeatured = false")
    void clearFeatured();

    @Query(value = "SELECT * FROM articles WHERE is_draft = false ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<Article> findRandomArticle();
}
