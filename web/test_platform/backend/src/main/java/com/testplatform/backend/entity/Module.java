package com.testplatform.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Module {
    private Long id;
    private String name;
    private Project project;
    private Long projectId;
    private Long parentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
