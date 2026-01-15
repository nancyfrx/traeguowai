package com.blog.backend.service;

import com.blog.backend.entity.Article;
import com.blog.backend.entity.SubscriptionLog;
import com.blog.backend.repository.ArticleRepository;
import com.blog.backend.repository.SubscriptionLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionLogRepository subscriptionLogRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Transactional
    public void subscribe(String email) {
        // 1. 获取随机文章
        Optional<Article> randomArticleOpt = articleRepository.findRandomArticle();
        
        if (randomArticleOpt.isPresent()) {
            Article article = randomArticleOpt.get();
            
            // 2. 模拟发送邮件 (实际生产中这里会调用邮件发送接口，如 Resend, SendGrid 或 JavaMailSender)
            System.out.println("Sending email to: " + email);
            System.out.println("Content: " + article.getTitle());
            System.out.println("Image: " + article.getCoverImage());
            
            // 3. 记录到数据库
            SubscriptionLog log = new SubscriptionLog();
            log.setEmail(email);
            log.setArticleId(article.getId());
            log.setArticleTitle(article.getTitle());
            subscriptionLogRepository.save(log);
        } else {
            // 如果没有文章，也记录一次订阅行为，但文章信息为空
            SubscriptionLog log = new SubscriptionLog();
            log.setEmail(email);
            subscriptionLogRepository.save(log);
        }
    }
}
