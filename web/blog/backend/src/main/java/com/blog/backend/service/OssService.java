package com.blog.backend.service;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.model.OSSObject;
import com.aliyun.oss.model.ObjectMetadata;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Date;
import java.util.UUID;

@Service
public class OssService {

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

    private OSS ossClient;

    private OSS getOssClient() {
        if (ossClient == null) {
            if (hasValidCredentials()) {
                ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
            }
        }
        return ossClient;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        System.out.println("Starting uploadFile for: " + originalFilename);
        
        OSS client = getOssClient();
        if (client == null) {
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
            
            byte[] bytes = file.getBytes();
            if (bytes == null || bytes.length == 0) {
                throw new IOException("文件内容为空");
            }

            try (InputStream inputStream = new ByteArrayInputStream(bytes)) {
                client.putObject(bucketName, objectName, inputStream, metadata);
            }
            
            String ossUrl = baseUrl + filename;
            System.out.println("Upload successful. URL: " + ossUrl);
            return ossUrl;
        } catch (com.aliyun.oss.OSSException oe) {
            System.err.println("OSS Server Error: " + oe.getErrorCode() + " - " + oe.getErrorMessage());
            throw new IOException("OSS Server Error: [" + oe.getErrorCode() + "] " + oe.getErrorMessage(), oe);
        } catch (com.aliyun.oss.ClientException ce) {
            System.err.println("OSS Client Error: " + ce.getMessage());
            ce.printStackTrace();
            throw new IOException("OSS Client Error: " + ce.getMessage(), ce);
        }
    }

    public boolean hasValidCredentials() {
        return accessKeyId != null && !accessKeyId.isEmpty() && !accessKeyId.contains("${") &&
               accessKeySecret != null && !accessKeySecret.isEmpty() && !accessKeySecret.contains("${");
    }

    public void downloadToStream(String objectName, java.io.OutputStream outputStream) throws IOException {
        if (objectName.startsWith("http")) {
            if (objectName.contains(baseUrl)) {
                objectName = prefix + objectName.substring(baseUrl.length());
            } else if (objectName.contains(".aliyuncs.com/")) {
                objectName = objectName.substring(objectName.indexOf(".aliyuncs.com/") + ".aliyuncs.com/".length());
            }
        } else if (!objectName.startsWith(prefix)) {
            objectName = prefix + objectName;
        }

        if (objectName.contains("?")) {
            objectName = objectName.substring(0, objectName.indexOf("?"));
        }

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
            if (objectName.contains(baseUrl)) {
                objectName = prefix + objectName.substring(baseUrl.length());
            } else if (objectName.contains(".aliyuncs.com/")) {
                objectName = objectName.substring(objectName.indexOf(".aliyuncs.com/") + ".aliyuncs.com/".length());
            }
        } else if (!objectName.startsWith(prefix)) {
            objectName = prefix + objectName;
        }

        if (objectName.contains("?")) {
            objectName = objectName.substring(0, objectName.indexOf("?"));
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

    public String getProxyUrl(String objectName) {
        if (objectName == null) return null;
        if (objectName.startsWith("/api/upload/view") || objectName.contains("/api/upload/view")) {
            return objectName;
        }
        String path = objectName;
        if (objectName.startsWith("http")) {
            if (objectName.contains(baseUrl)) {
                path = prefix + objectName.substring(baseUrl.length());
            } else if (objectName.contains(".aliyuncs.com/")) {
                path = objectName.substring(objectName.indexOf(".aliyuncs.com/") + ".aliyuncs.com/".length());
            }
        } else if (!objectName.startsWith(prefix)) {
            path = prefix + objectName;
        }
        if (path.contains("?")) {
            path = path.substring(0, path.indexOf("?"));
        }
        return "/api/upload/view?path=" + path;
    }

    public String getSignedUrl(String objectName) {
        if (objectName == null || !objectName.startsWith("http")) {
            return objectName;
        }

        OSS client = getOssClient();
        if (client == null) {
            return objectName;
        }

        String key = objectName;
        if (objectName.contains(baseUrl)) {
            key = prefix + objectName.substring(baseUrl.length());
        } else if (objectName.contains(".aliyuncs.com/")) {
            key = objectName.substring(objectName.indexOf(".aliyuncs.com/") + ".aliyuncs.com/".length());
        }

        try {
            Date expiration = new Date(new Date().getTime() + 3600 * 1000);
            URL url = client.generatePresignedUrl(bucketName, key, expiration);
            return url.toString();
        } catch (Exception e) {
            System.err.println("Error generating signed URL for " + objectName + ": " + e.getMessage());
            return objectName;
        }
    }
}
