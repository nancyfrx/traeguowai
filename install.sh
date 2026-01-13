#!/bin/bash

# =================================================================
# traeguowai 云服务器一键安装与部署脚本 (Setup & Deploy Script)
# =================================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

REPO_URL="https://github.com/nancyfrx/traeguowai.git"
INSTALL_DIR="traeguowai"

echo -e "${BLUE}===================================================${NC}"
echo -e "${BLUE}🌟 欢迎使用 traeguowai 一键部署工具${NC}"
echo -e "${BLUE}===================================================${NC}"

# 1. 环境检查
echo -e "\n${YELLOW}Step 1: 正在检查系统环境...${NC}"

# 1.0 强制修复 MySQL 路径环境
export PATH=$PATH:/usr/local/mysql/bin

# 检查 Java 版本是否为 17+
check_java_version() {
    if command -v java &> /dev/null; then
        version=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
        if [ "$version" -lt 17 ]; then
            echo -e "${RED}❌ 当前 Java 版本为 $version，项目需要 Java 17 或更高版本。${NC}"
            echo -e "${YELLOW}请运行 'sudo alternatives --config java' 并选择 Java 17。${NC}"
            return 1
        fi
        echo -e "${GREEN}✅ Java 版本为 $version${NC}"
        return 0
    fi
    return 1
}

# 自动将常见的自定义安装路径加入 PATH
export PATH=$PATH:/usr/local/mysql/bin

check_cmd() {
    if ! command -v $1 &> /dev/null; then
        if command -v apt &> /dev/null; then
            echo -e "${RED}❌ 未检测到 $1, 请先安装它 (例如: sudo apt install $1)${NC}"
        elif command -v yum &> /dev/null; then
            echo -e "${RED}❌ 未检测到 $1, 请先安装它 (例如: sudo yum install $1)${NC}"
        else
            echo -e "${RED}❌ 未检测到 $1, 请手动安装它。${NC}"
        fi
        return 1
    else
        echo -e "${GREEN}✅ $1 已安装${NC}"
        return 0
    fi
}

FAILED=0
check_cmd "git" || FAILED=1
check_cmd "node" || FAILED=1
check_cmd "java" || FAILED=1
check_java_version || FAILED=1
check_cmd "javac" || FAILED=1
check_cmd "nginx" || FAILED=1
check_cmd "mysql" || FAILED=1

if [ $FAILED -eq 1 ]; then
    echo -e "\n${RED}⚠️ 请安装缺失的依赖后再运行此脚本。${NC}"
    echo -e "${YELLOW}提示: 如果缺少 javac，说明您安装的是 JRE 而非 JDK。${NC}"
    echo -e "${YELLOW}请运行: sudo yum install -y java-17-openjdk-devel${NC}"
    exit 1
fi

# 1.1 检查 MySQL 服务状态
echo -e "${YELLOW}正在检查 MySQL 服务状态...${NC}"
if ! systemctl is-active --quiet mysql && ! systemctl is-active --quiet mysqld && ! pgrep -x mysqld > /dev/null; then
    echo -e "${RED}❌ MySQL 服务未启动，正在尝试启动...${NC}"
    if [ -f "/usr/local/mysql/bin/mysqld" ]; then
        sudo /usr/local/mysql/bin/mysqld_safe --user=mysql &
        sleep 5
    else
        sudo systemctl start mysql || sudo systemctl start mysqld
    fi
    
    if ! pgrep -x mysqld > /dev/null; then
        echo -e "${RED}❌ 无法启动 MySQL 服务，请手动检查。${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ MySQL 服务运行中${NC}"

