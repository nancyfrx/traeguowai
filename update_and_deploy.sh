#!/bin/bash

# =================================================================
# traeguowai 远程更新与一键部署工具 (Auto Update & Deploy)
# =================================================================

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 配置路径
PROJECT_DIR="/root/traeguowai"
INSTALL_SH_DEST="/root/install.sh"

echo -e "${YELLOW}🚀 开始自动化更新流程...${NC}"

# 1. 检查并进入项目目录
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${GREEN}✅ 找到项目目录: $PROJECT_DIR${NC}"
    cd "$PROJECT_DIR" || exit
else
    echo -e "${RED}❌ 错误: 找不到项目目录 $PROJECT_DIR${NC}"
    echo -e "${YELLOW}提示: 请确保项目已克隆到 /root/traeguowai${NC}"
    exit 1
fi

# 2. 拉取最新代码
echo -e "${YELLOW}📥 正在从 GitHub 拉取最新代码...${NC}"
git fetch --all
git reset --hard origin/master
git pull origin master
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 代码拉取失败，请检查网络连接或 Git 配置${NC}"
    exit 1
fi

# 3. 替换 /root/install.sh
if [ -f "install.sh" ]; then
    echo -e "${YELLOW}🔄 正在更新部署脚本 $INSTALL_SH_DEST...${NC}"
    cp install.sh "$INSTALL_SH_DEST"
    # 4. 赋权
    chmod +x "$INSTALL_SH_DEST"
    echo -e "${GREEN}✅ 脚本替换并赋权成功${NC}"
else
    echo -e "${RED}❌ 错误: 项目中未找到 install.sh 文件${NC}"
    exit 1
fi

# 5. 执行最新的 install.sh
echo -e "${YELLOW}🏃 正在启动部署程序...${NC}"
echo -e "${GREEN}-------------------------------------------${NC}"
"$INSTALL_SH_DEST"
