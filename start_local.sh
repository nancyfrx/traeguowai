#!/bin/bash

# =================================================================
# traeguowai 全项目本地一键启动脚本 (V2.0 增强版)
# =================================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 获取项目根目录绝对路径
ROOT_DIR=$(pwd)

# 创建日志目录
mkdir -p "$ROOT_DIR/logs"

echo -e "${BLUE}===================================================${NC}"
echo -e "${BLUE}🚀 正在初始化 traeguowai 本地开发环境...${NC}"
echo -e "${BLUE}===================================================${NC}"

# 端口检查函数
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0 # 端口被占用
    else
        return 1 # 端口可用
    fi
}

# 启动前端函数 (Vite/Node)
start_frontend() {
    local path=$1
    local name=$2
    local port=$3
    
    echo -n -e "📦 正在启动 $name (端口:$port)... "
    
    if check_port $port; then
        echo -e "${YELLOW}[跳过] 端口 $port 已被占用${NC}"
    else
        cd "$path" && npm install > /dev/null 2>&1
        nohup npm run dev -- --port $port > "$ROOT_DIR/logs/${name}.log" 2>&1 &
        echo -e "${GREEN}[成功] 日志: logs/${name}.log${NC}"
        cd - > /dev/null
    fi
}

# 启动后端函数 (Spring Boot)
start_backend() {
    local path=$1
    local name=$2
    local port=$3
    
    echo -n -e "☕ 正在启动 $name (端口:$port)... "
    
    if check_port $port; then
        echo -e "${YELLOW}[跳过] 端口 $port 已被占用${NC}"
    else
        cd "$path"
        nohup ./mvnw spring-boot:run > "$ROOT_DIR/logs/${name}.log" 2>&1 &
        echo -e "${GREEN}[启动中] 日志: logs/${name}.log${NC}"
        cd - > /dev/null
    fi
}

# 1. 启动后端服务
echo -e "\n${PURPLE}--- 正在启动后端服务 ---${NC}"
start_backend "APP/blog/backend" "blog-backend" 8080

# 2. 启动前端服务
echo -e "\n${CYAN}--- 正在启动前端服务 ---${NC}"
# 首先启动管理平台主入口 (使用 npx serve 或 python)
echo -n -e "🏠 正在启动管理平台主入口 (端口:8082)... "
if check_port 8082; then
    echo -e "${YELLOW}[跳过] 端口 8082 已被占用${NC}"
else
    # 尝试使用 npx serve，如果没有则使用 python
    if command -v npx > /dev/null 2>&1; then
        nohup npx serve -p 8082 . > "logs/main-platform.log" 2>&1 &
    else
        nohup python3 -m http.server 8082 > "logs/main-platform.log" 2>&1 &
    fi
    echo -e "${GREEN}[成功]${NC}"
fi

start_frontend "APP/QQMusic" "QQMusic" 3000
start_frontend "APP/douyin" "Douyin" 5173
start_frontend "APP/blog/frontend" "Art-Market" 5175
start_frontend "other/rili" "Calendar" 5176
start_frontend "APP/amap-ranking" "AMap" 5177
start_frontend "APP/weixin" "Wechat-New" 5179

echo -e "\n${BLUE}===================================================${NC}"
echo -e "${GREEN}🎉 所有服务指令已发出！${NC}"
echo -e "${YELLOW}提示：Java 后端启动较慢，请等待 10-20 秒后访问。${NC}"
echo -e "${BLUE}---------------------------------------------------${NC}"
echo -e "🏠 项目管理入口: ${CYAN}http://localhost:8082${NC}"
echo -e "🎨 艺术市场:     ${CYAN}http://localhost:5175${NC}"
echo -e "🎵 QQ 音乐:      ${CYAN}http://localhost:3000${NC}"
echo -e "📍 高德扫街:     ${CYAN}http://localhost:5177${NC}"
echo -e "${BLUE}===================================================${NC}"
echo -e "使用 ${RED}./stop_local.sh${NC} 可以停止所有服务。"
