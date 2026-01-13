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
mkdir -p logs
mkdir -p web_dist

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
mkdir -p ../../../logs
nohup java -jar target/*.jar > ../../../logs/blog-backend.log 2>&1 &
echo -e "${GREEN}✅ 后端服务已在后台启动 (Port: 8080)${NC}"
cd ../../../

# 3. 构建前端 Vite 项目
echo -e "\n${YELLOW}Step 3: 构建所有前端 Vite 项目...${NC}"

build_vite_app() {
    local path=$1
    local name=$2
    local dest=$3
    echo -e "📦 正在构建 $name..."
    cd "$path"
    npm install > /dev/null 2>&1
    npm run build > /dev/null 2>&1
    
    # 创建目标目录并移动构建文件
    mkdir -p "../../web_dist/$dest"
    rm -rf "../../web_dist/$dest/*"
    cp -r dist/* "../../web_dist/$dest/"
    cd ../../
    echo -e "${GREEN}  - $name 构建完成 -> web_dist/$dest${NC}"
}


# 构建各个子项目
build_vite_app "APP/QQMusic" "QQ 音乐" "app/qqmusic"
build_vite_app "APP/douyin" "抖音" "app/douyin"
build_vite_app "APP/amap-ranking" "高德扫街" "app/amap-ranking"
build_vite_app "APP/weixin" "新版微信" "app/weixin"
build_vite_app "APP/blog/frontend" "艺术市场前端" "app/blog"

# 特殊处理 other/rili (因为它在 other 目录下)
echo -e "📦 正在构建 万年历..."
cd other/rili
npm install > /dev/null 2>&1
npm run build > /dev/null 2>&1
# index.html 期望路径是 ./other/rili/index.html
# 我们将 dist 内容复制到一个专门的生产目录，或者直接在原位处理（但保留源码以便下次构建）
# 推荐做法：在根目录创建一个 web_dist 目录，统一存放所有生产文件
mkdir -p ../../web_dist/other/rili
cp -r dist/* ../../web_dist/other/rili/
cd ../../
echo -e "${GREEN}  - 万年历 构建完成${NC}"

# 5. 整理所有静态资源到 web_dist
echo -e "\n${YELLOW}Step 4: 整理所有资源到 web_dist 目录...${NC}"
mkdir -p web_dist
cp index.html web_dist/
cp -r AI_TOOL web_dist/
cp -r game web_dist/
mkdir -p web_dist/APP
cp -r APP/wechat-clone web_dist/APP/ 2>/dev/null || true

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
