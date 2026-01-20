package com.testplatform.backend.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class ZhipuAIService {

    @Value("${ai.zhipu.api-key}")
    private String apiKey;

    private static final String API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
    // Token expiration: 30 minutes
    private static final long EXPIRATION_TIME = 1000 * 60 * 30;
    
    // Cache the token to avoid regenerating it for every request (optional, but good practice)
    // For simplicity, we regenerate if needed or just per request as it's cheap locally. 
    // Zhipu recommends caching. We'll generate per request for now to avoid complexity with expiration management.

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(300, TimeUnit.SECONDS) // Increased to 5 minutes for complex generations
            .writeTimeout(60, TimeUnit.SECONDS)
            .build();

    public String generate(String prompt, String model) throws IOException {
        String token = generateToken(apiKey);

        JSONObject userMessage = new JSONObject();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);

        JSONArray messages = new JSONArray();
        messages.add(userMessage);

        JSONObject payload = new JSONObject();
        payload.put("model", model);
        payload.put("messages", messages);
        payload.put("temperature", 0.7);
        // payload.put("max_tokens", 4096); // Optional

        RequestBody body = RequestBody.create(payload.toJSONString(), MediaType.parse("application/json; charset=utf-8"));

        Request request = new Request.Builder()
                .url(API_URL)
                .addHeader("Authorization", "Bearer " + token)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                throw new IOException("AI API failed with code " + response.code() + ": " + errorBody);
            }
            String responseBody = response.body().string();
            JSONObject jsonResponse = JSON.parseObject(responseBody);
            
            if (jsonResponse.containsKey("error")) {
                 throw new IOException("AI API Error: " + jsonResponse.getString("error"));
            }

            JSONArray choices = jsonResponse.getJSONArray("choices");
            if (choices != null && !choices.isEmpty()) {
                return choices.getJSONObject(0).getJSONObject("message").getString("content");
            } else {
                return "";
            }
        }
    }

    private String generateToken(String apiKey) {
        String[] parts = apiKey.split("\\.");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid API Key format");
        }
        String id = parts[0];
        String secret = parts[1];

        Map<String, Object> payload = new HashMap<>();
        payload.put("api_key", id);
        payload.put("exp", System.currentTimeMillis() + EXPIRATION_TIME);
        payload.put("timestamp", System.currentTimeMillis());

        return JWT.create()
                .withHeader(Map.of("alg", "HS256", "sign_type", "SIGN"))
                .withPayload(payload)
                .sign(Algorithm.HMAC256(secret.getBytes(StandardCharsets.UTF_8)));
    }
}
