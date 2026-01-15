#!/bin/bash

# =================================================================
# fengruxue 项目管理平台 - 本地一键启动脚本
# =================================================================

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 正在启动 fengruxue 项目管理平台所有服务...${NC}"

# 1. 检查并启动 MySQL
echo -e "\n${YELLOW}Step 1: 检查 MySQL 服务...${NC}"
if ! pgrep -x "mysqld" > /dev/null; then
    echo -e "正在尝试启动 MySQL..."
    if command -v mysql.server >/dev/null 2>&1; then
        mysql.server start
    elif command -v systemctl >/dev/null 2>&1; then
        sudo systemctl start mysql
    else
        echo -e "${RED}❌ 未能自动启动 MySQL，请手动启动并确保端口 3306 可用。${NC}"
    fi
else
    echo -e "${GREEN}✅ MySQL 已经在运行中。${NC}"
fi

# 2. 检查数据库并导入数据
echo -e "\n${YELLOW}Step 2: 检查数据库 blog_db...${NC}"
MYSQL_CMD="mysql -u root -p123456"
if $MYSQL_CMD -e "use blog_db" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ 数据库 blog_db 已存在。${NC}"
else
    echo -e "正在创建数据库 blog_db 并导入备份数据..."
    $MYSQL_CMD -e "CREATE DATABASE IF NOT EXISTS blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
    if [ -f "blog_db_backup.sql" ]; then
        $MYSQL_CMD blog_db < blog_db_backup.sql
        echo -e "${GREEN}✅ 数据导入成功。${NC}"
    else
        echo -e "${RED}⚠️ 未找到 blog_db_backup.sql，将启动空数据库。${NC}"
    fi
fi

# 3. 杀死可能冲突的端口
echo -e "\n${YELLOW}Step 3: 清理端口冲突...${NC}"
PORTS=(3000 5173 5174 5175 5176 5177 5179 8080)
for port in "${PORTS[@]}"; do
    pid=$(lsof -t -i:$port)
    if [ ! -z "$pid" ]; then
        echo -e "正在关闭占用端口 $port 的进程 (PID: $pid)..."
        kill -9 $pid
    fi
done

# 4. 启动后端服务
echo -e "\n${YELLOW}Step 4: 启动后端服务...${NC}"

# 启动博客后端 (Spring Boot)
echo -e "启动 艺术市场后端 (Port: 8080)..."
cd web/blog/backend
./mvnw spring-boot:run > /dev/null 2>&1 &
cd ../../../

# 5. 启动前端服务
echo -e "\n${YELLOW}Step 5: 启动前端服务...${NC}"

# 启动项目管理平台主页
echo -e "启动 项目管理平台 (Port: 3000)..."
npx serve web_dist -l 3000 > /dev/null 2>&1 &

# 启动艺术市场前端
echo -e "启动 艺术市场前端 (Port: 5175)..."
cd web/blog/frontend
npm run dev -- --port 5175 --host > /dev/null 2>&1 &
cd ../../../

# 启动其他 APP 菜单项
echo -e "启动 QQ音乐 (Port: 5174)..."
cd APP/QQMusic
npm run dev -- --port 5174 --host > /dev/null 2>&1 &
cd ../../

echo -e "启动 抖音 (Port: 5173)..."
cd APP/douyin
npm run dev -- --port 5173 --host > /dev/null 2>&1 &
cd ../../

echo -e "启动 高德扫街 (Port: 5177)..."
cd APP/amap-ranking
npm run dev -- --port 5177 --host > /dev/null 2>&1 &
cd ../../

echo -e "启动 新版微信 (Port: 5179)..."
cd APP/weixin
npm run dev -- --port 5179 --host > /dev/null 2>&1 &
cd ../../

echo -e "启动 万年历 (Port: 5176)..."
cd other/rili
npm run dev -- --port 5176 --host > /dev/null 2>&1 &
cd ../../

echo -e "\n${GREEN}✨ 所有服务已在后台启动！${NC}"
echo -e "------------------------------------------------"
echo -e "项目管理平台: ${BLUE}http://localhost:3000${NC}"
echo -e "艺术市场 (WEB): ${BLUE}http://localhost:5175/art/${NC}"
echo -e "艺术市场后端: ${BLUE}http://localhost:8080${NC}"
echo -e "------------------------------------------------"
echo -e "提示: 使用 'lsof -i :端口号' 查看服务状态"
echo -e "使用 'kill \$(lsof -t -i:端口号)' 停止特定服务"
echo -e "\n按 Ctrl+C 仅停止本脚本（服务将继续在后台运行）"

# 保持脚本运行，方便查看输出或等待
wait
