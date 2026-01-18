package com.testplatform.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class User {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private String password;
    private Company company;
    private Long companyId; // Added for MyBatis foreign key mapping
    private LocalDateTime createdAt;
    
    // Login failure tracking
    private int failedAttempts = 0;
    private LocalDateTime lockTime;
}
