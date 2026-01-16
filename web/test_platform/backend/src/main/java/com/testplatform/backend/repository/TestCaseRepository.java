package com.testplatform.backend.repository;

import com.testplatform.backend.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByModuleId(Long moduleId);
}
