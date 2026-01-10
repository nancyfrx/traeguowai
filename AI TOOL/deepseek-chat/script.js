const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatContainer = document.getElementById('chatContainer');
const welcomeScreen = document.getElementById('welcomeScreen');
const newChatBtn = document.getElementById('newChatBtn');
const historyList = document.getElementById('historyList');

// 自动聚焦输入框
messageInput.focus();

// 监听输入，控制发送按钮状态
messageInput.addEventListener('input', () => {
    sendButton.disabled = !messageInput.value.trim();
    
    // 自动调整高度
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 200) + 'px';
});

// 处理回车发送
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// 点击发送
sendButton.addEventListener('click', sendMessage);

// 新对话
newChatBtn.addEventListener('click', () => {
    chatContainer.innerHTML = '';
    chatContainer.appendChild(welcomeScreen);
    welcomeScreen.style.display = 'block';
    messageInput.value = '';
    messageInput.focus();
});

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    // 隐藏欢迎界面
    welcomeScreen.style.display = 'none';

    // 添加用户消息
    addMessage(text, 'user');

    // 清空输入
    messageInput.value = '';
    messageInput.disabled = true;
    sendButton.disabled = true;
    messageInput.style.height = 'auto';

    // 模拟 AI 回复
    setTimeout(() => {
        const aiResponse = getMockResponse(text);
        addMessage(aiResponse, 'ai');
        messageInput.disabled = false;
        messageInput.focus();
    }, 1000);
}

function addMessage(text, role) {
    const row = document.createElement('div');
    row.className = `message-row ${role}`;
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = text;
    
    row.appendChild(content);
    chatContainer.appendChild(row);
    
    // 滚动到底部
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function setPrompt(text) {
    messageInput.value = text;
    messageInput.dispatchEvent(new Event('input'));
    messageInput.focus();
}

function getMockResponse(userInput) {
    const responses = [
        "你好！我是 DeepSeek，很高兴为你提供帮助。",
        "这是一个模拟的 AI 回复。在实际应用中，我会连接到 DeepSeek 强大的模型 API。",
        "关于你提到的 '" + userInput + "'，这是一个非常有趣的话题。我们可以深入探讨。",
        "我可以帮你分析数据、编写代码，或者仅仅是陪你聊天。你还有什么想问的吗？",
        "作为 DeepSeek-V3 模型，我拥有海量的知识库，能够回答各行各业的问题。"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}
