package com.testplatform.backend.config;

import com.fasterxml.jackson.core.StreamReadConstraints;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

/**
 * Jackson 配置类
 * 用于处理超大 JSON 负载，特别是包含大量 Base64 图片的 HTML 内容
 * 并支持 Java 8 时间类型序列化
 */
@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper objectMapper = builder.createXmlMapper(false).build();
        
        // 注册 JavaTimeModule 以支持 LocalDateTime
        objectMapper.registerModule(new JavaTimeModule());
        // 禁用将日期写为时间戳
        objectMapper.configure(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        
        // 设置 Jackson 解析字符串的最大长度为 100MB (默认是 20MB)
        // 解决 "JSON parse error: String length exceeds the maximum length" 错误
        objectMapper.getFactory().setStreamReadConstraints(
                StreamReadConstraints.builder()
                        .maxStringLength(100_000_000)
                        .build()
        );
        
        return objectMapper;
    }
}
