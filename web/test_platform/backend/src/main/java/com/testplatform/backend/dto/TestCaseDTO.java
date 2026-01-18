package com.testplatform.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TestCaseDTO {
    private Long id;
    private String name;
    private Long projectId;
    private Long moduleId;
    private String preconditions;
    private String steps;
    private String expectedResult;
    private String actualResult;
    private String status;
    private String priority;
    private String creator;
    private String updater;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
