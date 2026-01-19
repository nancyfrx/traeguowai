package com.testplatform.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.testplatform.backend.entity.Module;
import com.testplatform.backend.entity.Project;
import com.testplatform.backend.entity.TestCase;
import com.testplatform.backend.entity.Department;
import com.testplatform.backend.repository.ModuleRepository;
import com.testplatform.backend.repository.ProjectRepository;
import com.testplatform.backend.repository.TestCaseRepository;
import com.testplatform.backend.repository.DepartmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

@Service
@Slf4j
public class XMindImportService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private TestCaseRepository testCaseRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public Long importXMind(MultipartFile file, String username, Long departmentId, Long projectId) throws IOException {
        try (InputStream is = file.getInputStream();
             ZipInputStream zis = new ZipInputStream(is)) {

            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                if ("content.json".equals(entry.getName())) {
                    // Read content.json
                    JsonNode rootNode = objectMapper.readTree(zis);
                    if (rootNode.isArray() && rootNode.size() > 0) {
                        JsonNode sheet = rootNode.get(0);
                        JsonNode rootTopic = sheet.get("rootTopic");
                        return parseRootTopic(rootTopic, username, departmentId, projectId);
                    }
                    break;
                }
            }
        }
        return null;
    }

    private Long parseRootTopic(JsonNode rootTopic, String username, Long departmentId, Long projectId) {
        Project project = null;
        if (projectId != null) {
            project = projectRepository.findById(projectId).orElse(null);
        }

        if (project == null) {
            String baseTitle = rootTopic.path("title").asText("New Project");
            String projectTitle = baseTitle;
            
            // Handle duplicate project names
            while (true) {
                String currentTitle = projectTitle;
                boolean exists = projectRepository.findAll().stream()
                        .anyMatch(p -> p.getName().equals(currentTitle));
                if (!exists) {
                    break;
                }
                projectTitle = projectTitle + "_副本";
            }
            
            project = new Project();
            project.setName(projectTitle);
            project.setDescription("Imported from XMind");
            
            // Use provided departmentId or default
            Long finalDeptId = departmentId;
            if (finalDeptId == null) {
                finalDeptId = 1L;
                List<Department> departments = departmentRepository.findAll();
                if (!departments.isEmpty()) {
                    finalDeptId = departments.get(0).getId();
                }
            }
            project.setDepartmentId(finalDeptId);
            
            project.setCreatedAt(LocalDateTime.now());
            project.setUpdatedAt(LocalDateTime.now());
            projectRepository.save(project);
        }

        JsonNode children = rootTopic.path("children").path("attached");
        if (children.isArray()) {
            for (JsonNode child : children) {
                parseNode(child, project, null, username);
            }
        }
        
        return project.getId();
    }

    private void parseNode(JsonNode node, Project project, Module parentModule, String username) {
        String title = node.path("title").asText("");
        
        if (title.startsWith("TC:")) {
            // It's a Test Case
            parseTestCase(node, project, parentModule, username);
        } else {
            // It's a Module (Folder)
            Module module = new Module();
            module.setName(title);
            module.setProjectId(project.getId());
            module.setProject(project);
            if (parentModule != null) {
                module.setParentId(parentModule.getId());
            }
            module.setCreatedAt(LocalDateTime.now());
            module.setUpdatedAt(LocalDateTime.now());
            moduleRepository.save(module);

            // Recurse
            JsonNode children = node.path("children").path("attached");
            if (children.isArray()) {
                for (JsonNode child : children) {
                    parseNode(child, project, module, username);
                }
            }
        }
    }

    private void parseTestCase(JsonNode node, Project project, Module module, String username) {
        String title = node.path("title").asText("");
        String caseName = title.substring(3).trim(); // Remove "TC:"

        TestCase testCase = new TestCase();
        testCase.setName(caseName);
        testCase.setProjectId(project.getId());
        testCase.setProject(project);
        if (module != null) {
            testCase.setModuleId(module.getId());
            testCase.setModule(module);
        }
        testCase.setStatus("PENDING");
        testCase.setPriority("P1");
        testCase.setCreator(username);
        testCase.setUpdater(username);
        testCase.setCreatedAt(LocalDateTime.now());
        testCase.setUpdatedAt(LocalDateTime.now());

        // Parse Children for Preconditions, Steps, Expected Results
        StringBuilder preconditions = new StringBuilder();
        StringBuilder steps = new StringBuilder();
        StringBuilder expectedResult = new StringBuilder();

        JsonNode children = node.path("children").path("attached");
        if (children.isArray()) {
            for (JsonNode child : children) {
                String childTitle = child.path("title").asText("");
                if (childTitle.contains("前置条件") || childTitle.contains("Precondition")) {
                    extractListContent(child, preconditions);
                } else if (childTitle.contains("执行步骤") || childTitle.contains("Steps")) {
                    extractListContent(child, steps);
                } else if (childTitle.contains("期望结果") || childTitle.contains("Expected Result")) {
                    extractListContent(child, expectedResult);
                }
            }
        }

        testCase.setPreconditions(preconditions.toString());
        testCase.setSteps(steps.toString());
        testCase.setExpectedResult(expectedResult.toString());

        testCaseRepository.save(testCase);
    }

    private void extractListContent(JsonNode node, StringBuilder sb) {
        JsonNode children = node.path("children").path("attached");
        if (children.isArray()) {
            int index = 1;
            for (JsonNode child : children) {
                String text = child.path("title").asText("");
                if (!text.isEmpty()) {
                    // Check if text already starts with number
                    if (!text.matches("^\\d+\\..*")) {
                        sb.append(index).append(". ");
                    }
                    sb.append(text).append("<br/>"); // Use HTML break for rich text compatibility
                    index++;
                }
            }
        }
    }

    public byte[] generateTemplate() throws IOException {
        // Construct a simple JSON structure for XMind
        // This is a minimal valid content.json
        String jsonContent = "[" +
                "  {" +
                "    \"id\": \"sheet-1\"," +
                "    \"class\": \"sheet\"," +
                "    \"title\": \"画布 1\"," +
                "    \"rootTopic\": {" +
                "      \"id\": \"root-topic\"," +
                "      \"class\": \"topic\"," +
                "      \"title\": \"项目名称\"," +
                "      \"children\": {" +
                "        \"attached\": [" +
                "          {" +
                "            \"id\": \"topic-1\"," +
                "            \"title\": \"一级文件夹\"," +
                "            \"children\": {" +
                "              \"attached\": [" +
                "                {" +
                "                  \"id\": \"topic-2\"," +
                "                  \"title\": \"二级文件夹\"," +
                "                  \"children\": {" +
                "                    \"attached\": [" +
                "                      {" +
                "                        \"id\": \"topic-3\"," +
                "                        \"title\": \"TC: 正常登录测试\"," +
                "                        \"children\": {" +
                "                          \"attached\": [" +
                "                            {" +
                "                              \"id\": \"topic-pre\"," +
                "                              \"title\": \"前置条件\"," +
                "                              \"children\": { \"attached\": [ { \"id\": \"p1\", \"title\": \"1.已注册有效的用户账号\" } ] }" +
                "                            }," +
                "                            {" +
                "                              \"id\": \"topic-step\"," +
                "                              \"title\": \"执行步骤\"," +
                "                              \"children\": { \"attached\": [ { \"id\": \"s1\", \"title\": \"1.打开登录页面\" }, { \"id\": \"s2\", \"title\": \"2.输入正确的用户名\" } ] }" +
                "                            }," +
                "                            {" +
                "                              \"id\": \"topic-exp\"," +
                "                              \"title\": \"期望结果\"," +
                "                              \"children\": { \"attached\": [ { \"id\": \"e1\", \"title\": \"1.登录成功\" } ] }" +
                "                            }" +
                "                          ]" +
                "                        }" +
                "                      }" +
                "                    ]" +
                "                  }" +
                "                }" +
                "              ]" +
                "            }" +
                "          }" +
                "        ]" +
                "      }" +
                "    }" +
                "  }" +
                "]";

        // Minimal manifest.json
        String manifestContent = "{" +
                "  \"file-entries\": {" +
                "    \"content.json\": {}," +
                "    \"metadata.json\": {}" +
                "  }" +
                "}";

        // Minimal metadata.json
        String metadataContent = "{ \"creator\": { \"name\": \"TestPlatform\" } }";

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            // content.json
            ZipEntry contentEntry = new ZipEntry("content.json");
            zos.putNextEntry(contentEntry);
            zos.write(jsonContent.getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();
            
            // manifest.json
            ZipEntry manifestEntry = new ZipEntry("manifest.json");
            zos.putNextEntry(manifestEntry);
            zos.write(manifestContent.getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();
            
            // metadata.json
            ZipEntry metadataEntry = new ZipEntry("metadata.json");
            zos.putNextEntry(metadataEntry);
            zos.write(metadataContent.getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();
        }

        return baos.toByteArray();
    }
}
