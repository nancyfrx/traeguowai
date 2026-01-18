package com.testplatform.backend.annotation;

import java.lang.annotation.*;

/**
 * 自定义日志注解
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {
    /**
     * 模块名称
     */
    String value() default "";

    /**
     * 是否记录入参
     */
    boolean logInput() default true;

    /**
     * 是否记录出参
     */
    boolean logOutput() default true;

    /**
     * 排除的参数名（如密码等敏感信息）
     */
    String[] excludeParams() default {"password", "token", "secret", "oldPassword", "newPassword"};

    /**
     * 慢方法阈值（毫秒），超过此时间将记录为警告日志
     */
    long slowThreshold() default 1000L;
}
