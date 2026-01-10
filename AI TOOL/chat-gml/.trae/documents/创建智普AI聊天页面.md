## 创建类似DeepSeek的聊天页面

### 技术方案
使用纯 HTML + CSS + JavaScript 实现，无需构建工具，简单直接。

### 实现步骤

1. **创建 index.html** - 主页面结构
   - 顶部导航栏（标题、模型选择）
   - 聊天消息显示区域
   - 底部输入框和发送按钮

2. **创建 style.css** - 样式文件
   - 类似DeepSeek的深色主题设计
   - 响应式布局
   - 流畅的动画效果
   - 消息气泡样式（用户/AI区分）

3. **创建 script.js** - JavaScript逻辑
   - 处理用户输入和发送
   - 调用智普AI API（endpoint: `https://open.bigmodel.cn/api/paas/v4/chat/completions`）
   - 使用提供的API Key: `00b08fee86f84b33a353f45b0b0f6c0f.tBYJiYISieVqrTjA`
   - 支持多轮对话（维护消息历史）
   - 添加打字机效果显示AI回复
   - 加载状态显示
   - 错误处理

### 主要功能
- ✅ 实时聊天对话
- ✅ 多轮对话支持
- ✅ 打字机效果
- ✅ 加载动画
- ✅ 响应式设计
- ✅ 深色主题（类似DeepSeek）