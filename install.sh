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

# 2. 获取代码
if [ ! -d "$INSTALL_DIR" ]; then
    echo -e "\n${YELLOW}Step 2: 正在克隆项目代码...${NC}"
    git clone $REPO_URL
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 克隆失败，请检查网络或 REPO_URL${NC}"
        exit 1
    fi
    cd $INSTALL_DIR
else
    echo -e "\n${YELLOW}Step 2: 项目已存在，正在更新代码...${NC}"
    cd $INSTALL_DIR
    git pull origin master
fi

# 3. 执行部署脚本
echo -e "\n${YELLOW}Step 3: 启动自动化构建与服务部署...${NC}"
chmod +x deploy_cloud.sh
./deploy_cloud.sh
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 部署脚本执行失败，请查看上方错误信息${NC}"
    exit 1
fi

# 4. 自动配置 Nginx 模板
echo -e "\n${YELLOW}Step 4: 正在根据当前环境优化 Nginx 配置...${NC}"
PROJECT_PATH=$(pwd)
# 使用 | 作为分隔符，避免路径中的 / 冲突
sed -i "s|root .*;|root $PROJECT_PATH/web_dist;|" nginx_cloud.conf
echo -e "${GREEN}✅ Nginx 配置文件已指向: $PROJECT_PATH/web_dist${NC}"

# 5. 完成提示
echo -e "\n${BLUE}===================================================${NC}"
echo -e "${GREEN}🚀 全部部署流程已完成！${NC}"
echo -e "${BLUE}===================================================${NC}"
echo -e "\n${YELLOW}接下来请完成最后一步 (Nginx 关联):${NC}"
NGINX_CONF_DEST="/etc/nginx/conf.d/traeguowai.conf"
echo -e "${CYAN}sudo cp nginx_cloud.conf $NGINX_CONF_DEST${NC}"
echo -e "${CYAN}sudo nginx -t && sudo systemctl reload nginx${NC}"

echo -e "\n${BLUE}项目信息:${NC}"
echo -e "- 站点入口: ${YELLOW}http://fengruxue.com${NC}"
echo -e "- 后端接口: ${YELLOW}http://127.0.0.1:8080${NC}"
echo -e "- 后端日志: ${YELLOW}tail -f logs/blog-backend.log${NC}"
echo -e "${BLUE}===================================================${NC}"
