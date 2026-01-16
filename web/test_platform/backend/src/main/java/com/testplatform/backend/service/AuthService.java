package com.testplatform.backend.service;

import com.testplatform.backend.dto.LoginRequest;
import com.testplatform.backend.dto.RegisterRequest;
import com.testplatform.backend.entity.User;
import com.testplatform.backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

import com.testplatform.backend.dto.ForgotPasswordRequest;
import com.testplatform.backend.dto.ResetPasswordRequest;
import com.testplatform.backend.entity.Company;
import com.testplatform.backend.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final CompanyRepository companyRepository;

    @Value("${spring.mail.username}")
    private String mailFrom;

    private static final int MAX_FAILED_ATTEMPTS = 3;
    private static final int LOCK_TIME_MINUTES = 5;
    private final Map<String, String> emailCodes = new HashMap<>(); // Temporary storage for reset codes

    @Transactional
    public void register(RegisterRequest request) {
        // 解密 Base64 密码
         String decodedPassword;
         String decodedConfirmPassword;
         try {
             decodedPassword = new String(Base64.getDecoder().decode(request.getPassword()));
             decodedConfirmPassword = new String(Base64.getDecoder().decode(request.getConfirmPassword()));
         } catch (Exception e) {
             throw new IllegalArgumentException("密码传输格式错误");
         }
 
         if (!decodedPassword.equals(decodedConfirmPassword)) {
            throw new IllegalArgumentException("两次输入的密码不一致");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("用户名已存在");
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty() && userRepository.existsByEmail(request.getEmail().trim())) {
            throw new IllegalArgumentException("邮箱已被注册");
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty() && userRepository.existsByPhone(request.getPhone().trim())) {
            throw new IllegalArgumentException("电话号码已被注册");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(decodedPassword));
        user.setEmail(request.getEmail() != null && !request.getEmail().trim().isEmpty() ? request.getEmail().trim() : null);
        user.setPhone(request.getPhone() != null && !request.getPhone().trim().isEmpty() ? request.getPhone().trim() : null);
        
        // 处理企业字段
        if (request.getCompanyName() != null && !request.getCompanyName().trim().isEmpty()) {
            String companyName = request.getCompanyName().trim();
            Company company = companyRepository.findByName(companyName)
                    .orElseGet(() -> {
                        Company newCompany = new Company();
                        newCompany.setName(companyName);
                        return companyRepository.save(newCompany);
                    });
            user.setCompany(company);
        }
        
        userRepository.save(user);
    }

    public void login(LoginRequest request, HttpSession session) {
        // 1. Verify Captcha
        String sessionCaptcha = (String) session.getAttribute("captcha");
        LocalDateTime captchaTime = (LocalDateTime) session.getAttribute("captchaTime");

        if (sessionCaptcha == null || captchaTime == null || 
            captchaTime.plusMinutes(5).isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("验证码已过期，请刷新");
        }

        if (!sessionCaptcha.equalsIgnoreCase(request.getCaptcha())) {
            throw new IllegalArgumentException("验证码错误");
        }

        // 解密 Base64 密码
        String decodedPassword;
        try {
            decodedPassword = new String(Base64.getDecoder().decode(request.getPassword()));
        } catch (Exception e) {
            throw new IllegalArgumentException("密码传输格式错误");
        }
        
        // Clear captcha after use
        session.removeAttribute("captcha");
        session.removeAttribute("captchaTime");

        // 2. Find User (Support username, email, phone)
        String identity = request.getUsername();
        User user = userRepository.findByUsername(identity)
                .or(() -> userRepository.findByEmail(identity))
                .or(() -> userRepository.findByPhone(identity))
                .orElseThrow(() -> new IllegalArgumentException("用户名或密码错误"));

        // 3. Check Lock
        if (user.getLockTime() != null) {
            if (user.getLockTime().isAfter(LocalDateTime.now())) {
                throw new IllegalArgumentException("账号已锁定，请5分钟后再试");
            } else {
                // Unlock
                user.setLockTime(null);
                user.setFailedAttempts(0);
                userRepository.save(user);
            }
        }

        // 4. Check Password
        if (!passwordEncoder.matches(decodedPassword, user.getPassword())) {
            user.setFailedAttempts(user.getFailedAttempts() + 1);
            if (user.getFailedAttempts() >= MAX_FAILED_ATTEMPTS) {
                user.setLockTime(LocalDateTime.now().plusMinutes(LOCK_TIME_MINUTES));
                userRepository.save(user);
                throw new IllegalArgumentException("连续失败3次，账号锁定5分钟");
            }
            userRepository.save(user);
            throw new IllegalArgumentException("用户名或密码错误");
        }

        // 5. Success
        user.setFailedAttempts(0);
        user.setLockTime(null);
        userRepository.save(user);
        
        session.setAttribute("username", user.getUsername());
        session.setAttribute("user", user);
    }

    public Map<String, String> generateCaptcha(HttpSession session) throws IOException {
        if (session == null) {
            throw new IOException("Session is null");
        }
        try {
            // Generate random text
            String capText = generateRandomText(4);
            session.setAttribute("captcha", capText);
            session.setAttribute("captchaTime", LocalDateTime.now());

            // Generate image
            int width = 120;
            int height = 40;
            BufferedImage bi = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = bi.createGraphics();
            
            // Set rendering hints for better quality
            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            
            // Background
            g.setColor(Color.WHITE);
            g.fillRect(0, 0, width, height);
            
            // Text
            g.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 28));
            Random random = new Random();
            for (int i = 0; i < capText.length(); i++) {
                g.setColor(new Color(random.nextInt(150), random.nextInt(150), random.nextInt(150)));
                g.drawString(String.valueOf(capText.charAt(i)), 15 + (i * 25), 30);
            }
            
            // Interference lines
            for (int i = 0; i < 5; i++) {
                g.setColor(new Color(random.nextInt(200), random.nextInt(200), random.nextInt(200)));
                g.drawLine(random.nextInt(width), random.nextInt(height), random.nextInt(width), random.nextInt(height));
            }
            
            g.dispose();

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ImageIO.write(bi, "png", out);
            
            String base64Image = Base64.getEncoder().encodeToString(out.toByteArray());
            
            Map<String, String> result = new HashMap<>();
            result.put("image", "data:image/png;base64," + base64Image);
            return result;
        } catch (Exception e) {
            // Fallback: if image generation fails, at least log it and throw a clearer error
            throw new IOException("Failed to generate captcha image: " + e.getMessage(), e);
        }
    }

    private String generateRandomText(int length) {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
        java.util.Random random = new java.util.Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public void sendResetCode(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("该邮箱未注册"));

        String code = String.format("%06d", new Random().nextInt(1000000));
        emailCodes.put(request.getEmail(), code);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom); // 设置发件人
        message.setTo(request.getEmail());
        message.setSubject("Q-Lab 测试平台 - 重置密码验证码");
        message.setText("您好，\n\n您的重置密码验证码是：" + code + "。有效期为5分钟。请勿泄露给他人。\n\n如非本人操作，请忽略此邮件。");
        mailSender.send(message);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        // 解密 Base64 密码
        String decodedPassword;
        String decodedConfirmPassword;
        try {
            decodedPassword = new String(Base64.getDecoder().decode(request.getNewPassword()));
            decodedConfirmPassword = new String(Base64.getDecoder().decode(request.getConfirmPassword()));
        } catch (Exception e) {
            throw new IllegalArgumentException("密码传输格式错误");
        }

        if (!decodedPassword.equals(decodedConfirmPassword)) {
            throw new IllegalArgumentException("两次输入的密码不一致");
        }

        String savedCode = emailCodes.get(request.getEmail());
        if (savedCode == null || !savedCode.equals(request.getCode())) {
            throw new IllegalArgumentException("验证码错误或已过期");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("该邮箱未注册"));

        user.setPassword(passwordEncoder.encode(decodedPassword));
        user.setFailedAttempts(0);
        user.setLockTime(null);
        userRepository.save(user);

        emailCodes.remove(request.getEmail());
    }
}
