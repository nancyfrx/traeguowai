package com.testplatform.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        
        if (file.isEmpty()) {
            response.put("errno", 1);
            response.put("message", "文件不能为空");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // 确保目录存在
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // 生成唯一文件名
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + extension;
            
            // 保存文件
            Path path = Paths.get(uploadDir, fileName);
            Files.write(path, file.getBytes());

            // 构建返回结果 (符合 WangEditor 要求)
            response.put("errno", 0);
            Map<String, Object> data = new HashMap<>();
            data.put("url", "/api/files/view/" + fileName);
            data.put("alt", originalFilename);
            response.put("data", data);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("errno", 1);
            response.put("message", "文件上传失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/view/{fileName:.+}")
    public ResponseEntity<byte[]> viewFile(@PathVariable String fileName) throws IOException {
        Path path = Paths.get(uploadDir, fileName);
        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }
        
        byte[] image = Files.readAllBytes(path);
        String contentType = Files.probeContentType(path);
        
        return ResponseEntity.ok()
                .header("Content-Type", contentType != null ? contentType : "application/octet-stream")
                .body(image);
    }
}
