#!/bin/bash

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
  echo "请使用 sudo 运行此脚本 (Please run as root)"
  exit 1
fi

echo "=== 开始部署流程 ==="

# 1. 检查并配置 Swap (解决小内存服务器构建卡死问题)
echo "1. 检查 Swap 配置..."
if [ $(free | awk '/^Swap:/ {print $2}') -eq 0 ]; then
    echo "检测到未开启 Swap，正在创建 4GB Swap 文件..."
    fallocate -l 4G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=4096
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    
    # 写入 fstab 确保重启后生效
    if ! grep -q "/swapfile" /etc/fstab; then
        echo "/swapfile none swap sw 0 0" >> /etc/fstab
    fi
    
    # 优化 swappiness
    sysctl vm.swappiness=10
    if ! grep -q "vm.swappiness" /etc/sysctl.conf; then
        echo "vm.swappiness=10" >> /etc/sysctl.conf
    fi
    echo "Swap 创建并配置成功！"
else
    echo "系统已开启 Swap，跳过创建。"
fi
free -h

# 2. 检查 Docker 环境
if ! command -v docker &> /dev/null; then
    echo "错误: 未检测到 Docker，请先安装 Docker。"
    exit 1
fi

# 3. 加载环境变量
if [ -f ../set_env.sh ]; then
    echo "2. 加载环境变量..."
    source ../set_env.sh
else
    echo "警告: 未找到 set_env.sh，将使用默认环境变量。"
fi

# 4. 启动服务
echo "3. 启动 Docker 服务..."
# 确保在 deploy 目录下
cd "$(dirname "$0")"
docker-compose up -d --build

echo "=== 部署完成 ==="
docker-compose ps
