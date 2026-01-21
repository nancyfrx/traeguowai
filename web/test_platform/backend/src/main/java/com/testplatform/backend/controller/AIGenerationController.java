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
    private com.testplatform.backend.service.DeepSeekAIService deepSeekAIService;

    @Autowired
    private com.testplatform.backend.service.FileParserService fileParserService;

    @Autowired
    private AIGenerationRecordService recordService;

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/generate")
    public AIGenerationRecord generate(@RequestParam("prompt") String prompt,
                                       @RequestParam(value = "model", defaultValue = "glm-4.6") String model,
                                       @RequestParam("operator") String operator,
                                       @RequestParam(value = "files", required = false) MultipartFile[] files,
                                       @RequestParam(value = "skipParsing", defaultValue = "false") boolean skipParsing) {
        StringBuilder uploadFileNames = new StringBuilder();
        String finalPrompt = prompt;
        
        try {
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

                        // Parse file content (PDF, Word, Text, Image OCR)
                        // Only parse if skipParsing is false
                        if (!skipParsing) {
                            String parsedContent = fileParserService.parseFile(file);
                            if (parsedContent != null && !parsedContent.trim().isEmpty()) {
                                 finalPrompt += "\n\nFile Content (" + originalFilename + "):\n" + parsedContent;
                            }
                        }
                    }
                }
            }

            String systemInstruction = "\n\nPlease generate the test cases in valid JSON array format. " +
                    "Generate a comprehensive set of test cases including Functional (功能用例), Performance (性能用例), Compatibility (兼容性用例), and Security (安全用例) types. " +
                    "For the 'module' field, please infer the specific functional module name from the input (e.g., '登录', '订单'). Do NOT include suffixes like '模块' (Module) or '功能' (Function). If unable to infer, use '默认模块'. " +
                    "For the 'type' field, you MUST use one of the following exact Chinese strings: '功能用例', '性能用例', '兼容性用例', '安全用例'. Do NOT use English (e.g., 'Functional'). " +
                    "Each object should have keys: name, module, preconditions, steps, expectedResult, priority (P0-P3), type. " +
                    "Ensure 'preconditions', 'steps', and 'expectedResult' are detailed. If there are numbered lists, use '\\n' to separate lines. " +
                    "Do not include markdown formatting (like ```json). Just the raw JSON.";
            
            String promptToSend = finalPrompt + systemInstruction;

            String generatedContent;
            if (model.toLowerCase().startsWith("deepseek")) {
                generatedContent = deepSeekAIService.generate(promptToSend, model);
            } else {
                generatedContent = zhipuAIService.generate(promptToSend, model);
            }
            
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

            // Force Chinese types if AI returns English (common issue with DeepSeek/GLM)
            generatedContent = generatedContent
                .replace("\"type\": \"Functional\"", "\"type\": \"功能用例\"")
                .replace("\"type\": \"Functional Testing\"", "\"type\": \"功能用例\"")
                .replace("\"type\": \"Performance\"", "\"type\": \"性能用例\"")
                .replace("\"type\": \"Compatibility\"", "\"type\": \"兼容性用例\"")
                .replace("\"type\": \"Security\"", "\"type\": \"安全用例\"");

            AIGenerationRecord record = new AIGenerationRecord();
            record.setInputContent(finalPrompt); // Record full prompt including file content
            record.setGeneratedContent(generatedContent);
            record.setModel(model);
            record.setOperator(operator);
            record.setUploadFileName(uploadFileNames.length() > 0 ? uploadFileNames.toString() : null);
            record.setCreatedAt(LocalDateTime.now());
            
            recordService.save(record);
            return record;
        } catch (Exception e) {
            e.printStackTrace();
            // Save failed record with empty content
            try {
                AIGenerationRecord failedRecord = new AIGenerationRecord();
                failedRecord.setInputContent(finalPrompt);
                failedRecord.setGeneratedContent(""); // Empty content as requested
                failedRecord.setModel(model);
                failedRecord.setOperator(operator);
                failedRecord.setUploadFileName(uploadFileNames.length() > 0 ? uploadFileNames.toString() : null);
                failedRecord.setCreatedAt(LocalDateTime.now());
                recordService.save(failedRecord);
            } catch (Exception saveEx) {
                System.err.println("Failed to save error record: " + saveEx.getMessage());
            }
            throw new RuntimeException("AI Generation failed: " + e.getMessage());
        }
    }

    @PostMapping("/parse-file")
    public java.util.Map<String, Object> parseFile(@RequestParam("file") MultipartFile file) {
        try {
            String content = fileParserService.parseFile(file);
            java.util.Map<String, Object> result = new java.util.HashMap<>();
            
            // Check for known error markers from FileParserService
            if (content != null && content.contains("[图片识别失败:")) {
                result.put("success", false);
                result.put("error", content); // Return the error message
                result.put("content", "");
            } else if (content != null && content.startsWith("Error parsing file")) {
                result.put("success", false);
                result.put("error", content);
                result.put("content", "");
            } else {
                result.put("success", true);
                result.put("content", content != null ? content : "");
            }
            
            return result;
        } catch (Throwable e) {
            e.printStackTrace();
            java.util.Map<String, Object> result = new java.util.HashMap<>();
            result.put("success", false);
            result.put("error", "文件解析异常: " + e.getMessage());
            return result;
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
