package com.testplatform.backend.service;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.ClientBuilderConfiguration;
import com.aliyun.oss.common.auth.CredentialsProvider;
import com.aliyun.oss.common.auth.DefaultCredentialProvider;
import com.aliyun.oss.common.comm.SignVersion;
import com.aliyun.oss.model.OSSObject;
import com.aliyun.oss.model.ObjectMetadata;
import com.aliyun.oss.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

@Service
public class OssService {

    private static final Logger logger = Logger.getLogger(OssService.class.getName());

    // 签名 URL 缓存，防止频繁请求 OSS
    private final Map<String, CachedUrl> urlCache = new ConcurrentHashMap<>();

    private static class CachedUrl {
        String url;
        long expiryTime;

        CachedUrl(String url, long expiryTime) {
            this.url = url;
            this.expiryTime = expiryTime;
        }

        boolean isExpired() {
            // 提前 5 分钟过期，防止临界点访问失败
            return System.currentTimeMillis() > (expiryTime - 5 * 60 * 1000);
        }
    }

    @Value("${aliyun.oss.endpoint}")
    private String endpoint;

    @Value("${aliyun.oss.accessKeyId}")
    private String accessKeyId;

    @Value("${aliyun.oss.accessKeySecret}")
    private String accessKeySecret;

    @Value("${aliyun.oss.bucketName}")
    private String bucketName;

    @Value("${aliyun.oss.baseUrl}")
    private String baseUrl;

    @Value("${aliyun.oss.prefix}")
    private String prefix;

    private volatile OSS ossClient;

    private OSS getOssClient() {
        if (ossClient == null) {
            synchronized (this) {
                if (ossClient == null) {
                    // 优先从环境变量读取，如果不存在则使用配置文件中的值
                    String finalAccessKeyId = System.getenv("OSS_ACCESS_KEY_ID");
                    String finalAccessKeySecret = System.getenv("OSS_ACCESS_KEY_SECRET");

                    if (finalAccessKeyId == null || finalAccessKeyId.isEmpty()) {
                        finalAccessKeyId = this.accessKeyId;
                    }
                    if (finalAccessKeySecret == null || finalAccessKeySecret.isEmpty()) {
                        finalAccessKeySecret = this.accessKeySecret;
                    }

                    if (isValidCredentials(finalAccessKeyId, finalAccessKeySecret)) {
                        try {
                            // 从 endpoint 中提取 region
                            String region = "cn-shenzhen"; // 默认值
                            if (endpoint.contains("oss-")) {
                                int start = endpoint.indexOf("oss-") + 4;
                                int end = endpoint.indexOf(".aliyuncs.com");
                                if (start > 3 && end > start) {
                                    region = endpoint.substring(start, end);
                                }
                            }
                            
                            logger.info("Initializing OSS client with region: " + region + ", endpoint: " + endpoint);
                            
                            CredentialsProvider credentialsProvider = new DefaultCredentialProvider(finalAccessKeyId, finalAccessKeySecret);
                            
                            ClientBuilderConfiguration clientBuilderConfiguration = new ClientBuilderConfiguration();
                            clientBuilderConfiguration.setSignatureVersion(SignVersion.V4);

                            ossClient = OSSClientBuilder.create()
                                    .endpoint(endpoint)
                                    .credentialsProvider(credentialsProvider)
                                    .clientConfiguration(clientBuilderConfiguration)
                                    .region(region)
                                    .build();
                        } catch (Exception e) {
                            logger.severe("Failed to initialize OSS client: " + e.getMessage());
                        }
                    } else {
                        logger.warning("Invalid OSS credentials (AK: " + (finalAccessKeyId != null ? "present" : "null") + 
                                     ", SK: " + (finalAccessKeySecret != null ? "present" : "null") + "), cannot initialize client");
                    }
                }
            }
        }
        return ossClient;
    }

    private boolean isValidCredentials(String ak, String sk) {
        return ak != null && !ak.isEmpty() && !ak.contains("${") &&
               sk != null && !sk.isEmpty() && !sk.contains("${");
    }

    public boolean hasValidCredentials() {
        String ak = System.getenv("OSS_ACCESS_KEY_ID");
        String sk = System.getenv("OSS_ACCESS_KEY_SECRET");
        if (ak == null || ak.isEmpty()) ak = this.accessKeyId;
        if (sk == null || sk.isEmpty()) sk = this.accessKeySecret;
        return isValidCredentials(ak, sk);
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        logger.info("Starting upload for file: " + originalFilename);
        
        OSS client = getOssClient();
        if (client == null) {
            logger.severe("OSS client is null - check credentials");
            throw new IOException("OSS credentials are not configured or invalid");
        }
        
        try {
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;
            String objectName = prefix + filename;
            
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());
            
            logger.info("Uploading to OSS: " + objectName + " (" + file.getSize() + " bytes)");
            
            try (InputStream inputStream = file.getInputStream()) {
                // 创建上传请求对象。
                PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, objectName, inputStream, metadata);
                // 上传文件。
                client.putObject(putObjectRequest);
            }
            
