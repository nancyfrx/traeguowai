package com.testplatform.backend.repository;

import com.testplatform.backend.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    List<Module> findByProjectId(Long projectId);
    List<Module> findByProjectIdAndParentId(Long projectId, Long parentId);
    List<Module> findByProjectIdAndParentIdIsNull(Long projectId);
    List<Module> findByParentId(Long parentId);
}
