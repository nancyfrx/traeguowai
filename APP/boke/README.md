# Minimalist Boke Project

这是一个采用前后端分离架构的个人博客系统。

## 项目结构
- `backend/`: Java Spring Boot 后端 (Port: 8081)
- `frontend-react/`: React + Vite + Tailwind CSS 前端 (Port: 3001)
- `frontend-vue/`: Vue + Vite + Tailwind CSS 前端 (Port: 3002)
- `schema.sql`: 数据库初始化脚本

## 快速开始

### 1. 数据库准备
- 确保本地 MySQL 已启动。
- 执行 `schema.sql` 脚本创建数据库和表，并导入初始数据。

### 2. 启动后端
```bash
cd backend
mvn spring-boot:run
```

### 3. 启动前端 (React)
```bash
cd frontend-react
npm install
npm run dev
```

### 4. 启动前端 (Vue)
```bash
cd frontend-vue
npm install
npm run dev
```

## 设计风格
项目采用 **简洁高级 (Minimalist & High-end)** 的视觉风格：
- 大胆的排版 (Bold Typography)
- 充足的留白 (White Space)
- 细腻的动画 (Smooth Transitions)
- 纯净的色彩方案 (Monochrome Palette)
