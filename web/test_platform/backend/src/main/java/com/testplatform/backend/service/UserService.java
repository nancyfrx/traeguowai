package com.testplatform.backend.service;

import com.testplatform.backend.dto.UpdateUserRequest;
import com.testplatform.backend.dto.UserInfoResponse;
import com.testplatform.backend.entity.Company;
import com.testplatform.backend.entity.User;
import com.testplatform.backend.repository.CompanyRepository;
import com.testplatform.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;

    public UserInfoResponse getUserInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("用户不存在"));
        
        UserInfoResponse response = new UserInfoResponse();
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        if (user.getCompany() != null) {
            response.setCompanyName(user.getCompany().getName());
        }
        return response;
    }

    @Transactional
    public void updateUserInfo(String currentUsername, UpdateUserRequest request) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("用户不存在"));

        // 更新基本信息
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        
        // 更新用户名（如果改变了）
        if (request.getUsername() != null && !request.getUsername().equals(currentUsername)) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("用户名已存在");
            }
            user.setUsername(request.getUsername());
        }

        // 更新公司信息
        if (request.getCompanyName() != null && !request.getCompanyName().trim().isEmpty()) {
            String companyName = request.getCompanyName().trim();
            Company company = companyRepository.findByName(companyName)
                    .orElseGet(() -> {
                        Company newCompany = new Company();
                        newCompany.setName(companyName);
                        return companyRepository.save(newCompany);
                    });
            user.setCompany(company);
        } else {
            user.setCompany(null);
        }

        userRepository.save(user);
    }
}
