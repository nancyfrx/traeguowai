package com.testplatform.backend.controller;

import com.testplatform.backend.dto.*;
import com.testplatform.backend.service.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        authService.login(request, session);
        return ResponseEntity.ok(Map.of("message", "Login successful"));
    }

    @GetMapping("/captcha")
    public ResponseEntity<?> getCaptcha(HttpSession session) {
        try {
            return ResponseEntity.ok(authService.generateCaptcha(session));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to generate captcha"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.sendResetCode(request);
        return ResponseEntity.ok(Map.of("message", "验证码已发送至您的邮箱"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "密码重置成功"));
    }
}
