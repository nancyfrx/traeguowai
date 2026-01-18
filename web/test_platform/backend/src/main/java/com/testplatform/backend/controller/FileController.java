package com.testplatform.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.testplatform.backend.service.OssService;
import com.aliyun.oss.model.ObjectMetadata;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    @Autowired
    private OssService ossService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        
        if (file.isEmpty()) {
            response.put("errno", 1);
            response.put("message", "文件不能为空");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // Check if credentials are valid
            if (!ossService.hasValidCredentials()) {
                response.put("errno", 1);
                response.put("message", "OSS 凭证未配置或无效");
                return ResponseEntity.status(500).body(response);
            }

            // 使用 OSS 上传
            String fileUrl = ossService.uploadFile(file);

            // 构建返回结果 (符合 WangEditor 要求)
            // 直接返回 OSS 原始链接，确保数据库保存的是阿里云链接
            response.put("errno", 0);
            Map<String, Object> data = new HashMap<>();
            data.put("url", fileUrl);
            data.put("alt", file.getOriginalFilename());
            response.put("data", data);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("errno", 1);
            response.put("message", "文件上传失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/view/**")
    public void viewFile(HttpServletResponse response, @RequestParam(value = "path", required = false) String path, jakarta.servlet.http.HttpServletRequest request) {
        try {
            // Extract path from URI if not provided as param
            if (path == null || path.isEmpty()) {
                String uri = request.getRequestURI();
                path = uri.substring(uri.indexOf("/view/") + 6);
            }

            // Check if credentials are valid
            if (!ossService.hasValidCredentials()) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setCharacterEncoding("UTF-8");
                Map<String, String> error = new HashMap<>();
                error.put("error", "OSS 凭据未配置");
                error.put("message", "OSS credentials not configured");
                objectMapper.writeValue(response.getWriter(), error);
                return;
            }

            ObjectMetadata metadata = ossService.getMetadata(path);
            if (metadata == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setCharacterEncoding("UTF-8");
                Map<String, String> error = new HashMap<>();
                error.put("error", "文件不存在");
                error.put("message", "File not found: " + path);
                objectMapper.writeValue(response.getWriter(), error);
                return;
            }

            String contentType = metadata.getContentType();
            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            response.setContentType(contentType);
            response.setHeader("Cache-Control", "max-age=86400"); // 缓存一天
            ossService.downloadToStream(path, response.getOutputStream());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            try {
                Map<String, String> error = new HashMap<>();
                error.put("error", "获取文件失败");
                error.put("message", e.getMessage());
                objectMapper.writeValue(response.getWriter(), error);
            } catch (IOException ignored) {}
        }
    }
}
