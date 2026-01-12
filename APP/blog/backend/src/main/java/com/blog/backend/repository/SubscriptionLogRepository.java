package com.blog.backend.repository;

import com.blog.backend.entity.SubscriptionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionLogRepository extends JpaRepository<SubscriptionLog, Long> {
}
