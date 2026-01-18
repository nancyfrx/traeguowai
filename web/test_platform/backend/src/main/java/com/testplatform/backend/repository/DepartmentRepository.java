package com.testplatform.backend.repository;

import com.testplatform.backend.entity.Department;
import org.apache.ibatis.annotations.Mapper;
import java.util.Optional;
import java.util.List;

@Mapper
public interface DepartmentRepository {
    Optional<Department> findById(Long id);
    List<Department> findAll();
    void save(Department department);
    void update(Department department);
    void deleteById(Long id);
    
    List<Department> findByCompanyId(Long companyId);
}
