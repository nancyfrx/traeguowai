package com.testplatform.backend.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String username;
    private String email;
    private String phone;
    private String companyName;
}
