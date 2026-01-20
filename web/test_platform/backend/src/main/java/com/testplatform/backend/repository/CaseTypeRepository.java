package com.testplatform.backend.repository;

import com.testplatform.backend.entity.CaseType;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import java.util.List;

@Mapper
public interface CaseTypeRepository {
    @Select("SELECT * FROM case_types ORDER BY id")
    List<CaseType> findAll();

    @Select("SELECT * FROM case_types WHERE name = #{name}")
    CaseType findByName(String name);

    @Insert("INSERT INTO case_types(name) VALUES(#{name})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void save(CaseType caseType);
    
    @Select("SELECT COUNT(*) FROM case_types")
    int count();
}
