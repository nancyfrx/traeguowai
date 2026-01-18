package com.testplatform.backend.repository;

import com.testplatform.backend.entity.TestCase;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.Optional;
import java.util.List;

@Mapper
public interface TestCaseRepository {
    Optional<TestCase> findById(Long id);
    List<TestCase> findAll();
    void save(TestCase testCase);
    void update(TestCase testCase);
    void deleteById(Long id);
    void deleteAllById(@Param("ids") List<Long> ids);
    void updateStatusBatch(@Param("ids") List<Long> ids, @Param("status") String status);
    
    List<TestCase> findByModuleId(Long moduleId);
    List<TestCase> findByModuleIdIn(@Param("moduleIds") List<Long> moduleIds);
    List<TestCase> findByProjectIdAndModuleIdIsNull(Long projectId);
    List<TestCase> findByProjectId(Long projectId);
    void deleteByProjectIdAndModuleIdIsNull(Long projectId);
    void deleteByModuleId(Long moduleId);

    List<TestCase> findWithFilters(
            @Param("projectId") Long projectId,
            @Param("moduleId") Long moduleId,
            @Param("moduleIds") List<Long> moduleIds,
            @Param("onlyNoModule") boolean onlyNoModule,
            @Param("status") String status,
            @Param("priority") String priority,
            @Param("keyword") String keyword);
}
