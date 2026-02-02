FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .

# 设置 Maven 内存限制，防止在小内存机器上 OOM
ENV MAVEN_OPTS="-Xmx512m"

RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

FROM openjdk:17-jdk-slim
RUN apt-get update && apt-get install -y fontconfig libfreetype6 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# 创建日志目录
RUN mkdir -p /root/logs/testplatform && chmod -R 777 /root/logs/testplatform

EXPOSE 8081

# 使用环境变量配置日志路径和 Profile
ENV SPRING_PROFILES_ACTIVE=prod
ENV LOG_PATH=/root/logs/testplatform

# 限制运行内存，适配 1GB 左右内存的服务器
ENTRYPOINT ["java", "-Xmx512m", "-Djava.security.egd=file:/dev/./urandom", "-Djava.awt.headless=true", "-jar", "app.jar"]
