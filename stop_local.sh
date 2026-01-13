#!/bin/bash

# =================================================================
# traeguowai 全项目本地停止脚本
# =================================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🛑 正在停止所有 traeguowai 开发服务...${NC}"

# 1. 停止 Java 后端 (8080, 8081)
echo -n "☕ 正在停止 Java 后端... "
PIDS_JAVA=$(lsof -t -i:8080,8081)
if [ -n "$PIDS_JAVA" ]; then
    kill -9 $PIDS_JAVA
    echo -e "${GREEN}[完成]${NC}"
else
    echo -e "${RED}[未发现运行中的进程]${NC}"
fi

# 2. 停止管理平台主入口 (8082)
echo -n "🏠 正在停止管理平台主入口... "
PIDS_MAIN=$(lsof -t -i:8082)
if [ -n "$PIDS_MAIN" ]; then
    kill -9 $PIDS_MAIN
    echo -e "${GREEN}[完成]${NC}"
else
    echo -e "${RED}[未发现运行中的进程]${NC}"
fi

# 3. 停止 Node 前端 (Vite)
echo -n "📦 正在停止 Node/Vite 前端... "
# 使用 pkill 匹配 npm run dev 或 vite 相关的进程
pkill -f "node"
echo -e "${GREEN}[完成]${NC}"

# 3. 清理日志 (可选)
# rm -rf logs/*.log

echo -e "${BLUE}===================================================${NC}"
echo -e "${GREEN}✅ 所有服务已成功停止！${NC}"
echo -e "${BLUE}===================================================${NC}"
