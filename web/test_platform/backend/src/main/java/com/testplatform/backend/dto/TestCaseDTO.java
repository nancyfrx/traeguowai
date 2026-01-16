package com.testplatform.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TestCaseDTO {
    private Long id;
    private String name;
    private Long moduleId;
    private String preconditions;
    private String expectedResult;
    private String actualResult;
    private String status;
    private String priority;
    private String creator;
    private String updater;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
