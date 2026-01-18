package com.testplatform.backend.repository;

import com.testplatform.backend.entity.Module;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.Optional;
import java.util.List;

@Mapper
public interface ModuleRepository {
    Optional<Module> findById(Long id);
    List<Module> findAll();
    void save(Module module);
    void update(Module module);
    void deleteById(Long id);
    
    List<Module> findByProjectId(Long projectId);
    List<Module> findByProjectIdAndParentId(@Param("projectId") Long projectId, @Param("parentId") Long parentId);
    List<Module> findByProjectIdAndParentIdIsNull(Long projectId);
    List<Module> findByParentId(Long parentId);
}
