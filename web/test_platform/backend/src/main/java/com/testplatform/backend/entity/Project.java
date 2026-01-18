package com.testplatform.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Project {
    private Long id;
    private String name;
    private Department department;
    private Long departmentId;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
