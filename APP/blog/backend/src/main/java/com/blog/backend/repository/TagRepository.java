package com.blog.backend.repository;

import com.blog.backend.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, Long> {
    java.util.Optional<Tag> findByName(String name);
}
