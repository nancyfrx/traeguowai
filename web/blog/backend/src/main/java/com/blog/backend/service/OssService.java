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

    public String uploadFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        System.out.println("Starting uploadFile for: " + originalFilename);
        
        OSS ossClient = null;
        try {
            // 直接使用配置的 endpoint，不再进行手动 clean
            ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
            
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;
            String objectName = prefix + filename;
            
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            // 注意：当使用 InputStream 上传时，如果不设置 ContentLength，SDK 可能会将流缓冲到内存中
            // 但由于我们已经手动转成了 ByteArrayInputStream，所以这里设置与否都可以
            metadata.setContentLength(file.getSize());
            
            byte[] bytes = file.getBytes();
            if (bytes == null || bytes.length == 0) {
                throw new IOException("文件内容为空");
            }

            // 使用 ByteArrayInputStream 确保流可重置 (支持 reset/mark)
            // 解决 "Failed to reset the request input stream" 报错
            try (InputStream inputStream = new ByteArrayInputStream(bytes)) {
                ossClient.putObject(bucketName, objectName, inputStream, metadata);
            }
            
            String ossUrl = baseUrl + filename;
            System.out.println("Upload successful. URL: " + ossUrl);
            return ossUrl;
        } catch (com.aliyun.oss.OSSException oe) {
            System.err.println("OSS Server Error: " + oe.getErrorCode() + " - " + oe.getErrorMessage());
            throw new IOException("OSS Server Error: [" + oe.getErrorCode() + "] " + oe.getErrorMessage(), oe);
        } catch (com.aliyun.oss.ClientException ce) {
            System.err.println("OSS Client Error: " + ce.getMessage());
            // 如果还是报错 Failed to reset，打印出详细堆栈到控制台以便调试
            ce.printStackTrace();
            throw new IOException("OSS Client Error: " + ce.getMessage(), ce);
        } finally {
            if (ossClient != null) {
                ossClient.shutdown();
            }
        }
    }

    public void downloadToStream(String objectName, java.io.OutputStream outputStream) throws IOException {
        // If the objectName is already a full URL, extract the key
        if (objectName.startsWith("http")) {
            if (objectName.contains(baseUrl)) {
                objectName = prefix + objectName.substring(baseUrl.length());
            } else if (objectName.contains(".aliyuncs.com/")) {
                objectName = objectName.substring(objectName.indexOf(".aliyuncs.com/") + ".aliyuncs.com/".length());
            }
        } else if (!objectName.startsWith(prefix)) {
            objectName = prefix + objectName;
        }

        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        try {
            OSSObject ossObject = ossClient.getObject(bucketName, objectName);
            if (ossObject != null) {
                InputStream inputStream = ossObject.getObjectContent();
                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
                inputStream.close();
            }
        } finally {
            ossClient.shutdown();
        }
    }

    public ObjectMetadata getMetadata(String objectName) {
        // If the objectName is already a full URL, extract the key
        if (objectName.startsWith("http")) {
            if (objectName.contains(baseUrl)) {
                objectName = prefix + objectName.substring(baseUrl.length());
            } else if (objectName.contains(".aliyuncs.com/")) {
                objectName = objectName.substring(objectName.indexOf(".aliyuncs.com/") + ".aliyuncs.com/".length());
            }
        } else if (!objectName.startsWith(prefix)) {
            objectName = prefix + objectName;
        }

        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        try {
            return ossClient.getObjectMetadata(bucketName, objectName);
        } finally {
            ossClient.shutdown();
        }
    }

    public String getProxyUrl(String objectName) {
        if (objectName == null) return null;
        
        // If it's already a proxy URL, return it as is
        if (objectName.startsWith("/api/upload/view") || objectName.contains("/api/upload/view")) {
            return objectName;
        }
        
        // If the objectName is already a full URL, extract the key
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

        // Return a proxy URL that points back to our server
        return "/api/upload/view?path=" + path;
    }

    public String getSignedUrl(String objectName) {
        // If the objectName is already a full URL, extract the key
        if (objectName.startsWith("http")) {
            if (objectName.contains(baseUrl)) {
                objectName = prefix + objectName.substring(baseUrl.length());
            } else if (objectName.contains(".aliyuncs.com/")) {
                objectName = objectName.substring(objectName.indexOf(".aliyuncs.com/") + ".aliyuncs.com/".length());
            }
        }

        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        try {
            // Set expiration time to 1 hour
            Date expiration = new Date(new Date().getTime() + 3600 * 1000);
            URL url = ossClient.generatePresignedUrl(bucketName, objectName, expiration);
            return url.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return baseUrl + objectName.replace(prefix, "");
        } finally {
            ossClient.shutdown();
        }
    }
}
