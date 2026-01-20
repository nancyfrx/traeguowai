package com.testplatform.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TestCase {
    private Long id;
    private String name;
    private Project project;
    private Long projectId;
    private Module module;
    private Long moduleId;
    private String preconditions;
    private String steps;
    private String expectedResult;
    private String actualResult;
    private String status; // PENDING, SUCCESS, FAILED
    private String priority; // P0, P1, P2, P3
    private String creator;
    private String updater;
    private String type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
