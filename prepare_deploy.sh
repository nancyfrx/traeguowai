#!/bin/bash

# 设置部署目录
DEPLOY_DIR="./deploy/www"
ROOT_DIR=$(pwd)

# 全局设置 Node 内存限制，防止 OOM
# 512MB + swap 兜底才是正确姿势；设 1024 在 1GB 服务器上会让 OS OOM-killer 直接杀进程
export NODE_OPTIONS="--max-old-space-size=512"
echo "🔧 已设置 NODE_OPTIONS=$NODE_OPTIONS"

# 0. 构建前先确保 Swap 已启用 (低内存服务器关键步骤)
echo "💾 检查并启用 Swap..."
free -m | head -2
if [ -f /swapfile ]; then
    # 已有 swap 文件，确保挂载
    if ! swapon --show 2>/dev/null | grep -q /swapfile; then
        sudo swapon /swapfile 2>/dev/null && echo "✅ /swapfile 已启用" || echo "⚠️ /swapfile 启用失败"
    else
        echo "✅ /swapfile 已在挂载中"
    fi
else
    echo "⚠️ 无 /swapfile，尝试创建..."
    AVAIL_KB=$(df / | awk 'NR==2 {print $4}')
    if [ "$AVAIL_KB" -gt 524288 ]; then
        sudo dd if=/dev/zero of=/swapfile bs=1M count=512 2>/dev/null && \
        sudo chmod 600 /swapfile && \
        sudo mkswap /swapfile 2>/dev/null && \
        sudo swapon /swapfile && \
        echo "✅ 已创建 512MB Swap" || echo "⚠️ Swap 创建失败"
    else
        echo "⚠️ 磁盘空间不足 (${AVAIL_KB}KB)，无法创建 Swap"
    fi
fi
# 降低 swappiness，让系统优先用物理内存
sudo sysctl vm.swappiness=30 2>/dev/null || true

echo "🚀 开始准备部署文件..."

# 清理旧的部署文件
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# 1. 复制静态资源
echo "📂 复制静态资源..."
mkdir -p "$DEPLOY_DIR/AI_TOOL"
cp -r "AI_TOOL/"* "$DEPLOY_DIR/AI_TOOL/"
mkdir -p "$DEPLOY_DIR/game"
cp -r "game/"* "$DEPLOY_DIR/game/"
mkdir -p "$DEPLOY_DIR/other"
cp -r "other/"* "$DEPLOY_DIR/other/"
mkdir -p "$DEPLOY_DIR/app/wechat-clone"
cp -r "APP/wechat-clone/"* "$DEPLOY_DIR/app/wechat-clone/"

# 额外处理：如果 index.html 中的路径是 /other/docs.html，确保文件存在
if [ -f "other/docs.html" ]; then
    cp "other/docs.html" "$DEPLOY_DIR/other/"
fi

# 2. 复制主平台入口
echo "🏠 复制主平台..."
cp index.html "$DEPLOY_DIR/"
cp -r assets "$DEPLOY_DIR/" 2>/dev/null || true

# 3. 构建 Vite 项目函数
build_vite_project() {
    local project_path=$1
    local target_dir=$2
    local name=$3

    echo "📦 构建 $name..."
    cd "$ROOT_DIR/$project_path" || exit
    if [ -f "package.json" ]; then
        # 优先使用 npm ci 提高速度和稳定性
        if [ -f "package-lock.json" ]; then
            npm ci
        else
            npm install
        fi
        
        if [ $? -ne 0 ]; then
            echo "❌ $name 依赖安装失败"
            exit 1
        fi
        npm run build
        if [ $? -ne 0 ]; then
            echo "❌ $name 构建失败"
            exit 1
        fi
        mkdir -p "$ROOT_DIR/$DEPLOY_DIR/$target_dir"
        cp -r dist/* "$ROOT_DIR/$DEPLOY_DIR/$target_dir/"
        echo "✅ $name 构建完成"
    else
        echo "❌ $name 找不到 package.json"
    fi
}

# 4. 执行所有 Vite 项目构建
build_vite_project "APP/QQMusic" "app/qqmusic" "QQ音乐"
build_vite_project "APP/douyin" "app/douyin" "抖音"
build_vite_project "APP/amap-ranking" "app/amap-ranking" "高德扫街"
build_vite_project "APP/weixin" "app/weixin" "微信新版"
build_vite_project "APP/boke/frontend-react" "app/boke" "博客"
build_vite_project "web/blog/frontend" "art" "艺术市场"
build_vite_project "web/test_platform/frontend" "testplatform" "测试平台"
build_vite_project "other/rili" "other/rili" "万年历"

cd "$ROOT_DIR"

# 5. 优化生产环境的 index.html
echo "🔧 优化生产环境配置..."
# 现在 index.html 支持动态检测环境，无需再手动替换 localhost 链接
echo "跳过 index.html 链接替换 (已实现动态检测)"

# 6. 修正所有项目的 API 调用地址 (如果是静态打包后的 JS)
echo "🔗 修正 API 调用地址..."
# 适配 macOS 和 Linux 的 sed
if [[ "$OSTYPE" == "darwin"* ]]; then
    find "$DEPLOY_DIR" -name "*.js" -exec sed -i '' "s|baseURL: 'http://localhost:8080/api'|baseURL: '/api'|g" {} + 2>/dev/null
    find "$DEPLOY_DIR" -name "*.js" -exec sed -i '' "s|baseURL: 'http://localhost:8081/api'|baseURL: '/test-api'|g" {} + 2>/dev/null
else
    find "$DEPLOY_DIR" -name "*.js" -exec sed -i "s|baseURL: 'http://localhost:8080/api'|baseURL: '/api'|g" {} + 2>/dev/null
    find "$DEPLOY_DIR" -name "*.js" -exec sed -i "s|baseURL: 'http://localhost:8081/api'|baseURL: '/test-api'|g" {} + 2>/dev/null
fi

echo "✅ 所有项目构建完成！产物目录: $DEPLOY_DIR"

echo "🔄 重载 Nginx 配置..."
if command -v nginx > /dev/null; then
    sudo nginx -s reload
    echo "✅ Nginx 已重载"
else
    echo "⚠️ 未找到 nginx 命令，请手动执行 nginx -s reload"
fi

echo "-------------------------------------------"
echo "🚀 部署准备就绪！"
echo "您可以手动执行: nginx -s reload (如果 Nginx 已经运行)"
echo "-------------------------------------------"
