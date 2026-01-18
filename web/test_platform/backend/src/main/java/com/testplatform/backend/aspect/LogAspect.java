package com.testplatform.backend.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.testplatform.backend.annotation.Log;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.MDC;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 日志切面实现
 */
@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class LogAspect {

    private final ObjectMapper objectMapper;
    private static final String TRACE_ID = "traceId";

    @Around("@within(com.testplatform.backend.annotation.Log) || @annotation(com.testplatform.backend.annotation.Log)")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        // 获取方法上的注解
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        
        // 使用 Spring 的 AnnotationUtils 更可靠地获取注解，支持代理和继承
        Log logAnnotation = AnnotationUtils.findAnnotation(method, Log.class);
        if (logAnnotation == null) {
            logAnnotation = AnnotationUtils.findAnnotation(joinPoint.getTarget().getClass(), Log.class);
        }

        if (logAnnotation == null) {
            return joinPoint.proceed();
        }

        long startTime = System.currentTimeMillis();
        String traceId = MDC.get(TRACE_ID);
        if (traceId == null || traceId.isEmpty()) {
            traceId = UUID.randomUUID().toString().replace("-", "");
            MDC.put(TRACE_ID, traceId);
        }

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes != null ? attributes.getRequest() : null;

        String className = joinPoint.getTarget().getClass().getName();
        String methodName = joinPoint.getSignature().getName();
        String moduleName = logAnnotation.value();

        // 记录入参
        if (logAnnotation.logInput()) {
            Object[] args = joinPoint.getArgs();
            String[] parameterNames = signature.getParameterNames();
            Map<String, Object> params = new HashMap<>();
            if (parameterNames != null && args != null) {
                for (int i = 0; i < Math.min(parameterNames.length, args.length); i++) {
                    String paramName = parameterNames[i];
                    Object arg = args[i];
                    
                    // 过滤敏感参数
                    boolean isSensitive = false;
                    for (String exclude : logAnnotation.excludeParams()) {
                        if (paramName.equalsIgnoreCase(exclude)) {
                            isSensitive = true;
                            break;
                        }
                    }
                    
                    if (isSensitive) {
                        params.put(paramName, "******");
                    } else if (!(arg instanceof HttpServletRequest) && !(arg instanceof jakarta.servlet.http.HttpSession)) {
                        params.put(paramName, arg);
                    }
                }
            }
            String paramsStr = "{}";
            try {
                paramsStr = params.isEmpty() ? "{}" : objectMapper.writeValueAsString(params);
            } catch (Exception e) {
                paramsStr = "[Serialization failed]";
            }
            log.info("[{}] 模块: {}, 方法: {}.{}, 入参: {}", traceId, moduleName, className, methodName, paramsStr);
        }

        Object result = null;
        try {
            result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;
            
            // 记录出参和执行时间
            if (logAnnotation.logOutput()) {
                String resultStr = "{}";
                try {
                    resultStr = objectMapper.writeValueAsString(result);
                } catch (Exception e) {
                    resultStr = "[Serialization failed]";
                }
                log.info("[{}] 模块: {}, 方法: {}.{}, 状态: 成功, 耗时: {}ms, 出参: {}", traceId, moduleName, className, methodName, 
                    executionTime, resultStr);
            } else {
                log.info("[{}] 模块: {}, 方法: {}.{}, 状态: 成功, 耗时: {}ms", traceId, moduleName, className, methodName, executionTime);
            }

            // 慢方法警告
            if (executionTime > logAnnotation.slowThreshold()) {
                log.warn("[{}] 慢方法警告: 模块: {}, 方法: {}.{}, 耗时: {}ms, 超过阈值: {}ms", 
                    traceId, moduleName, className, methodName, executionTime, logAnnotation.slowThreshold());
            }

            return result;
        } catch (Throwable e) {
            long executionTime = System.currentTimeMillis() - startTime;
            String errorParams = "{}";
            try {
                errorParams = objectMapper.writeValueAsString(joinPoint.getArgs());
            } catch (Exception ex) {
                errorParams = "[Serialization failed]";
            }
            log.error("[{}] 模块: {}, 方法: {}.{}, 状态: 失败, 耗时: {}ms, 异常信息: {}, 参数: {}", 
                traceId, moduleName, className, methodName, executionTime, e.getMessage(), 
                errorParams, e);
            throw e;
        } finally {
            // 如果是入口切面，可以在这里清除 MDC，但通常建议在拦截器中清除
        }
    }
}
