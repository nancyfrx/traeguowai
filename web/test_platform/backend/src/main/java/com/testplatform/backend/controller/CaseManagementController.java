package com.testplatform.backend.controller;

import com.testplatform.backend.dto.ModuleDTO;
import com.testplatform.backend.dto.ProjectDTO;
import com.testplatform.backend.dto.TestCaseDTO;
import com.testplatform.backend.entity.Project;
import com.testplatform.backend.entity.Module;
import com.testplatform.backend.entity.TestCase;
import com.testplatform.backend.repository.ProjectRepository;
import com.testplatform.backend.repository.ModuleRepository;
import com.testplatform.backend.repository.TestCaseRepository;
import com.testplatform.backend.repository.DepartmentRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseManagementController {

    private final ProjectRepository projectRepository;
    private final ModuleRepository moduleRepository;
    private final TestCaseRepository testCaseRepository;
    private final DepartmentRepository departmentRepository;

    // --- Project API ---
    @GetMapping("/projects")
    public ResponseEntity<?> getProjects(@RequestParam Long departmentId, HttpSession session) {
        try {
            if (session.getAttribute("username") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }
            List<Project> projects = projectRepository.findByDepartmentId(departmentId);
            List<ProjectDTO> dtos = projects.stream().map(p -> {
                ProjectDTO dto = new ProjectDTO();
                dto.setId(p.getId());
                dto.setName(p.getName());
                dto.setDescription(p.getDescription());
                dto.setDepartmentId(p.getDepartment().getId());
                dto.setCreatedAt(p.getCreatedAt());
                dto.setUpdatedAt(p.getUpdatedAt());
                return dto;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "获取项目列表失败", "message", e.getMessage()));
        }
    }

    @PostMapping("/projects")
    public ResponseEntity<?> createProject(@RequestBody Map<String, Object> payload, HttpSession session) {
        try {
            if (session.getAttribute("username") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }
            
            String name = (String) payload.get("name");
            String description = (String) payload.get("description");
            Map<String, Object> deptMap = (Map<String, Object>) payload.get("department");
            Long departmentId = deptMap != null ? ((Number) deptMap.get("id")).longValue() : null;

            if (name == null || departmentId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "项目名称和部门ID不能为空"));
            }

            Project project = new Project();
            project.setName(name);
            project.setDescription(description);
            project.setDepartment(departmentRepository.findById(departmentId).orElseThrow(() -> new RuntimeException("部门不存在")));
            
            Project saved = projectRepository.save(project);
            ProjectDTO dto = new ProjectDTO();
            dto.setId(saved.getId());
            dto.setName(saved.getName());
            dto.setDescription(saved.getDescription());
            dto.setDepartmentId(saved.getDepartment().getId());
            dto.setCreatedAt(saved.getCreatedAt());
            dto.setUpdatedAt(saved.getUpdatedAt());
            
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "创建项目失败", "message", e.getMessage()));
        }
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("username") == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
        }
        projectRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "删除成功"));
    }

    // --- Module API ---
    @GetMapping("/modules")
    public ResponseEntity<?> getModules(
            @RequestParam Long projectId,
            @RequestParam(required = false) Long parentId,
            HttpSession session) {
        try {
            if (session.getAttribute("username") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }
            List<Module> modules;
            if (parentId != null) {
                modules = moduleRepository.findByParentId(parentId);
            } else {
                modules = moduleRepository.findByProjectIdAndParentIdIsNull(projectId);
            }
            
            List<ModuleDTO> dtos = modules.stream().map(m -> {
                ModuleDTO dto = new ModuleDTO();
                dto.setId(m.getId());
                dto.setName(m.getName());
                dto.setProjectId(m.getProject().getId());
                dto.setParentId(m.getParentId());
                dto.setCreatedAt(m.getCreatedAt());
                dto.setUpdatedAt(m.getUpdatedAt());
                return dto;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "获取模块列表失败", "message", e.getMessage()));
        }
    }

    @PostMapping("/modules")
    public ResponseEntity<?> createModule(@RequestBody Map<String, Object> payload, HttpSession session) {
        try {
            if (session.getAttribute("username") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }
            
            String name = (String) payload.get("name");
            Map<String, Object> projectMap = (Map<String, Object>) payload.get("project");
            Long projectId = projectMap != null ? ((Number) projectMap.get("id")).longValue() : null;
            Long parentId = payload.get("parentId") != null ? ((Number) payload.get("parentId")).longValue() : null;

            if (name == null || projectId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "模块名称和项目ID不能为空"));
            }

            Module module = new Module();
            module.setName(name);
            module.setProject(projectRepository.findById(projectId).orElseThrow(() -> new RuntimeException("项目不存在")));
            module.setParentId(parentId);
            
            Module saved = moduleRepository.save(module);
            ModuleDTO dto = new ModuleDTO();
            dto.setId(saved.getId());
            dto.setName(saved.getName());
            dto.setProjectId(saved.getProject().getId());
            dto.setParentId(saved.getParentId());
            dto.setCreatedAt(saved.getCreatedAt());
            dto.setUpdatedAt(saved.getUpdatedAt());
            
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "创建模块失败", "message", e.getMessage()));
        }
    }

    @DeleteMapping("/modules/{id}")
    public ResponseEntity<?> deleteModule(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("username") == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
        }
        moduleRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "删除成功"));
    }

    // --- TestCase API ---
    @GetMapping("/list")
    public ResponseEntity<?> getTestCases(@RequestParam Long moduleId, HttpSession session) {
        try {
            if (session.getAttribute("username") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }
            List<TestCase> cases = testCaseRepository.findByModuleId(moduleId);
            List<TestCaseDTO> dtos = cases.stream().map(tc -> {
                TestCaseDTO dto = new TestCaseDTO();
                dto.setId(tc.getId());
                dto.setName(tc.getName());
                dto.setModuleId(tc.getModule().getId());
                dto.setPreconditions(tc.getPreconditions());
                dto.setExpectedResult(tc.getExpectedResult());
                dto.setActualResult(tc.getActualResult());
                dto.setStatus(tc.getStatus());
                dto.setPriority(tc.getPriority());
                dto.setCreator(tc.getCreator());
                dto.setUpdater(tc.getUpdater());
                dto.setCreatedAt(tc.getCreatedAt());
                dto.setUpdatedAt(tc.getUpdatedAt());
                return dto;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "获取用例列表失败", "message", e.getMessage()));
        }
    }

    @PostMapping("/test-case")
    public ResponseEntity<?> createTestCase(@RequestBody Map<String, Object> payload, HttpSession session) {
        try {
            String username = (String) session.getAttribute("username");
            if (username == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }
            
            String name = (String) payload.get("name");
            Map<String, Object> moduleMap = (Map<String, Object>) payload.get("module");
            Long moduleId = moduleMap != null ? ((Number) moduleMap.get("id")).longValue() : null;
            String priority = (String) payload.get("priority");
            String preconditions = (String) payload.get("preconditions");
            String expectedResult = (String) payload.get("expectedResult");
            String actualResult = (String) payload.get("actualResult");

            if (name == null || moduleId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "用例名称和模块ID不能为空"));
            }

            TestCase testCase = new TestCase();
            testCase.setName(name);
            testCase.setModule(moduleRepository.findById(moduleId).orElseThrow(() -> new RuntimeException("模块不存在")));
            testCase.setPriority(priority != null ? priority : "P1");
            testCase.setStatus("PENDING");
            testCase.setPreconditions(preconditions);
            testCase.setExpectedResult(expectedResult);
            testCase.setActualResult(actualResult);
            testCase.setCreator(username);
            testCase.setUpdater(username);
            
            TestCase saved = testCaseRepository.save(testCase);
            return ResponseEntity.ok(convertToDTO(saved));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "创建用例失败", "message", e.getMessage()));
        }
    }

    @PutMapping("/test-case/{id}")
    public ResponseEntity<?> updateTestCase(@PathVariable Long id, @RequestBody Map<String, Object> payload, HttpSession session) {
        try {
            String username = (String) session.getAttribute("username");
            if (username == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }

            TestCase testCase = testCaseRepository.findById(id).orElseThrow(() -> new RuntimeException("用例不存在"));
            
            if (payload.containsKey("name")) testCase.setName((String) payload.get("name"));
            if (payload.containsKey("priority")) testCase.setPriority((String) payload.get("priority"));
            if (payload.containsKey("status")) testCase.setStatus((String) payload.get("status"));
            if (payload.containsKey("preconditions")) testCase.setPreconditions((String) payload.get("preconditions"));
            if (payload.containsKey("expectedResult")) testCase.setExpectedResult((String) payload.get("expectedResult"));
            if (payload.containsKey("actualResult")) testCase.setActualResult((String) payload.get("actualResult"));
            
            testCase.setUpdater(username);
            
            TestCase saved = testCaseRepository.save(testCase);
            return ResponseEntity.ok(convertToDTO(saved));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "更新用例失败", "message", e.getMessage()));
        }
    }

    private TestCaseDTO convertToDTO(TestCase tc) {
        TestCaseDTO dto = new TestCaseDTO();
        dto.setId(tc.getId());
        dto.setName(tc.getName());
        dto.setModuleId(tc.getModule().getId());
        dto.setPreconditions(tc.getPreconditions());
        dto.setExpectedResult(tc.getExpectedResult());
        dto.setActualResult(tc.getActualResult());
        dto.setStatus(tc.getStatus());
        dto.setPriority(tc.getPriority());
        dto.setCreator(tc.getCreator());
        dto.setUpdater(tc.getUpdater());
        dto.setCreatedAt(tc.getCreatedAt());
        dto.setUpdatedAt(tc.getUpdatedAt());
        return dto;
    }

    @DeleteMapping("/test-case/{id}")
    public ResponseEntity<?> deleteTestCase(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("username") == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
        }
        testCaseRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "删除成功"));
    }

    @PostMapping("/test-case/batch-delete")
    public ResponseEntity<?> batchDeleteTestCases(@RequestBody List<Long> ids, HttpSession session) {
        if (session.getAttribute("username") == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
        }
        testCaseRepository.deleteAllById(ids);
        return ResponseEntity.ok(Map.of("message", "批量删除成功"));
    }
}
