package com.testplatform.backend.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Service
public class DeepSeekAIService {

    @Value("${ai.deepseek.api-key}")
    private String apiKey;

    @Value("${ai.deepseek.base-url}")
    private String baseUrl;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(300, TimeUnit.SECONDS) // 5 minutes for reasoning models
            .writeTimeout(60, TimeUnit.SECONDS)
            .build();

    public String generate(String prompt, String model) throws IOException {
        // Map frontend model ID to actual API model name if necessary
        // Frontend sends "deepseek", we map to "deepseek-chat" by default
        String apiModel = "deepseek-chat";
        if ("deepseek-reasoner".equals(model)) {
            apiModel = "deepseek-reasoner";
        }

        JSONObject userMessage = new JSONObject();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);

        JSONArray messages = new JSONArray();
        messages.add(userMessage);

        JSONObject payload = new JSONObject();
        payload.put("model", apiModel);
        payload.put("messages", messages);
        payload.put("stream", false);
        // payload.put("temperature", 1.0); // Optional

        RequestBody body = RequestBody.create(payload.toJSONString(), MediaType.parse("application/json; charset=utf-8"));

        // Ensure baseUrl ends with /chat/completions or construct it
        String endpoint = baseUrl;
        if (endpoint.endsWith("/")) {
            endpoint = endpoint + "chat/completions";
        } else if (!endpoint.endsWith("/chat/completions")) {
             endpoint = endpoint + "/chat/completions";
        }

        Request request = new Request.Builder()
                .url(endpoint)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                throw new IOException("DeepSeek API failed with code " + response.code() + ": " + errorBody);
            }
            String responseBody = response.body().string();
            JSONObject jsonResponse = JSON.parseObject(responseBody);
            
            if (jsonResponse.containsKey("error")) {
                 throw new IOException("DeepSeek API Error: " + jsonResponse.getString("error"));
            }

            JSONArray choices = jsonResponse.getJSONArray("choices");
            if (choices != null && !choices.isEmpty()) {
                return choices.getJSONObject(0).getJSONObject("message").getString("content");
            } else {
                return "";
            }
        }
    }
}
