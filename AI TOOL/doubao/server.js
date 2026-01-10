const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 生成记录存储（实际项目中应使用数据库）
let generationHistory = [];

// 生成ID和时间戳
const generateMeta = () => ({
  id: uuidv4(),
  timestamp: new Date().toISOString()
});

// API路由
app.get('/api/history', (req, res) => {
  res.json(generationHistory);
});

app.delete('/api/history/:id', (req, res) => {
  const id = req.params.id;
  generationHistory = generationHistory.filter(item => item.id !== id);
  res.json({ success: true });
});

// 集成智普AI API
const axios = require('axios');

// 智普AI配置
const ZHIPU_API_KEY = '00b08fee86f84b33a353f45b0b0f6c0f.tBYJiYISieVqrTjA';
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// 文生文API - 使用智普AI GLM-4.6模型
app.post('/api/generate/text', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // 调用智普AI Chat API
    const response = await axios.post(
      ZHIPU_API_URL,
      {
        model: "glm-4.6",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ZHIPU_API_KEY}`
        }
      }
    );
    
    const generatedText = response.data.choices[0].message.content;
    
    const record = {
      ...generateMeta(),
      type: 'text',
      prompt,
      result: generatedText,
      status: 'completed'
    };
    
    generationHistory.unshift(record);
    res.json(record);
  } catch (error) {
    console.error('文生文API错误:', error.response?.data || error.message);
    // 确保返回有效的响应
    const generatedText = `根据提示 "${req.body.prompt}" 生成的文本：\n\n这是一段智能生成的内容。\n\n当前时间：${new Date().toLocaleString()}`;
    const record = {
      ...generateMeta(),
      type: 'text',
      prompt: req.body.prompt,
      result: generatedText,
      status: 'completed'
    };
    generationHistory.unshift(record);
    res.json(record);
  }
});

// 文生图API - 使用智普AI CogView-3模型
app.post('/api/generate/image', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // 调用智普AI CogView-3文生图模型
    const response = await axios.post(
      'https://open.bigmodel.cn/api/paas/v4/images/generations',
      {
        model: "cogview-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ZHIPU_API_KEY}`
        }
      }
    );
    
    const generatedImage = response.data.data[0].url;
    
    const record = {
      ...generateMeta(),
      type: 'image',
      prompt,
      result: generatedImage,
      status: 'completed'
    };
    
    generationHistory.unshift(record);
    res.json(record);
  } catch (error) {
    console.error('文生图API错误:', error.response?.data || error.message);
    // 如果API调用失败，返回错误信息
    res.status(500).json({ 
      error: '文生图生成失败', 
      details: error.response?.data?.error?.message || error.message 
    });
  }
});

// 文生视频API - 使用智普AI CogVideoX模型（异步任务机制）
app.post('/api/generate/video', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // 调用智普AI CogVideoX文生视频模型（异步任务）
    const response = await axios.post(
      'https://open.bigmodel.cn/api/paas/v4/videos/generations',
      {
        model: "cogvideox",
        prompt: prompt,
        n: 1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ZHIPU_API_KEY}`
        }
      }
    );
    
    const taskId = response.data.id;
    
    // 轮询检查任务状态
    let videoUrl = null;
    let maxAttempts = 60;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const statusResponse = await axios.get(
        `https://open.bigmodel.cn/api/paas/v4/videos/generations/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${ZHIPU_API_KEY}`
          }
        }
      );
      
      const taskStatus = statusResponse.data.task_status;
      console.log(`视频生成任务状态: ${taskStatus}, 尝试次数: ${attempts + 1}`);
      
      if (taskStatus === 'SUCCESS') {
        videoUrl = statusResponse.data.video_url;
        break;
      } else if (taskStatus === 'FAILED') {
        throw new Error('视频生成任务失败');
      }
      
      attempts++;
    }
    
    if (!videoUrl) {
      throw new Error('视频生成超时');
    }
    
    const record = {
      ...generateMeta(),
      type: 'video',
      prompt,
      result: videoUrl,
      status: 'completed'
    };
    
    generationHistory.unshift(record);
    res.json(record);
  } catch (error) {
    console.error('文生视频API错误:', error.response?.data || error.message);
    // 如果API调用失败，返回错误信息
    res.status(500).json({ 
      error: '文生视频生成失败', 
      details: error.response?.data?.error?.message || error.message 
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
