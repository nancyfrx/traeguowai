package com.testplatform.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.logging.Logger;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AsyncImageService {

    private static final Logger logger = Logger.getLogger(AsyncImageService.class.getName());
    private final OssService ossService;

    /**
     * 处理结果类
     */
    public static class ImageProcessResult {
        public String html;
        public Map<String, byte[]> imagesToUpload = new HashMap<>();
        public Map<String, String> contentTypes = new HashMap<>();

        public ImageProcessResult(String html) {
            this.html = html;
        }
    }

    /**
     * 提取 HTML 中的 Base64 图片，并替换为纯文件名，同时保留 HTML 格式
     * 不进行实际上传，只返回待上传的数据
     */
    public ImageProcessResult extractImages(String html) {
        if (html == null || html.isEmpty()) {
            return new ImageProcessResult(html);
        }

        ImageProcessResult result = new ImageProcessResult(null);
        StringBuilder sb = new StringBuilder();
        int lastEnd = 0;

        // 匹配完整的 img 标签
        Pattern imgTagPattern = Pattern.compile("<img\\s+([^>]*)>", Pattern.CASE_INSENSITIVE);
        Matcher imgTagMatcher = imgTagPattern.matcher(html);

        while (imgTagMatcher.find()) {
            sb.append(html, lastEnd, imgTagMatcher.start());
            String tagAttributes = imgTagMatcher.group(1);
            
            // 检查 src 是否为 Base64
            Pattern srcPattern = Pattern.compile("src=['\"](data:image/([^;]+);base64,([^'\"]+))['\"]", Pattern.CASE_INSENSITIVE);
            Matcher srcMatcher = srcPattern.matcher(tagAttributes);

            if (srcMatcher.find()) {
                String extension = srcMatcher.group(2);
                String base64Data = srcMatcher.group(3);
                
                String fileName = generateFileName(tagAttributes, extension);
                
                try {
                     byte[] imageBytes = Base64.getDecoder().decode(base64Data.trim());
                     result.imagesToUpload.put(fileName, imageBytes);
                     result.contentTypes.put(fileName, "image/" + extension);
                } catch (Exception e) {
                    logger.severe("Failed to decode Base64: " + e.getMessage());
                    fileName = "image_extract_failed";
                }

                // 替换 src 属性
                String newAttributes = tagAttributes.substring(0, srcMatcher.start()) + 
                                       "src=\"" + fileName + "\"" + 
                                       tagAttributes.substring(srcMatcher.end());
                
                // 同时替换 data-href 和 href 属性（如果存在）
                newAttributes = replaceAttributeValue(newAttributes, "data-href", fileName);
                newAttributes = replaceAttributeValue(newAttributes, "href", fileName);

                sb.append("<img ").append(newAttributes).append(">");
            } else {
                // 如果 src 不是 Base64，保留原样
                sb.append(imgTagMatcher.group(0));
            }
            lastEnd = imgTagMatcher.end();
        }
        sb.append(html.substring(lastEnd));
        
        String processedHtml = sb.toString();
        // 2. 之后再调用 cleanHtml 处理其他可能的长链接（如 OSS 签名链接）
        result.html = cleanHtml(processedHtml);
        
        return result;
    }

    private String generateFileName(String tagAttributes, String extension) {
        String originalName = null;
        Pattern altPattern = Pattern.compile("alt=['\"]([^'\"]+)['\"]", Pattern.CASE_INSENSITIVE);
        Matcher altMatcher = altPattern.matcher(tagAttributes);
        if (altMatcher.find()) {
            originalName = altMatcher.group(1);
        }
        
        String namePart;
        
        if (originalName != null && !originalName.isEmpty()) {
             // 移除扩展名
             if (originalName.toLowerCase().endsWith("." + extension.toLowerCase())) {
                 originalName = originalName.substring(0, originalName.length() - extension.length() - 1);
             }
             
             // 过滤特殊字符，只保留中文、字母、数字、点、下划线、中划线
             String sanitized = originalName.replaceAll("[^a-zA-Z0-9\\u4e00-\\u9fa5._-]", "");
             
             if (sanitized.isEmpty()) {
                 // 如果过滤后为空，生成10位随机串
                 namePart = generateRandomString(10);
             } else if (sanitized.length() > 50) { 
                 // 如果文件名过长（超过50字符），视为粘贴的乱码或生成的UUID，使用10位随机串
                 namePart = generateRandomString(10); 
             } else {
                 namePart = sanitized;
             }
        } else {
             // 如果没有alt，生成10位随机串
             namePart = generateRandomString(10);
        }
        
        // 格式：文件名_时间戳.扩展名 (或 10位随机串_时间戳.扩展名)
        return namePart + "_" + System.currentTimeMillis() + "." + extension;
    }

    private String generateRandomString(int length) {
        return UUID.randomUUID().toString().replace("-", "").substring(0, length);
    }

    private String replaceAttributeValue(String attributes, String attrName, String newValue) {
        Pattern p = Pattern.compile(attrName + "=['\"]([^'\"]*)['\"]", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(attributes);
        if (m.find()) {
            return attributes.substring(0, m.start()) + 
                   attrName + "=\"" + newValue + "\"" + 
                   attributes.substring(m.end());
        }
        return attributes;
    }

    /**
     * 异步上传图片到 OSS
     */
    @Async
    public void uploadImagesAsync(Map<String, byte[]> imagesToUpload, Map<String, String> contentTypes) {
        if (imagesToUpload == null || imagesToUpload.isEmpty()) {
            return;
        }

        logger.info("Starting async upload of " + imagesToUpload.size() + " images to OSS");
        
        if (!ossService.hasValidCredentials()) {
            logger.warning("OSS credentials are not configured (environment variables OSS_ACCESS_KEY_ID/OSS_ACCESS_KEY_SECRET are missing). Images will not be uploaded.");
            return;
        }

        imagesToUpload.forEach((fileName, bytes) -> {
            try {
                String contentType = contentTypes.getOrDefault(fileName, "image/png");
                ossService.uploadBase64Image(bytes, fileName, contentType);
                logger.info("Successfully uploaded " + fileName + " to OSS");
            } catch (Exception e) {
                logger.severe("Failed to upload " + fileName + " to OSS: " + e.getMessage());
            }
        });
    }

    /**
     * 清理 HTML 中的图片链接，保留所有 HTML 标签和格式
     * 1. 清理 data-href, href 等属性中的 Base64 数据
     * 2. 将 src, data-href, href 中的长链接（如 OSS 签名 URL）清理为纯文件名
     * 3. 兜底清理所有剩余的 Base64 数据
     */
    public String cleanHtml(String html) {
        if (html == null || html.isEmpty()) return html;
        
        // 统一处理 src, data-href, href 属性
        Pattern pattern = Pattern.compile("(src|data-href|href)=['\"]([^'\"]+?)['\"]", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(html);
        StringBuilder sb = new StringBuilder();
        int lastEnd = 0;

        while (matcher.find()) {
            String attrName = matcher.group(1);
            String value = matcher.group(2);
            
            // 1. 处理 Base64
            if (value.toLowerCase().startsWith("data:image/")) {
                sb.append(html, lastEnd, matcher.start(2));
                if ("src".equalsIgnoreCase(attrName)) {
                    // src 的 Base64 如果没被 extractImages 处理，说明有问题，替换为占位符
                    sb.append("base64_image_stripped_to_save_space");
                } else {
                    // 其他属性的 Base64 直接移除
                    sb.append("#base64_removed");
                }
                lastEnd = matcher.end(2);
                continue;
            }

            // 2. 处理 URL/路径，提取文件名
            String fileName = value;
            if (value.contains("/")) {
                // 去掉查询参数
                if (value.contains("?")) {
                    value = value.substring(0, value.indexOf("?"));
                }
                fileName = value.substring(value.lastIndexOf("/") + 1);
            }

            // 替换为纯文件名
            sb.append(html, lastEnd, matcher.start(2));
            sb.append(fileName);
            lastEnd = matcher.end(2);
        }
        sb.append(html.substring(lastEnd));
        
        return sb.toString();
    }

    /**
     * 给 HTML 中的图片链接加上 OSS 签名 URL
     */
    public String addSignedOssPrefix(String html) {
        if (html == null || html.isEmpty()) return html;
        
        // 匹配 src 属性 (只处理 src，移除 href 和 data-href 以避免重复签名和双倍请求)
        Pattern pattern = Pattern.compile("src=['\"]([^'\"]+?)['\"]", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(html);
        StringBuilder sb = new StringBuilder();
        int lastEnd = 0;

        while (matcher.find()) {
            String value = matcher.group(1);
            
            // 跳过 Base64 和占位符
            if (value.toLowerCase().startsWith("data:") || 
                value.equals("#base64_removed") || 
                value.equals("base64_image_stripped_to_save_space")) {
                continue;
            }

            // 提取文件名（如果已经是 URL，提取最后一部分）
            String key = value;
            if (value.contains("/")) {
                if (value.contains("?")) {
                    value = value.substring(0, value.indexOf("?"));
                }
                key = value.substring(value.lastIndexOf("/") + 1);
            }

            sb.append(html, lastEnd, matcher.start(1));
            sb.append(ossService.getSignedUrl(key));
            lastEnd = matcher.end(1);
        }
        sb.append(html.substring(lastEnd));
        return sb.toString();
    }

    /**
     * 给 HTML 中的图片链接加上 OSS 前缀 (保留原方法以防万一)
     */
    public String addOssPrefix(String html, String baseUrl, String prefix) {
        if (html == null || html.isEmpty()) return html;
        
        // 确保 baseUrl 以 / 结尾，prefix 不以 / 开头但以 / 结尾
        String finalBaseUrl = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
        String finalPrefix = prefix;
        if (finalPrefix.startsWith("/")) finalPrefix = finalPrefix.substring(1);
        if (!finalPrefix.isEmpty() && !finalPrefix.endsWith("/")) finalPrefix = finalPrefix + "/";

        // 匹配 src 属性
        Pattern pattern = Pattern.compile("src=['\"]([^'\"]+?)['\"]", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(html);
        StringBuilder sb = new StringBuilder();
        int lastEnd = 0;

        while (matcher.find()) {
            String src = matcher.group(1);
            // 如果 src 不是以 http 开头，且不包含 /，我们认为它是一个需要加前缀的文件名
            if (!src.toLowerCase().startsWith("http") && !src.contains("/") && !src.startsWith("data:")) {
                sb.append(html, lastEnd, matcher.start(1));
                sb.append(finalBaseUrl).append(finalPrefix).append(src);
                lastEnd = matcher.end(1);
            }
        }
        sb.append(html.substring(lastEnd));
        return sb.toString();
    }
}
