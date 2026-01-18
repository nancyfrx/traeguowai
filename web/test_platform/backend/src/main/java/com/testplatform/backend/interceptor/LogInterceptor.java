package com.testplatform.backend.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.UUID;

/**
 * 日志上下文拦截器，负责初始化 TraceID 和记录请求基本信息
 */
@Component
public class LogInterceptor implements HandlerInterceptor {

    private static final String TRACE_ID = "traceId";
    private static final String USER_NAME = "userName";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 1. 初始化 TraceID
        String traceId = request.getHeader("X-Trace-Id");
        if (traceId == null || traceId.isEmpty()) {
            traceId = UUID.randomUUID().toString().replace("-", "");
        }
        MDC.put(TRACE_ID, traceId);

        // 2. 获取当前用户
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("username") != null) {
            MDC.put(USER_NAME, (String) session.getAttribute("username"));
        } else {
            MDC.put(USER_NAME, "anonymous");
        }

        // 3. 将 TraceID 放入响应头，方便前端追踪
        response.setHeader("X-Trace-Id", traceId);

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        // 清理 MDC，防止内存泄漏
        MDC.clear();
    }
}
