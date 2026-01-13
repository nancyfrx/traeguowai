# 阿里云部署指南 (fengruxue.com) - 针对 Alibaba Cloud Linux 优化版

本项目已配置好 Docker 自动化部署方案。针对您遇到的 **Alibaba Cloud Linux (Alinux)** 系统兼容性问题，请按照以下更新后的步骤操作。

## 1. 准备阿里云环境
- **安全组配置**：在阿里云控制台放行端口：`80` (HTTP), `443` (HTTPS), `22` (SSH)。
- **域名解析**：将 `fengruxue.com` 和 `www.fengruxue.com` 的 **A 记录** 指向你的 ECS 公网 IP。

## 2. 本地准备工作 (在您的开发机执行)
1. 在本地终端执行打包脚本：
   ```bash
   chmod +x prepare_deploy.sh
   ./prepare_deploy.sh
   ```
   *该脚本会自动构建所有子项目并修正生产环境路径。*

## 3. 安装 Docker 环境 (在阿里云 ECS 执行)
针对 Alinux/CentOS 环境，请依次执行以下指令：

```bash
# 1. 安装基础依赖
sudo yum install -y yum-utils device-mapper-persistent-data lvm2

# 2. 添加阿里云 Docker 镜像源 (比官方脚本更稳定)
sudo yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 3. 安装 Docker 引擎与 Compose 插件
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 4. 启动并设置开机自启
sudo systemctl start docker
sudo systemctl enable docker

# 5. 配置用户组权限 (解决 group 'docker' does not exist 问题)
sudo groupadd docker || true
sudo usermod -aG docker $USER
# 激活权限 (执行后即可免 sudo 运行 docker)
newgrp docker 
```

## 4. 上传并部署项目
1. 将本地生成的 `deploy` 文件夹上传到服务器：
   ```bash
   scp -r ./deploy root@<您的服务器IP>:/root/traeguowai-deploy
   ```
2. 在服务器上启动服务：
   ```bash
   cd /root/traeguowai-deploy
   # 使用插件版命令启动
   docker compose up -d --build
   ```

## 5. 验证访问
- 访问 [http://fengruxue.com](http://fengruxue.com)
- **检查状态**：
  - 输入 `docker compose ps` 查看容器是否都在 `running` 状态。
  - 如果某个项目无法打开，请检查 Nginx 容器日志：`docker compose logs nginx`。

## 6. (可选) 配置 SSL 证书 (HTTPS)
1. 在阿里云申请免费证书并下载 Nginx 版。
2. 将 `.pem` 和 `.key` 文件放入 `deploy/nginx/ssl/`。
3. 编辑 `deploy/nginx/conf.d/default.conf` 开启 443 监听。

---
**提示**：本指南已解决 `Unsupported distribution 'alinux'` 和 `docker-compose` 找不到的问题。
