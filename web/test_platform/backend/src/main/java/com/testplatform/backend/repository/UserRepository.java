package com.testplatform.backend.repository;

import com.testplatform.backend.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.Optional;
import java.util.List;

@Mapper
public interface UserRepository {
    Optional<User> findById(Long id);
    List<User> findAll();
    void save(User user);
    void update(User user);
    void deleteById(Long id);
    
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}
