package com.testplatform.backend.repository;

import com.testplatform.backend.entity.Company;
import org.apache.ibatis.annotations.Mapper;
import java.util.Optional;
import java.util.List;

@Mapper
public interface CompanyRepository {
    Optional<Company> findById(Long id);
    List<Company> findAll();
    void save(Company company);
    void update(Company company);
    void deleteById(Long id);
    
    Optional<Company> findByName(String name);
}
