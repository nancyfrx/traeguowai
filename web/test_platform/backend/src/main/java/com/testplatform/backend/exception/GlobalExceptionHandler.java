package com.testplatform.backend.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<?> handleBusinessException(BusinessException e) {
        log.warn("业务异常: {}", e.getMessage());
        return ResponseEntity.status(e.getCode()).body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<?> handleNoHandlerFoundException(NoHandlerFoundException e) {
        log.warn("接口未找到: {} {}", e.getHttpMethod(), e.getRequestURL());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                    "error", "接口未找到",
                    "message", String.format("接口 %s %s 不存在", e.getHttpMethod(), e.getRequestURL())
                ));
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<?> handleHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException e) {
        log.warn("不支持的媒体类型: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                .body(Map.of(
                    "error", "不支持的媒体类型",
                    "message", e.getMessage()
                ));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<?> handleMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        log.warn("缺少请求参数: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                    "error", "缺少请求参数",
                    "message", String.format("缺少必要参数: %s", e.getParameterName())
                ));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<?> handleMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        log.warn("不支持的请求方法: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(Map.of(
                    "error", "不支持的请求方法: " + e.getMethod(),
                    "message", e.getMessage()
                ));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        String message = e.getMessage();
        if (message != null && message.contains("exceeds the maximum length")) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "数据量过大，保存失败",
                "message", "提交的内容包含超大图片或文本，已超过系统限制（100MB）。请尝试减小图片大小或分批上传。"
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "请求数据解析失败: " + message));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(Map.of("error", errorMessage));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneralException(Exception e) {
        // 忽略 ClientAbortException，这通常是因为客户端主动断开连接（如浏览器刷新或关闭）
        if (e.getClass().getName().contains("ClientAbortException") || 
            (e.getCause() != null && e.getCause().getClass().getName().contains("ClientAbortException"))) {
            log.debug("客户端主动断开连接: {}", e.getMessage());
            return null; // 或者返回 empty response
        }
        
        log.error("系统未捕获异常: ", e);
        return ResponseEntity.internalServerError().body(Map.of("error", "系统内部错误: " + e.getMessage()));
    }
}
