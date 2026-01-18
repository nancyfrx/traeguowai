package com.testplatform.backend.filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@WebFilter(urlPatterns = "/*")
@Order(1)
public class TraceIdFilter implements Filter {

    private static final String TRACE_ID = "traceId";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            String traceId = UUID.randomUUID().toString().replace("-", "");
            MDC.put(TRACE_ID, traceId);
            chain.doFilter(request, response);
        } finally {
            MDC.remove(TRACE_ID);
        }
    }
}
