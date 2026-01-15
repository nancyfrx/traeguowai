package com.blog.backend.controller;

import com.blog.backend.service.OssService;
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
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    @Autowired
    private OssService ossService;

    @GetMapping("/view")
    public void viewFile(@RequestParam("path") String path, HttpServletResponse response) {
        try {
            ObjectMetadata metadata = ossService.getMetadata(path);
            if (metadata == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }

            String contentType = metadata.getContentType();
            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            response.setContentType(contentType);
            ossService.downloadToStream(path, response.getOutputStream());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            try {
                response.getWriter().write("Error retrieving file: " + e.getMessage());
            } catch (IOException ignored) {}
        }
    }

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            System.out.println("Uploading file: " + file.getOriginalFilename() + " (" + file.getSize() + " bytes)");
            String fileUrl = ossService.uploadFile(file);
            System.out.println("Upload successful: " + fileUrl);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String errorMsg = e.getClass().getSimpleName() + ": " + e.getMessage();
            System.err.println("Upload failed: " + errorMsg);
            e.printStackTrace();
            return ResponseEntity.status(500).body("OSS Upload Error [" + errorMsg + "]");
        }
    }
}
