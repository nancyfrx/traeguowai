package com.testplatform.backend.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.testplatform.backend.entity.AIGenerationRecord;
import com.testplatform.backend.repository.AIGenerationRecordMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AIGenerationRecordService {
    
    private final AIGenerationRecordMapper mapper;

    public AIGenerationRecordService(AIGenerationRecordMapper mapper) {
        this.mapper = mapper;
    }

    public void save(AIGenerationRecord record) {
        mapper.insert(record);
    }

    public void update(AIGenerationRecord record) {
        mapper.update(record);
    }

    public AIGenerationRecord findById(Long id) {
        return mapper.findById(id);
    }

    public PageInfo<AIGenerationRecord> list(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<AIGenerationRecord> list = mapper.selectAll();
        return new PageInfo<>(list);
    }
}
