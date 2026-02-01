package com.testplatform.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class Module {
    private Long id;
    private String name;
    private Long projectId;
    private Long parentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // For tree structure
    private List<Module> children;
}
