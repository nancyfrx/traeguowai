#!/bin/bash

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
  echo "请使用 sudo 运行此脚本 (Please run as root)"
  exit 1
fi

echo "正在检查 Swap 状态..."
free -h

# 如果已经有 Swap，询问是否增加
if [ $(free | awk '/^Swap:/ {print $2}') -gt 0 ]; then
    echo "系统已启用 Swap。"
    read -p "是否需要增加额外的 Swap 文件? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

echo "正在创建 4GB Swap 文件..."
# 创建 4GB 的 swap 文件
fallocate -l 4G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=4096

# 设置权限
chmod 600 /swapfile

# 格式化为 swap
mkswap /swapfile

# 启用 swap
swapon /swapfile

# 写入 fstab 确保重启后生效
if ! grep -q "/swapfile" /etc/fstab; then
    echo "/swapfile none swap sw 0 0" >> /etc/fstab
fi

echo "Swap 创建成功！"
free -h

echo "优化系统 Swappiness..."
# 将 swappiness 设置为 10 (尽量使用物理内存)
sysctl vm.swappiness=10
if ! grep -q "vm.swappiness" /etc/sysctl.conf; then
    echo "vm.swappiness=10" >> /etc/sysctl.conf
fi

echo "完成！现在您可以尝试重新构建项目了。"
