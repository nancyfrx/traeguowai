FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .

# 设置 Maven 内存限制
ENV MAVEN_OPTS="-Xmx512m"

RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# 限制运行内存
ENTRYPOINT ["java", "-Xmx512m", "-jar", "app.jar"]
