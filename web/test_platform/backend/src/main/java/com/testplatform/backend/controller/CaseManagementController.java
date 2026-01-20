package com.testplatform.backend.controller;

import com.testplatform.backend.annotation.Log;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.testplatform.backend.dto.ModuleDTO;
import com.testplatform.backend.dto.ProjectDTO;
import com.testplatform.backend.dto.TestCaseDTO;
import com.testplatform.backend.entity.Project;
import com.testplatform.backend.entity.Module;
import com.testplatform.backend.entity.TestCase;
import com.testplatform.backend.repository.ProjectRepository;
import com.testplatform.backend.repository.ModuleRepository;
import com.testplatform.backend.repository.TestCaseRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.testplatform.backend.service.AsyncImageService;
import org.springframework.beans.factory.annotation.Value;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import java.util.concurrent.TimeUnit;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
@Log("用例管理")
public class CaseManagementController {

    private final ProjectRepository projectRepository;
    private final ModuleRepository moduleRepository;
    private final TestCaseRepository testCaseRepository;
    private final AsyncImageService asyncImageService;
    // Redis 相关的注入可以根据项目需要保留或移除，这里为了兼容编译暂不移除
    // private final StringRedisTemplate redisTemplate;
    // private final ObjectMapper objectMapper;

    @Value("${aliyun.oss.baseUrl}")
    private String ossBaseUrl;

    @Value("${aliyun.oss.prefix}")
    private String ossPrefix;

    // --- Project API ---
    @GetMapping("/projects")
    @Log(value = "项目列表", logOutput = false)
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
                
                // 检查是否有子模块或直属用例
                boolean hasModules = !moduleRepository.findByProjectIdAndParentIdIsNull(p.getId()).isEmpty();
                boolean hasCases = !testCaseRepository.findByProjectIdAndModuleIdIsNull(p.getId()).isEmpty();
                dto.setHasChildren(hasModules || hasCases);
                
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
            project.setDepartmentId(departmentId);
            project.setCreatedAt(LocalDateTime.now());
            project.setUpdatedAt(LocalDateTime.now());
            
