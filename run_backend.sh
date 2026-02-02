#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$SCRIPT_DIR"

# 设置日志目录
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"

# 停止旧的后端进程
echo "🛑 停止旧的后端进程..."
PID=$(lsof -t -i:8081)
if [ ! -z "$PID" ]; then
    kill -9 $PID
fi

# 切换到后端目录
cd "$ROOT_DIR/web/test_platform/backend" || exit

# 编译后端
echo "📦 编译后端..."
chmod +x mvnw
./mvnw clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "❌ 后端编译失败"
    exit 1
fi

# 启动后端
echo "🚀 启动后端 (Headless 模式)..."
# 注意：直接从系统环境变量读取 OSS 和数据库配置
nohup java -Xmx512m -Djava.awt.headless=true -jar \
  target/backend-0.0.1-SNAPSHOT.jar > "$LOG_DIR/backend.log" 2>&1 &

echo "✅ 后端已在后台启动，日志文件: $LOG_DIR/backend.log"
