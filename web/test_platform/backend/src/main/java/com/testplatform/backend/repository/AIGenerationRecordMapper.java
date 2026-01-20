package com.testplatform.backend.repository;

import com.testplatform.backend.entity.AIGenerationRecord;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface AIGenerationRecordMapper {
    int insert(AIGenerationRecord record);
    List<AIGenerationRecord> selectAll();
}