            projectRepository.save(project);
            Project saved = project;
            ProjectDTO dto = new ProjectDTO();
            dto.setId(saved.getId());
            dto.setName(saved.getName());
            dto.setDescription(saved.getDescription());
            dto.setDepartmentId(saved.getDepartmentId());
            dto.setCreatedAt(saved.getCreatedAt());
            dto.setUpdatedAt(saved.getUpdatedAt());
            dto.setHasChildren(false); // 新创建的项目默认没有子节点
            
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "创建项目失败", "message", e.getMessage()));
        }
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<?> updateProject(@PathVariable("id") Long id, @RequestBody Map<String, Object> payload, HttpSession session) {
        try {
            if (session.getAttribute("username") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }

            Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("项目不存在"));
            
            if (payload.containsKey("name")) project.setName((String) payload.get("name"));
            if (payload.containsKey("description")) project.setDescription((String) payload.get("description"));
            if (payload.containsKey("department")) {
                Map<String, Object> deptMap = (Map<String, Object>) payload.get("department");
                if (deptMap != null && deptMap.get("id") != null) {
                    project.setDepartmentId(((Number) deptMap.get("id")).longValue());
                }
            }
            
            project.setUpdatedAt(LocalDateTime.now());
            projectRepository.update(project);
            
            ProjectDTO dto = new ProjectDTO();
            dto.setId(project.getId());
            dto.setName(project.getName());
            dto.setDescription(project.getDescription());
            dto.setDepartmentId(project.getDepartmentId());
            dto.setCreatedAt(project.getCreatedAt());
            dto.setUpdatedAt(project.getUpdatedAt());
            
            // 检查是否有子模块或直属用例
            boolean hasModules = !moduleRepository.findByProjectIdAndParentIdIsNull(project.getId()).isEmpty();
            boolean hasCases = !testCaseRepository.findByProjectIdAndModuleIdIsNull(project.getId()).isEmpty();
            dto.setHasChildren(hasModules || hasCases);
            
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "更新项目失败", "message", e.getMessage()));
        }
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable("id") Long id, HttpSession session) {
        if (session.getAttribute("username") == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
        }
        try {
            // 物理删除项目下的所有模块和用例
            List<Module> modules = moduleRepository.findByProjectIdAndParentIdIsNull(id);
            for (Module m : modules) {
                deleteModuleRecursive(m.getId());
            }
            
            // 删除直接挂在项目下的用例
            testCaseRepository.deleteByProjectIdAndModuleIdIsNull(id);
            
            // 最后删除项目
            projectRepository.deleteById(id);
            
            return ResponseEntity.ok(Map.of("message", "项目及其下所有内容物理删除成功"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "物理删除项目失败", "message", e.getMessage()));
        }
    }

    private void deleteModuleRecursive(Long moduleId) {
        // 先删除子模块
        List<Module> subModules = moduleRepository.findByParentId(moduleId);
        for (Module sm : subModules) {
            deleteModuleRecursive(sm.getId());
        }
        
        // 删除该模块下的所有用例
        testCaseRepository.deleteByModuleId(moduleId);
        
        // 最后删除该模块
        moduleRepository.deleteById(moduleId);
    }

    // --- Module API ---
    @GetMapping("/modules")
    @Log(value = "模块列表", logOutput = false)
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
                
                // 检查是否有子模块或所属用例
                boolean hasSubModules = !moduleRepository.findByParentId(m.getId()).isEmpty();
                boolean hasCases = !testCaseRepository.findByModuleId(m.getId()).isEmpty();
                dto.setHasChildren(hasSubModules || hasCases);
                
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
            Long projectId = null;
            if (payload.containsKey("projectId")) {
                projectId = ((Number) payload.get("projectId")).longValue();
            } else if (payload.containsKey("project")) {
                Map<String, Object> projectMap = (Map<String, Object>) payload.get("project");
                projectId = projectMap != null ? ((Number) projectMap.get("id")).longValue() : null;
            }
            Long parentId = payload.get("parentId") != null ? ((Number) payload.get("parentId")).longValue() : null;

            if (name == null || projectId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "模块名称和项目ID不能为空"));
            }

            Module module = new Module();
            module.setName(name);
            module.setProjectId(projectId);
            module.setParentId(parentId);
            module.setCreatedAt(LocalDateTime.now());
            module.setUpdatedAt(LocalDateTime.now());
            
            moduleRepository.save(module);
            Module saved = module;
            ModuleDTO dto = new ModuleDTO();
            dto.setId(saved.getId());
            dto.setName(saved.getName());
            dto.setProjectId(saved.getProjectId());
            dto.setParentId(saved.getParentId());
            dto.setCreatedAt(saved.getCreatedAt());
            dto.setUpdatedAt(saved.getUpdatedAt());
            dto.setHasChildren(false); // 新创建的模块默认没有子节点
            
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "创建模块失败", "message", e.getMessage()));
        }
    }

    @PutMapping("/modules/{id}")
    public ResponseEntity<?> updateModule(@PathVariable("id") Long id, @RequestBody Map<String, Object> payload, HttpSession session) {
        try {
            if (session.getAttribute("username") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }

            Module module = moduleRepository.findById(id).orElseThrow(() -> new RuntimeException("模块不存在"));
            
            if (payload.containsKey("name")) module.setName((String) payload.get("name"));
            if (payload.containsKey("projectId")) {
                module.setProjectId(((Number) payload.get("projectId")).longValue());
            } else if (payload.containsKey("project")) {
                Map<String, Object> projectMap = (Map<String, Object>) payload.get("project");
                if (projectMap != null && projectMap.get("id") != null) {
                    module.setProjectId(((Number) projectMap.get("id")).longValue());
                }
            }
            if (payload.containsKey("parentId")) {
                Object parentIdObj = payload.get("parentId");
                module.setParentId(parentIdObj != null ? ((Number) parentIdObj).longValue() : null);
            }
            
            module.setUpdatedAt(LocalDateTime.now());
            moduleRepository.update(module);
            
            ModuleDTO dto = new ModuleDTO();
            dto.setId(module.getId());
            dto.setName(module.getName());
            dto.setProjectId(module.getProjectId());
            dto.setParentId(module.getParentId());
            dto.setCreatedAt(module.getCreatedAt());
            dto.setUpdatedAt(module.getUpdatedAt());
            
            // 检查是否有子模块或所属用例
            boolean hasSubModules = !moduleRepository.findByParentId(module.getId()).isEmpty();
            boolean hasCases = !testCaseRepository.findByModuleId(module.getId()).isEmpty();
            dto.setHasChildren(hasSubModules || hasCases);
            
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "更新模块失败", "message", e.getMessage()));
        }
    }

    @DeleteMapping("/modules/{id}")
    public ResponseEntity<?> deleteModule(@PathVariable("id") Long id, HttpSession session) {
        if (session.getAttribute("username") == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
        }
        try {
            // 递归物理删除模块及其下所有内容
            deleteModuleRecursive(id);
            return ResponseEntity.ok(Map.of("message", "文件夹及其下所有内容物理删除成功"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "物理删除文件夹失败", "message", e.getMessage()));
        }
    }

    // --- TestCase API ---
    @GetMapping("/list")
    @Log(value = "用例列表", logOutput = false)
    public ResponseEntity<?> getTestCases(
            @RequestParam(name = "moduleId", required = false) Long moduleId,
            @RequestParam(name = "projectId", required = false) Long projectId,
            @RequestParam(name = "recursive", required = false, defaultValue = "false") boolean recursive,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "priority", required = false) String priority,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            HttpSession session) {
        try {
            if (session.getAttribute("username") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }
            
            List<Long> moduleIds = null;
            Long targetProjectId = projectId;
            Long targetModuleId = null;
            boolean onlyNoModule = false;

            if (moduleId != null) {
                targetProjectId = null;
                if (recursive) {
                    moduleIds = new ArrayList<>();
                    findAllSubModuleIds(moduleId, moduleIds);
                    moduleIds.add(moduleId);
                } else {
                    targetModuleId = moduleId;
                }
            } else if (projectId != null) {
                if (recursive) {
                    // 对于项目级别的递归，只要 project_id 匹配即可，不需要显式指定 moduleIds
                    // 这样可以确保获取到该项目下所有的用例，无论是否在模块中，或在哪个模块中
                    moduleIds = null; 
                } else {
                    onlyNoModule = true;
                }
            } else {
                return ResponseEntity.ok(Map.of("content", List.of(), "totalElements", 0));
            }
            
            PageHelper.startPage(page + 1, size);
            List<TestCase> cases = testCaseRepository.findWithFilters(
                targetProjectId, 
                targetModuleId, 
                moduleIds, 
                onlyNoModule,
                status, 
                priority, 
                keyword
            );
            
            PageInfo<TestCase> pageInfo = new PageInfo<>(cases);
            
            List<TestCaseDTO> dtos = cases.stream()
                .map(tc -> convertToDTO(tc, true)) // 列表接口默认不生成 OSS 签名 URL，提升性能
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(Map.of(
                "content", dtos,
                "totalElements", pageInfo.getTotal(),
                "totalPages", pageInfo.getPages(),
                "size", pageInfo.getPageSize(),
                "number", pageInfo.getPageNum() - 1
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "获取用例列表失败", "message", e.getMessage()));
        }
    }

    private void findAllSubModuleIds(Long parentId, List<Long> result) {
        List<Module> subModules = moduleRepository.findByParentId(parentId);
        for (Module m : subModules) {
            result.add(m.getId());
            findAllSubModuleIds(m.getId(), result);
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
            Long moduleId = null;
            if (payload.containsKey("moduleId")) {
                moduleId = parseLong(payload.get("moduleId"));
            } else if (payload.containsKey("module")) {
                Object moduleObj = payload.get("module");
                if (moduleObj instanceof Map) {
                    moduleId = parseLong(((Map<?, ?>) moduleObj).get("id"));
                }
            }
            
            Long projectId = parseLong(payload.get("projectId"));
            String priority = (String) payload.get("priority");
            String type = (String) payload.get("type");
            String status = (String) payload.get("status");
            String preconditions = (String) payload.get("preconditions");
            String steps = (String) payload.get("steps");
            String expectedResult = (String) payload.get("expectedResult");
            String actualResult = (String) payload.get("actualResult");

            if (name == null || (moduleId == null && projectId == null)) {
                return ResponseEntity.badRequest().body(Map.of("error", "用例名称和所属位置（项目或模块）不能为空"));
            }

            TestCase testCase = new TestCase();
            testCase.setName(name);
            
            if (moduleId != null) {
                testCase.setModuleId(moduleId);
                final Long finalModuleId = moduleId;
                Module module = moduleRepository.findById(moduleId).orElseThrow(() -> new RuntimeException("模块不存在: " + finalModuleId));
                testCase.setProjectId(module.getProjectId());
            } else {
                testCase.setProjectId(projectId);
                testCase.setModuleId(null);
            }
            testCase.setPriority(priority != null ? priority : "P1");
            testCase.setType(type != null ? type : "功能用例");
            testCase.setStatus(status != null ? status : "PENDING");
            
            // 始终提取图片并准备上传，内部已优化（如果不含 Base64 会快速返回）
            Map<String, byte[]> imagesToUpload = new HashMap<>();
            Map<String, String> contentTypes = new HashMap<>();
            
            AsyncImageService.ImageProcessResult preResult = asyncImageService.extractImages(preconditions != null ? preconditions : "");
            testCase.setPreconditions(preResult.html);
            imagesToUpload.putAll(preResult.imagesToUpload);
            contentTypes.putAll(preResult.contentTypes);
            
            AsyncImageService.ImageProcessResult stepsResult = asyncImageService.extractImages(steps != null ? steps : "");
            testCase.setSteps(stepsResult.html);
            imagesToUpload.putAll(stepsResult.imagesToUpload);
            contentTypes.putAll(stepsResult.contentTypes);
            
            AsyncImageService.ImageProcessResult expResult = asyncImageService.extractImages(expectedResult != null ? expectedResult : "");
            testCase.setExpectedResult(expResult.html);
            imagesToUpload.putAll(expResult.imagesToUpload);
            contentTypes.putAll(expResult.contentTypes);
            
            AsyncImageService.ImageProcessResult actResult = asyncImageService.extractImages(actualResult != null ? actualResult : "");
            testCase.setActualResult(actResult.html);
            imagesToUpload.putAll(actResult.imagesToUpload);
            contentTypes.putAll(actResult.contentTypes);
            
            testCase.setCreator(username);
            testCase.setUpdater(username);
            testCase.setCreatedAt(LocalDateTime.now());
            testCase.setUpdatedAt(LocalDateTime.now());
            
            try {
                testCaseRepository.save(testCase);
                // 数据库保存成功后，尝试异步上传图片到 OSS
                if (!imagesToUpload.isEmpty()) {
                    try {
                        asyncImageService.uploadImagesAsync(imagesToUpload, contentTypes);
                    } catch (Exception e) {
                        System.err.println("Failed to start async image upload: " + e.getMessage());
                    }
                }
            } catch (Exception e) {
                System.err.println("Database save failed: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.internalServerError().body(Map.of(
                    "error", "数据库保存失败",
                    "message", e.getMessage() != null ? e.getMessage() : e.toString()
                ));
            }
            
            // 保存成功后返回 DTO，skipSignedUrls=true 表示不生成签名URL，避免前端不必要的加载
            TestCaseDTO dto = convertToDTO(testCase, true);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            System.err.println("Create test case failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "创建用例失败",
                "message", e.getMessage() != null ? e.getMessage() : e.toString()
            ));
        }
    }

    private Long parseLong(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Number) return ((Number) obj).longValue();
        String s = String.valueOf(obj);
        if (s.isEmpty() || "null".equalsIgnoreCase(s)) return null;
        try {
            // Handle cases like "110.0"
            if (s.contains(".")) {
                return (long) Double.parseDouble(s);
            }
            return Long.valueOf(s);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    @PutMapping("/test-case/{id}")
    public ResponseEntity<?> updateTestCase(@PathVariable("id") Long id, @RequestBody Map<String, Object> payload, HttpSession session) {
        try {
            String username = (String) session.getAttribute("username");
            if (username == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }

            TestCase testCase = testCaseRepository.findById(id).orElseThrow(() -> new RuntimeException("用例不存在: " + id));
            
            // 安全地获取和设置字段
            if (payload.containsKey("name")) {
                Object nameObj = payload.get("name");
                testCase.setName(nameObj != null ? String.valueOf(nameObj) : "");
            }
            if (payload.containsKey("priority")) {
                Object priorityObj = payload.get("priority");
                testCase.setPriority(priorityObj != null ? String.valueOf(priorityObj) : "P1");
            }
            if (payload.containsKey("status")) {
                Object statusObj = payload.get("status");
                testCase.setStatus(statusObj != null ? String.valueOf(statusObj) : "PENDING");
            }
            if (payload.containsKey("type")) {
                Object typeObj = payload.get("type");
                testCase.setType(typeObj != null ? String.valueOf(typeObj) : "功能用例");
            }
            
            Map<String, byte[]> imagesToUpload = new HashMap<>();
            Map<String, String> contentTypes = new HashMap<>();

            if (payload.containsKey("preconditions")) {
                String val = payload.get("preconditions") != null ? String.valueOf(payload.get("preconditions")) : "";
                AsyncImageService.ImageProcessResult res = asyncImageService.extractImages(val);
                testCase.setPreconditions(res.html);
                imagesToUpload.putAll(res.imagesToUpload);
                contentTypes.putAll(res.contentTypes);
            }
            if (payload.containsKey("steps")) {
                String val = payload.get("steps") != null ? String.valueOf(payload.get("steps")) : "";
                AsyncImageService.ImageProcessResult res = asyncImageService.extractImages(val);
                testCase.setSteps(res.html);
                imagesToUpload.putAll(res.imagesToUpload);
                contentTypes.putAll(res.contentTypes);
            }
            if (payload.containsKey("expectedResult")) {
                String val = payload.get("expectedResult") != null ? String.valueOf(payload.get("expectedResult")) : "";
                AsyncImageService.ImageProcessResult res = asyncImageService.extractImages(val);
                testCase.setExpectedResult(res.html);
                imagesToUpload.putAll(res.imagesToUpload);
                contentTypes.putAll(res.contentTypes);
            }
            if (payload.containsKey("actualResult")) {
                String val = payload.get("actualResult") != null ? String.valueOf(payload.get("actualResult")) : "";
                AsyncImageService.ImageProcessResult res = asyncImageService.extractImages(val);
                testCase.setActualResult(res.html);
                imagesToUpload.putAll(res.imagesToUpload);
                contentTypes.putAll(res.contentTypes);
            }
            
            // 更新模块ID
            if (payload.containsKey("moduleId")) {
                testCase.setModuleId(parseLong(payload.get("moduleId")));
            } else if (payload.containsKey("module")) {
                Object moduleObj = payload.get("module");
                if (moduleObj instanceof Map) {
                    Map<String, Object> moduleMap = (Map<String, Object>) moduleObj;
                    if (moduleMap.containsKey("id")) {
                        testCase.setModuleId(parseLong(moduleMap.get("id")));
                    }
                } else if (moduleObj == null) {
                    testCase.setModuleId(null);
                }
            }
            
            // 优先从 payload 中获取 projectId，如果提供了就以它为准
            if (payload.containsKey("projectId")) {
                Long pId = parseLong(payload.get("projectId"));
                if (pId != null) {
                    testCase.setProjectId(pId);
                }
            } else if (testCase.getModuleId() != null) {
                // 如果没有提供 projectId，但有 moduleId，则同步 moduleId 对应的 projectId
                final Long finalModuleId = testCase.getModuleId();
                try {
                    Module module = moduleRepository.findById(finalModuleId).orElse(null);
                    if (module != null) {
                        testCase.setProjectId(module.getProjectId());
                    }
                } catch (Exception e) {
                    System.err.println("Failed to fetch module " + finalModuleId + ": " + e.getMessage());
                }
            }
            
            testCase.setUpdater(username);
            testCase.setUpdatedAt(LocalDateTime.now());
            
            try {
                testCaseRepository.update(testCase);
                // 数据库更新成功后，尝试异步上传新图片
                if (!imagesToUpload.isEmpty()) {
                    try {
                        asyncImageService.uploadImagesAsync(imagesToUpload, contentTypes);
                    } catch (Exception e) {
                        System.err.println("Failed to start async image upload: " + e.getMessage());
                    }
                }
            } catch (Exception e) {
                System.err.println("Database update failed for test case " + id + ": " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.internalServerError().body(Map.of(
                    "error", "数据库更新失败",
                    "message", e.getMessage() != null ? e.getMessage() : e.toString()
                ));
            }
            
            // 保存/更新成功后返回 DTO，skipSignedUrls=true 表示不生成签名URL，避免前端不必要的加载
            TestCaseDTO dto = convertToDTO(testCase, true);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            System.err.println("Update test case failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "更新用例失败",
                "message", e.getMessage() != null ? e.getMessage() : e.toString()
            ));
        }
    }

    @GetMapping("/test-case/{id}")
    public ResponseEntity<?> getTestCaseById(@PathVariable("id") Long id, HttpSession session) {
        try {
            if (session.getAttribute("username") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }

            TestCase testCase = testCaseRepository.findById(id).orElseThrow(() -> new RuntimeException("用例不存在: " + id));
            TestCaseDTO dto = convertToDTO(testCase);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "获取用例详情失败", "message", e.getMessage()));
        }
    }

    private TestCaseDTO convertToDTO(TestCase tc) {
        return convertToDTO(tc, false);
    }

    private TestCaseDTO convertToDTO(TestCase tc, boolean skipSignedUrls) {
        TestCaseDTO dto = new TestCaseDTO();
        dto.setId(tc.getId());
        dto.setName(tc.getName());
        dto.setProjectId(tc.getProjectId());
        dto.setModuleId(tc.getModuleId());
        
        // 返回前端时自动加上 OSS 签名 URL，保证本地能访问
        // 如果 skipSignedUrls 为 true，则跳过此步骤（对应用户需求：没有新增图片就不调查看图片的接口）
        if (skipSignedUrls) {
            dto.setPreconditions(tc.getPreconditions());
            dto.setSteps(tc.getSteps());
            dto.setExpectedResult(tc.getExpectedResult());
            dto.setActualResult(tc.getActualResult());
        } else {
            if (tc.getPreconditions() != null) {
                dto.setPreconditions(asyncImageService.addSignedOssPrefix(tc.getPreconditions()));
            }
            if (tc.getSteps() != null) {
                dto.setSteps(asyncImageService.addSignedOssPrefix(tc.getSteps()));
            }
            if (tc.getExpectedResult() != null) {
                dto.setExpectedResult(asyncImageService.addSignedOssPrefix(tc.getExpectedResult()));
            }
            if (tc.getActualResult() != null) {
                dto.setActualResult(asyncImageService.addSignedOssPrefix(tc.getActualResult()));
            }
        }
        
        dto.setStatus(tc.getStatus());
        dto.setPriority(tc.getPriority());
        dto.setType(tc.getType());
        dto.setCreator(tc.getCreator());
        dto.setUpdater(tc.getUpdater());
        dto.setCreatedAt(tc.getCreatedAt());
        dto.setUpdatedAt(tc.getUpdatedAt());
        return dto;
    }

    @DeleteMapping("/test-case/{id}")
    public ResponseEntity<?> deleteTestCase(@PathVariable("id") Long id, HttpSession session) {
        if (session.getAttribute("username") == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
        }
        testCaseRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "删除成功"));
    }

    @PostMapping("/test-case/batch-delete")
    public ResponseEntity<?> batchDeleteTestCases(@RequestBody List<Long> ids, HttpSession session) {
        try {
            if (session.getAttribute("username") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "ID列表不能为空"));
            }
            for (Long id : ids) {
                testCaseRepository.deleteById(id);
            }
            return ResponseEntity.ok(Map.of("message", "批量删除成功"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "批量删除失败", "message", e.getMessage()));
        }
    }

    @PutMapping("/batch-move")
    public ResponseEntity<?> batchMoveTestCases(@RequestBody Map<String, Object> payload, HttpSession session) {
        System.out.println("Batch move test cases with payload: " + payload);
        try {
            if (session.getAttribute("username") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }
            
            List<?> idsRaw = (List<?>) payload.get("ids");
            Long targetProjectId = parseLong(payload.get("targetProjectId"));
            Long targetModuleId = parseLong(payload.get("targetModuleId"));
            
            if (idsRaw == null || idsRaw.isEmpty() || targetProjectId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "参数缺失"));
            }
            
            List<Long> ids = idsRaw.stream()
                    .map(this::parseLong)
                    .filter(id -> id != null)
                    .collect(Collectors.toList());

            System.out.println("Moving ids: " + ids + " to project: " + targetProjectId + ", module: " + targetModuleId);
            
            for (Long id : ids) {
                TestCase tc = testCaseRepository.findById(id).orElse(null);
                if (tc != null) {
                    tc.setProjectId(targetProjectId);
                    tc.setModuleId(targetModuleId);
                    tc.setUpdatedAt(LocalDateTime.now());
                    testCaseRepository.update(tc);
                } else {
                    System.out.println("Test case not found for id: " + id);
                }
            }
            return ResponseEntity.ok(Map.of("message", "批量移动成功"));
        } catch (Exception e) {
            System.err.println("Batch move failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "批量移动失败", "message", e.getMessage()));
        }
    }

    @PostMapping("/test-case/{id}/copy")
    public ResponseEntity<?> copyTestCase(@PathVariable("id") Long id, HttpSession session) {
        System.out.println("Copying test case: " + id);
        try {
            String username = (String) session.getAttribute("username");
            if (username == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }
            
            TestCase original = testCaseRepository.findById(id).orElseThrow(() -> new RuntimeException("用例不存在: " + id));
            System.out.println("Original case found: " + original.getName());
            
            TestCase copy = new TestCase();
            copy.setName(original.getName() + " - 副本");
            copy.setProjectId(original.getProjectId());
            copy.setModuleId(original.getModuleId());
            copy.setPreconditions(original.getPreconditions());
            copy.setSteps(original.getSteps());
            copy.setExpectedResult(original.getExpectedResult());
            copy.setActualResult(original.getActualResult());
            copy.setPriority(original.getPriority());
            copy.setStatus("PENDING");
            copy.setCreator(username);
            copy.setUpdater(username);
            copy.setCreatedAt(LocalDateTime.now());
            copy.setUpdatedAt(LocalDateTime.now());
            
            System.out.println("Saving copy of test case...");
            testCaseRepository.save(copy);
            System.out.println("Copy saved with id: " + copy.getId());
            
            // 复制成功后返回 DTO，不带签名 URL
            return ResponseEntity.ok(convertToDTO(copy, true));
        } catch (Exception e) {
            System.err.println("Copy case failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "复制用例失败", "message", e.getMessage()));
        }
    }

    @PostMapping("/test-case/batch-update-status")
    public ResponseEntity<?> batchUpdateStatus(@RequestBody Map<String, Object> payload, HttpSession session) {
        try {
            if (session.getAttribute("username") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录或登录已过期"));
            }
            Object idsObj = payload.get("ids");
            List<Long> ids;
            if (idsObj instanceof List) {
                ids = ((List<?>) idsObj).stream()
                        .map(id -> id instanceof Number ? ((Number) id).longValue() : Long.valueOf(id.toString()))
                        .collect(Collectors.toList());
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "ids必须是列表"));
            }
            String status = (String) payload.get("status");
            
            if (ids == null || ids.isEmpty() || status == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "参数缺失"));
            }
            
            testCaseRepository.updateStatusBatch(ids, status);
            return ResponseEntity.ok(Map.of("message", "批量修改状态成功"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "批量修改状态失败", "message", e.getMessage()));
        }
    }
}
