package com.testplatform.backend.controller;

import com.github.pagehelper.PageInfo;
import com.testplatform.backend.entity.AIGenerationRecord;
import com.testplatform.backend.service.AIGenerationRecordService;
import com.testplatform.backend.service.ZhipuAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIGenerationController {

    @Autowired
    private ZhipuAIService zhipuAIService;

    @Autowired
    private AIGenerationRecordService recordService;

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/generate")
    public AIGenerationRecord generate(@RequestParam("prompt") String prompt,
                                       @RequestParam(value = "model", defaultValue = "glm-4.6") String model,
                                       @RequestParam("operator") String operator,
                                       @RequestParam(value = "type", required = false, defaultValue = "功能用例") String type,
                                       @RequestParam(value = "module", required = false, defaultValue = "Default") String module,
                                       @RequestParam(value = "files", required = false) MultipartFile[] files) {
        try {
            StringBuilder uploadFileNames = new StringBuilder();
            String finalPrompt = prompt;

            // Handle file upload
            if (files != null && files.length > 0) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        saveFile(file);
                        String originalFilename = file.getOriginalFilename();
                        if (uploadFileNames.length() > 0) {
                            uploadFileNames.append(";");
                        }
                        uploadFileNames.append(originalFilename);

                        // If text file, we could read it
                        if (originalFilename != null && (originalFilename.endsWith(".txt") || originalFilename.endsWith(".md") || originalFilename.endsWith(".json") || originalFilename.endsWith(".csv"))) {
                             try {
                                 String fileContent = new String(file.getBytes());
                                 finalPrompt += "\n\nFile Content (" + originalFilename + "):\n" + fileContent;
                             } catch (Exception e) {
                                 // Ignore read error
                             }
                        }
                    }
                }
            }

            // Append instruction to format as JSON for the table
            String typeInstruction;
            if ("功能用例".equals(type)) {
                typeInstruction = "Generate a comprehensive set of test cases including Functional (功能用例), Performance (性能用例), Compatibility (兼容性用例), and Security (安全用例) types.";
            } else {
                typeInstruction = "The test cases should be of type '" + type + "'.";
            }

            String systemInstruction = "\n\nPlease generate the test cases in valid JSON array format. " +
                    typeInstruction +
                    " For the 'module' field, please infer the specific functional module name from the input (e.g., '登录', '订单'). Do NOT include suffixes like '模块' (Module) or '功能' (Function). If unable to infer, use '" + module + "'. " +
                    "Each object should have keys: name, module, preconditions, steps, expectedResult, priority (P0-P3), type. " +
                    "Ensure 'preconditions', 'steps', and 'expectedResult' are detailed. If there are numbered lists, use '\\n' to separate lines. " +
                    "Do not include markdown formatting (like ```json). Just the raw JSON.";
            
            // If the user didn't ask for specific format, we append our instruction
            // But we should be careful not to override user intent. 
            // However, the requirement is "format results put into table".
            // So we'll try to guide the AI.
            String promptToSend = finalPrompt + systemInstruction;

            String generatedContent = zhipuAIService.generate(promptToSend, model);
            
            // Clean up markdown code blocks if present
            if (generatedContent.startsWith("```json")) {
                generatedContent = generatedContent.substring(7);
            }
            if (generatedContent.startsWith("```")) {
                generatedContent = generatedContent.substring(3);
            }
            if (generatedContent.endsWith("```")) {
                generatedContent = generatedContent.substring(0, generatedContent.length() - 3);
            }

            AIGenerationRecord record = new AIGenerationRecord();
            record.setInputContent(prompt); // Record original prompt
            record.setGeneratedContent(generatedContent);
            record.setModel(model);
            record.setOperator(operator);
            record.setUploadFileName(uploadFileNames.length() > 0 ? uploadFileNames.toString() : null);
            record.setCreatedAt(LocalDateTime.now());
            
            recordService.save(record);
            return record;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("AI Generation failed: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public PageInfo<AIGenerationRecord> listHistory(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return recordService.list(page, size);
    }

    private String saveFile(MultipartFile file) throws IOException {
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String newFilename = UUID.randomUUID().toString() + extension;
        Path path = Paths.get(UPLOAD_DIR + newFilename);
        Files.write(path, file.getBytes());
        return newFilename; // Return internal name, or we could return original name for display
    }
}
