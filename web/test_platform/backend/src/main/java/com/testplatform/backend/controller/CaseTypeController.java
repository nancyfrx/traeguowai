package com.testplatform.backend.controller;

import com.testplatform.backend.entity.CaseType;
import com.testplatform.backend.repository.CaseTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/case-types")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CaseTypeController {

    private final CaseTypeRepository caseTypeRepository;

    @GetMapping
    public List<CaseType> getAll() {
        return caseTypeRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "类型名称不能为空"));
        }
        
        CaseType existing = caseTypeRepository.findByName(name);
        if (existing != null) {
            return ResponseEntity.badRequest().body(Map.of("error", "类型已存在"));
        }

        CaseType caseType = new CaseType();
        caseType.setName(name);
        caseTypeRepository.save(caseType);
        
        return ResponseEntity.ok(caseType);
    }
}
