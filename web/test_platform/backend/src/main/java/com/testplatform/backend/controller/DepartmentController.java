package com.testplatform.backend.controller;

import com.testplatform.backend.entity.Department;
import com.testplatform.backend.repository.DepartmentRepository;
import com.testplatform.backend.entity.User;
import com.testplatform.backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Collections;
import java.util.Optional;

import com.testplatform.backend.dto.DepartmentDTO;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getDepartments(HttpSession session) {
        try {
            String username = (String) session.getAttribute("username");
            if (username == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }
            
            return userRepository.findByUsername(username)
                    .map(user -> {
                        if (user.getCompanyId() != null) {
                            List<Department> depts = departmentRepository.findByCompanyId(user.getCompanyId());
                            List<DepartmentDTO> dtos = depts.stream().map(d -> {
                                DepartmentDTO dto = new DepartmentDTO();
                                dto.setId(d.getId());
                                dto.setName(d.getName());
                                dto.setParentId(d.getParentId());
                                dto.setCreatedAt(d.getCreatedAt());
                                dto.setCompanyId(d.getCompanyId());
                                return dto;
                            }).collect(Collectors.toList());
                            return ResponseEntity.ok(dtos);
                        }
                        return ResponseEntity.ok(Collections.emptyList());
                    })
                    .orElse(ResponseEntity.ok(Collections.emptyList()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "获取部门列表失败",
                "message", e.getMessage() != null ? e.getMessage() : e.toString()
            ));
        }
    }

    @PostMapping
    public ResponseEntity<?> createDepartment(@RequestBody Map<String, String> payload, HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
        }

        String name = payload.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "部门名称不能为空"));
        }

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null || user.getCompanyId() == null) {
            return ResponseEntity.status(403).body(Map.of("error", "无权操作"));
        }

        Department department = new Department();
        department.setName(name);
        department.setCompanyId(user.getCompanyId());
        department.setCreatedAt(LocalDateTime.now());
        departmentRepository.save(department);
        return ResponseEntity.ok(department);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long id, @RequestBody Map<String, String> payload, HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
        }

        String name = payload.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "部门名称不能为空"));
        }

        Department department = departmentRepository.findById(id).orElse(null);
        if (department == null) {
            return ResponseEntity.status(404).body(Map.of("error", "部门不存在"));
        }

        // 校验是否属于同一公司
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null || user.getCompanyId() == null || !department.getCompanyId().equals(user.getCompanyId())) {
            return ResponseEntity.status(403).body(Map.of("error", "无权操作"));
        }

        department.setName(name);
        departmentRepository.update(department);
        return ResponseEntity.ok(department);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id, HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
        }

        Department department = departmentRepository.findById(id).orElse(null);
        if (department == null) {
            return ResponseEntity.status(404).body(Map.of("error", "部门不存在"));
        }

        // 校验是否属于同一公司
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null || user.getCompanyId() == null || !department.getCompanyId().equals(user.getCompanyId())) {
            return ResponseEntity.status(403).body(Map.of("error", "无权操作"));
        }

        departmentRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "删除成功"));
    }
}
