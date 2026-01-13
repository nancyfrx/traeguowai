#!/bin/bash

# =================================================================
# traeguowai 云服务器一键部署脚本 (Cloud Deployment Script)
# =================================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}===================================================${NC}"
echo -e "${BLUE}🚀 开始执行云服务器自动部署...${NC}"
echo -e "${BLUE}===================================================${NC}"

# 1. 环境准备
echo -e "\n${YELLOW}Step 1: 准备构建环境...${NC}"
ROOT_DIR=$(pwd)
WEB_DIST="$ROOT_DIR/web_dist"
mkdir -p logs
mkdir -p "$WEB_DIST"

# 2. 构建后端服务 (艺术市场)
echo -e "\n${YELLOW}Step 2: 构建 Java 后端 (艺术市场)...${NC}"
cd APP/blog/backend
chmod +x mvnw
./mvnw clean package -DskipTests
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 后端构建失败${NC}"
    exit 1
fi

# 停止旧进程并启动新进程
echo -e "🔄 正在重启后端服务..."
fuser -k 8080/tcp > /dev/null 2>&1
mkdir -p "$ROOT_DIR/logs"
# 使用绝对路径或确保在 backend 目录下执行 java -jar
nohup java -jar target/*.jar > "$ROOT_DIR/logs/blog-backend.log" 2>&1 &
echo -e "${GREEN}✅ 后端服务已在后台启动 (Port: 8080)${NC}"
cd "$ROOT_DIR"

# 3. 构建前端 Vite 项目
echo -e "\n${YELLOW}Step 3: 构建所有前端 Vite 项目...${NC}"

build_vite_app() {
    local path=$1
    local name=$2
    local dest=$3
    echo -e "📦 正在构建 $name..."
    cd "$ROOT_DIR/$path"
    
    # 检查 package.json 是否存在
    if [ ! -f "package.json" ]; then
        echo -e "${RED}  - ❌ 错误: $path 下找不到 package.json${NC}"
        return 1
    fi

    npm install --silent > /dev/null 2>&1
    npm run build > /dev/null 2>&1
    
    if [ -d "dist" ]; then
        # 创建目标目录并移动构建文件
        mkdir -p "$WEB_DIST/$dest"
        rm -rf "$WEB_DIST/$dest/*"
        cp -r dist/* "$WEB_DIST/$dest/"
        echo -e "${GREEN}  - ✅ $name 构建完成 -> web_dist/$dest${NC}"
    else
        echo -e "${RED}  - ❌ $name 构建失败: 未生成 dist 目录${NC}"
    fi
    cd "$ROOT_DIR"
}


# 构建各个子项目
build_vite_app "APP/QQMusic" "QQ 音乐" "app/qqmusic"
build_vite_app "APP/douyin" "抖音" "app/douyin"
build_vite_app "APP/amap-ranking" "高德扫街" "app/amap-ranking"
build_vite_app "APP/weixin" "新版微信" "app/weixin"
build_vite_app "APP/blog/frontend" "艺术市场前端" "app/blog"

# 特殊处理 other/rili (因为它在 other 目录下)
echo -e "📦 正在构建 万年历..."
cd "$ROOT_DIR/other/rili"
npm install --silent > /dev/null 2>&1
npm run build > /dev/null 2>&1
if [ -d "dist" ]; then
    mkdir -p "$WEB_DIST/other/rili"
    cp -r dist/* "$WEB_DIST/other/rili/"
    echo -e "${GREEN}  - ✅ 万年历 构建完成${NC}"
else
    echo -e "${RED}  - ❌ 万年历 构建失败${NC}"
fi
cd "$ROOT_DIR"

# 5. 整理所有静态资源到 web_dist
echo -e "\n${YELLOW}Step 4: 整理所有资源到 web_dist 目录...${NC}"
mkdir -p "$WEB_DIST"
cp index.html "$WEB_DIST/"
cp -r AI_TOOL "$WEB_DIST/"
cp -r game "$WEB_DIST/"
mkdir -p "$WEB_DIST/APP"
cp -r APP/wechat-clone "$WEB_DIST/APP/" 2>/dev/null || true

# 6. 部署总结与 Nginx 提示
echo -e "\n${BLUE}===================================================${NC}"
echo -e "${GREEN}🎉 部署任务完成！所有生产文件已就绪于: ${PWD}/web_dist${NC}"
echo -e "${BLUE}===================================================${NC}"
echo -e "主管理平台入口: ${CYAN}http://fengruxue.com${NC}"
echo -e "\n${YELLOW}请修改您的 Nginx 配置，将 root 指向 web_dist 目录：${NC}"
echo -e "1. Root 指向: ${PWD}/web_dist"
echo -e "2. Proxy /api 到: http://127.0.0.1:8080"
echo -e "\n您可以参考根目录下的 ${BLUE}nginx_cloud.conf${NC} 进行配置。"
echo -e "${BLUE}===================================================${NC}"
