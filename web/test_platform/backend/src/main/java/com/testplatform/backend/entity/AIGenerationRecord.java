package com.testplatform.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AIGenerationRecord {
    private Long id;
    private String inputContent;
    private String generatedContent;
    private String uploadFileName;
    private String model;
    private String operator;
    private LocalDateTime createdAt;
}
