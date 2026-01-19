package com.testplatform.backend.controller;

import com.testplatform.backend.service.XMindImportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/xmind")
@Slf4j
public class XMindImportController {

    @Autowired
    private XMindImportService xMindImportService;

    @PostMapping("/import")
    public ResponseEntity<?> importXMind(@RequestParam("file") MultipartFile file, 
                                         @RequestParam(value = "departmentId", required = false) Long departmentId,
                                         @RequestParam(value = "projectId", required = false) Long projectId,
                                         @RequestParam(value = "username", required = false) String usernameParam,
                                         Principal principal) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please upload a file");
        }

        try {
            String username = (principal != null) ? principal.getName() : "anonymous";
            if ("anonymous".equals(username) && usernameParam != null && !usernameParam.trim().isEmpty()) {
                username = usernameParam;
            }
            
            Long resultProjectId = xMindImportService.importXMind(file, username, departmentId, projectId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Import successful");
            response.put("projectId", resultProjectId);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Failed to import XMind file", e);
            return ResponseEntity.internalServerError().body("Failed to import file: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during import", e);
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/template")
    public ResponseEntity<byte[]> downloadTemplate() {
        try {
            byte[] templateBytes = xMindImportService.generateTemplate();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "template.xmind");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(templateBytes);
        } catch (IOException e) {
            log.error("Failed to generate template", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