# 1.2 检查数据库表数据
echo -e "${YELLOW}正在检查数据库内容...${NC}"
ARTICLES_COUNT=$($MYSQL_BIN -u root -p123456 -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'blog_db' AND table_name = 'articles';" 2>/dev/null)
if [ "$ARTICLES_COUNT" == "0" ] || [ -z "$ARTICLES_COUNT" ]; then
    echo -e "${YELLOW}⚠️ 检测到 blog_db.articles 表不存在或数据为空${NC}"
    if [ -f "blog_db_backup.sql" ]; then
        echo -e "📦 正在自动导入备份数据..."
        $MYSQL_BIN -u root -p123456 blog_db < blog_db_backup.sql
        echo -e "${GREEN}✅ 数据导入完成${NC}"
    else
        echo -e "${RED}❌ 未找到 blog_db_backup.sql 备份文件，后端启动后可能无数据${NC}"
    fi
else
    echo -e "${GREEN}✅ 数据库已有数据${NC}"
fi

# 2. 获取代码
# 增加自动识别：如果已经在项目目录内执行，则跳过 clone
if [ -f "prepare_deploy.sh" ] && [ -d "APP" ]; then
    echo -e "\n${YELLOW}Step 2: 检测到当前已在项目目录中，正在强制拉取最新代码...${NC}"
    # 强制重置并拉取，确保本地修改不冲突
    git fetch --all
    git reset --hard origin/master
    git pull origin master
else
    if [ ! -d "$INSTALL_DIR" ]; then
        echo -e "\n${YELLOW}Step 2: 正在克隆项目代码...${NC}"
        git clone $REPO_URL
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ 克隆失败，请检查网络或 REPO_URL${NC}"
            exit 1
        fi
        cd $INSTALL_DIR
    else
        echo -e "\n${YELLOW}Step 2: 项目已存在，正在强制更新代码...${NC}"
        cd $INSTALL_DIR
        git fetch --all
        git reset --hard origin/master
        git pull origin master
    fi
fi

# 2.1 同步最新的 install.sh 到 /root 目录
echo -e "\n${YELLOW}Step 2.1: 正在同步 install.sh 到 /root 目录...${NC}"
if [ -f "install.sh" ]; then
    cp install.sh /root/install.sh
    chmod +x /root/install.sh
    echo -e "${GREEN}✅ /root/install.sh 已更新${NC}"
else
    echo -e "${RED}❌ 未能在当前目录找到 install.sh${NC}"
fi

# 3. 执行前端部署脚本
echo -e "\n${YELLOW}Step 3: 启动自动化构建与前端部署...${NC}"
chmod +x prepare_deploy.sh
./prepare_deploy.sh
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 前端部署脚本执行失败，请查看上方错误信息${NC}"
    exit 1
fi

# 3.1 构建并启动后端服务
echo -e "\n${YELLOW}Step 3.1: 正在构建并启动后端服务...${NC}"
cd APP/blog/backend
chmod +x mvnw
./mvnw clean package -DskipTests
if [ $? -eq 0 ]; then
    # 停止旧进程
    PID=$(pgrep -f "backend-0.0.1-SNAPSHOT.jar")
    if [ ! -z "$PID" ]; then
        echo "正在停止旧的后端进程 (PID: $PID)..."
        kill -9 $PID
    fi
    
    mkdir -p ../../../logs
    nohup java -jar target/backend-0.0.1-SNAPSHOT.jar > ../../../logs/blog-backend.log 2>&1 &
    echo -e "${GREEN}✅ 后端服务已启动，日志: logs/blog-backend.log${NC}"
else
    echo -e "${RED}❌ 后端构建失败${NC}"
fi
cd ../../../

# 4. 自动配置 Nginx 模板
echo -e "\n${YELLOW}Step 4: 正在根据当前环境优化 Nginx 配置...${NC}"
PROJECT_PATH=$(pwd)
# 使用 | 作为分隔符，避免路径中的 / 冲突
# 兼容不同版本的 sed
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|root .*;|root $PROJECT_PATH/web_dist;|" nginx_cloud.conf
    sed -i '' "s|alias .*/web_dist/app/qqmusic/covers/;|alias $PROJECT_PATH/web_dist/app/qqmusic/covers/;|" nginx_cloud.conf
    sed -i '' "s|alias .*/web_dist/app/qqmusic/songs/;|alias $PROJECT_PATH/web_dist/app/qqmusic/songs/;|" nginx_cloud.conf
else
    sed -i "s|root .*;|root $PROJECT_PATH/web_dist;|" nginx_cloud.conf
    sed -i "s|alias .*/web_dist/app/qqmusic/covers/;|alias $PROJECT_PATH/web_dist/app/qqmusic/covers/;|" nginx_cloud.conf
    sed -i "s|alias .*/web_dist/app/qqmusic/songs/;|alias $PROJECT_PATH/web_dist/app/qqmusic/songs/;|" nginx_cloud.conf
fi
echo -e "${GREEN}✅ Nginx 配置文件已指向: $PROJECT_PATH/web_dist${NC}"

# 4.1 自动修复权限 (解决 500/403 错误)
echo -e "${YELLOW}正在修复目录权限...${NC}"
# 尝试修复 /root 权限，如果是 root 用户则可能需要
if [ "$USER" == "root" ]; then
    chmod +x /root
fi
chmod -R 755 "$PROJECT_PATH/web_dist"
echo -e "${GREEN}✅ 权限已修复${NC}"

# 4.2 智能检测 Nginx 配置目录并自动部署
if [ -d "/usr/local/nginx/conf/vhost" ]; then
    NGINX_CONF_DEST="/usr/local/nginx/conf/vhost/traeguowai.conf"
elif [ -d "/etc/nginx/conf.d" ]; then
    NGINX_CONF_DEST="/etc/nginx/conf.d/traeguowai.conf"
else
    NGINX_CONF_DEST="/etc/nginx/conf.d/traeguowai.conf"
    sudo mkdir -p /etc/nginx/conf.d
fi

echo -e "${YELLOW}正在部署 Nginx 配置到: $NGINX_CONF_DEST ...${NC}"
sudo cp nginx_cloud.conf "$NGINX_CONF_DEST"
sudo nginx -t && sudo nginx -s reload
echo -e "${GREEN}✅ Nginx 配置已更新并重新加载${NC}"

# 5. 完成提示
echo -e "\n${BLUE}===================================================${NC}"
echo -e "${GREEN}🚀 全部部署流程已完成！${NC}"
echo -e "${BLUE}===================================================${NC}"
echo -e "\n${YELLOW}项目信息:${NC}"
echo -e "- 站点入口: ${YELLOW}http://fengruxue.com${NC}"
echo -e "- 后端接口: ${YELLOW}http://127.0.0.1:8080${NC}"
echo -e "- 后端日志: ${YELLOW}tail -f logs/blog-backend.log${NC}"
echo -e "${BLUE}===================================================${NC}"