            String finalUrl = baseUrl + objectName;
            logger.info("Upload successful: " + finalUrl);
            return finalUrl;
        } catch (com.aliyun.oss.OSSException oe) {
            logger.severe("OSS Server Error: " + oe.getErrorMessage());
            throw new IOException("OSS Server Error: [" + oe.getErrorCode() + "] " + oe.getErrorMessage(), oe);
        } catch (com.aliyun.oss.ClientException ce) {
            logger.severe("OSS Client Error: " + ce.getMessage());
            throw new IOException("OSS Client Error: " + ce.getMessage(), ce);
        } catch (Exception e) {
            logger.severe("Unexpected error during upload: " + e.getMessage());
            throw new IOException("Unexpected upload error: " + e.getMessage(), e);
        }
    }

    public String uploadBase64Image(byte[] imageBytes, String fileName, String contentType) throws IOException {
        OSS client = getOssClient();
        if (client == null) {
            throw new IOException("OSS credentials are not configured or invalid");
        }

        try {
            String objectName = prefix + fileName;
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(contentType);
            metadata.setContentLength(imageBytes.length);

            try (InputStream inputStream = new ByteArrayInputStream(imageBytes)) {
                PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, objectName, inputStream, metadata);
                client.putObject(putObjectRequest);
            }

            String finalUrl = baseUrl + objectName;
            logger.info("Base64 upload successful: " + finalUrl);
            return finalUrl;
        } catch (Exception e) {
            throw new IOException("Error uploading base64 to OSS: " + e.getMessage(), e);
        }
    }

    public void downloadToStream(String objectName, java.io.OutputStream outputStream) throws IOException {
        if (objectName.startsWith("http")) {
            if (objectName.contains("/api/files/view/")) {
                objectName = objectName.substring(objectName.indexOf("/api/files/view/") + "/api/files/view/".length());
            } else if (objectName.contains(baseUrl)) {
                objectName = objectName.substring(baseUrl.length());
            } else if (objectName.contains(".aliyuncs.com/")) {
                objectName = objectName.substring(objectName.indexOf(".aliyuncs.com/") + ".aliyuncs.com/".length());
            }
        } else if (!objectName.startsWith(prefix) && !objectName.contains("/")) {
            // If it's just a filename and doesn't have the prefix, add it
            objectName = prefix + objectName;
        }

        logger.info("Downloading from OSS: " + objectName);
        OSS client = getOssClient();
        if (client == null) {
            throw new IOException("OSS credentials are not configured or invalid");
        }

        try {
            OSSObject ossObject = client.getObject(bucketName, objectName);
            if (ossObject != null) {
                try (InputStream inputStream = ossObject.getObjectContent()) {
                    byte[] buffer = new byte[8192];
                    int bytesRead;
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                        outputStream.write(buffer, 0, bytesRead);
                    }
                }
            }
        } catch (Exception e) {
            throw new IOException("Error downloading from OSS: " + e.getMessage(), e);
        }
    }

    public ObjectMetadata getMetadata(String objectName) {
        if (objectName.startsWith("http")) {
            if (objectName.contains("/api/files/view/")) {
                objectName = objectName.substring(objectName.indexOf("/api/files/view/") + "/api/files/view/".length());
            } else if (objectName.contains(baseUrl)) {
                objectName = objectName.substring(baseUrl.length());
            } else if (objectName.contains(".aliyuncs.com/")) {
                objectName = objectName.substring(objectName.indexOf(".aliyuncs.com/") + ".aliyuncs.com/".length());
            }
        } else if (!objectName.startsWith(prefix) && !objectName.contains("/")) {
            objectName = prefix + objectName;
        }

        OSS client = getOssClient();
        if (client == null) {
            return null;
        }

        try {
            return client.getObjectMetadata(bucketName, objectName);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 获取 OSS 签名 URL，有效期 1 小时
     */
    public String getSignedUrl(String objectName) {
        if (objectName == null) return null;
        
        String key = objectName;
        if (objectName.startsWith("http")) {
            if (objectName.contains(baseUrl)) {
                key = objectName.substring(baseUrl.length());
            } else if (objectName.contains(".aliyuncs.com/")) {
                key = objectName.substring(objectName.indexOf(".aliyuncs.com/") + ".aliyuncs.com/".length());
            } else if (objectName.contains("/api/files/view/")) {
                key = objectName.substring(objectName.indexOf("/api/files/view/") + "/api/files/view/".length());
            } else {
                return objectName;
            }
        } else if (objectName.contains("/api/files/view/")) {
            key = objectName.substring(objectName.indexOf("/api/files/view/") + "/api/files/view/".length());
        } else if (!key.startsWith(prefix) && !key.contains("/")) {
            key = prefix + key;
        }

        // 移除可能存在的查询参数
        if (key.contains("?")) {
            key = key.substring(0, key.indexOf("?"));
        }

        // 移除开头的斜杠
        if (key.startsWith("/")) {
            key = key.substring(1);
        }

        // 检查缓存
        CachedUrl cached = urlCache.get(key);
        if (cached != null && !cached.isExpired()) {
            return cached.url;
        }

        OSS client = getOssClient();
        if (client == null) {
            return objectName;
        }

        try {
            // 签名有效期 1 小时
            long durationMillis = 3600 * 1000;
            long expiryTime = System.currentTimeMillis() + durationMillis;
            Date expiration = new Date(expiryTime);
            
            URL url = client.generatePresignedUrl(bucketName, key, expiration);
            String signedUrl = url.toString();
            
            // 存入缓存
            urlCache.put(key, new CachedUrl(signedUrl, expiryTime));
            
            return signedUrl;
        } catch (Exception e) {
            logger.severe("Error generating signed URL for " + key + ": " + e.getMessage());
            return objectName;
        }
    }
}
