package com.testplatform.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Company {
    private Long id;
    private String name;
    private String address;
    private String website;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
