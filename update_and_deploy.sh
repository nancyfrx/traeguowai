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
REPO_URL="https://github.com/nancyfrx/traeguowai.git"
# GitHub 加速镜像
GITHUB_PROXY="https://ghp.ci/"

echo -e "${YELLOW}🚀 开始自动化更新流程...${NC}"

# 0. 检查网络连接并决定是否使用代理
echo -e "${YELLOW}🔍 正在检查 GitHub 连接状态...${NC}"
if ! curl -I -s --connect-timeout 5 https://github.com > /dev/null; then
    echo -e "${RED}⚠️  无法直接连接 GitHub，将尝试使用加速镜像: ${GITHUB_PROXY}${NC}"
    USE_PROXY=true
else
    echo -e "${GREEN}✅ GitHub 正常连接${NC}"
    USE_PROXY=false
fi

# 1. 核心代码更新逻辑 (参考 install.sh)
update_code() {
    echo -e "${YELLOW}📥 正在同步代码...${NC}"
    
    # 如果使用了代理，修改远程地址
    if [ "$USE_PROXY" = true ]; then
        PROXY_URL="${GITHUB_PROXY}${REPO_URL}"
        echo -e "${YELLOW}🔄 使用镜像源: ${PROXY_URL}${NC}"
        git remote set-url origin "$PROXY_URL" 2>/dev/null || git remote add origin "$PROXY_URL" 2>/dev/null
    fi

    # 强制重置并拉取，确保本地修改不冲突
    git fetch --all --progress
    git reset --hard origin/master
    git pull origin master --progress
    
    # 恢复原始 URL (如果是临时切换的)
    if [ "$USE_PROXY" = true ]; then
        git remote set-url origin "$REPO_URL"
    fi
}

# 2. 识别当前环境并执行更新
if [ -f "prepare_deploy.sh" ] && [ -d "APP" ]; then
    echo -e "${GREEN}✅ 检测到当前已在项目目录中${NC}"
    update_code
elif [ -d "$PROJECT_DIR" ]; then
    echo -e "${GREEN}✅ 找到项目目录: $PROJECT_DIR${NC}"
    cd "$PROJECT_DIR" || exit
    update_code
else
    echo -e "${YELLOW}⚠️  项目目录不存在，正在执行克隆...${NC}"
    TARGET_URL=$REPO_URL
    if [ "$USE_PROXY" = true ]; then
        TARGET_URL="${GITHUB_PROXY}${REPO_URL}"
    fi
    
    git clone --progress "$TARGET_URL" "$PROJECT_DIR"
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 克隆失败，请检查网络${NC}"
        exit 1
    fi
    cd "$PROJECT_DIR" || exit
fi

# 3. 替换并赋权 /root/install.sh
if [ -f "install.sh" ]; then
    echo -e "${YELLOW}🔄 正在同步部署脚本至 $INSTALL_SH_DEST...${NC}"
    cp install.sh "$INSTALL_SH_DEST"
    chmod +x "$INSTALL_SH_DEST"
    echo -e "${GREEN}✅ 脚本同步完成${NC}"
else
    echo -e "${RED}❌ 错误: 未找到 install.sh${NC}"
    exit 1
fi

# 4. 执行最新的 install.sh
echo -e "${YELLOW}🏃 正在启动部署程序...${NC}"
echo -e "${GREEN}-------------------------------------------${NC}"
"$INSTALL_SH_DEST"
