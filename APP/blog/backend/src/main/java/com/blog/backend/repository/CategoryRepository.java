package com.blog.backend.repository;

import com.blog.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    java.util.Optional<Category> findByName(String name);
}
