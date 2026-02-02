#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$SCRIPT_DIR"

# 设置日志目录
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"

# 停止旧的后端进程
echo "🛑 停止旧的后端进程..."
pkill -f "test_platform/backend" || true

# 切换到后端目录
cd "$ROOT_DIR/web/test_platform/backend" || exit

# 编译后端
echo "📦 编译后端..."
./mvnw clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "❌ 后端编译失败"
    exit 1
fi

# 启动后端
echo "🚀 启动后端..."
nohup java -jar \
  -DOSS_ACCESS_KEY_ID=${OSS_ACCESS_KEY_ID} \
  -DOSS_ACCESS_KEY_SECRET=${OSS_ACCESS_KEY_SECRET} \
  target/backend-0.0.1-SNAPSHOT.jar > "$LOG_DIR/backend.log" 2>&1 &

echo "✅ 后端已在后台启动，日志文件: $LOG_DIR/backend.log"
