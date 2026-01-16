package com.testplatform.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ModuleDTO {
    private Long id;
    private String name;
    private Long projectId;
    private Long parentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
