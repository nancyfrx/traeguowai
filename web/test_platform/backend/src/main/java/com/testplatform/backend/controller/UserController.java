package com.testplatform.backend.controller;

import com.testplatform.backend.annotation.Log;
import com.testplatform.backend.dto.UpdateUserRequest;
import com.testplatform.backend.dto.UserInfoResponse;
import com.testplatform.backend.entity.User;
import com.testplatform.backend.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Log("用户管理")
public class UserController {

    private final UserService userService;

    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(HttpSession session) {
        try {
            Object usernameObj = session.getAttribute("username");
            if (usernameObj == null) {
                return ResponseEntity.status(401).body(Map.of("error", "未登录"));
            }
            String username = usernameObj.toString();
            return ResponseEntity.ok(userService.getUserInfo(username));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "服务器内部错误: " + e.getMessage()));
        }
    }

    @PutMapping("/info")
    public ResponseEntity<?> updateUserInfo(@RequestBody UpdateUserRequest request, HttpSession session) {
        String currentUsername = (String) session.getAttribute("username");
        if (currentUsername == null) {
            return ResponseEntity.status(401).body(Map.of("error", "未登录"));
        }
        try {
            userService.updateUserInfo(currentUsername, request);
            // 如果用户名改了，更新 session 中的 username
            if (request.getUsername() != null && !request.getUsername().equals(currentUsername)) {
                session.setAttribute("username", request.getUsername());
            }
            return ResponseEntity.ok(Map.of("message", "更新成功"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
