package com.testplatform.backend.repository;

import com.testplatform.backend.entity.Project;
import org.apache.ibatis.annotations.Mapper;
import java.util.Optional;
import java.util.List;

@Mapper
public interface ProjectRepository {
    Optional<Project> findById(Long id);
    List<Project> findAll();
    void save(Project project);
    void update(Project project);
    void deleteById(Long id);
    
    List<Project> findByDepartmentId(Long departmentId);
}
