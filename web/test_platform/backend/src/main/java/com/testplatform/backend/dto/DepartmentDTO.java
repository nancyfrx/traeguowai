package com.testplatform.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DepartmentDTO {
    private Long id;
    private String name;
    private Long parentId;
    private LocalDateTime createdAt;
    private Long companyId;
}
