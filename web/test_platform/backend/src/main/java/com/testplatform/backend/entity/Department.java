package com.testplatform.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Department {
    private Long id;
    private Company company;
    private Long companyId;
    private String name;
    private Long parentId;
    private LocalDateTime createdAt;
}
