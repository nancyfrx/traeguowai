const API_KEY = '00b08fee86f84b33a353f45b0b0f6c0f.tBYJiYISieVqrTjA';
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const IMAGE_API_URL = 'https://open.bigmodel.cn/api/paas/v4/images/generations';

let messageHistory = [];
let isLoading = false;
let currentChatId = null;
let chatHistory = [];

const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const newChatBtn = document.getElementById('newChatBtn');
const modelSelect = document.getElementById('modelSelect');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const modelTypeBadge = document.getElementById('modelTypeBadge');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');

/**
 * 修复 Crypto API 在非安全环境 (非 https/localhost) 下不可用的问题
 * 如果在 fengruxue.com 的 http 环境下，我们需要 fallback 到一个纯 JS 的实现
 */
async function generateJWT(apiKey) {
    const [id, secret] = apiKey.split('.');
    const now = Date.now();
    const payload = {
        api_key: id,
        exp: now + 3600000,
        timestamp: now
    };
    
    const header = {
        alg: 'HS256',
        sign_type: 'SIGN'
    };
    
    const base64UrlEncode = (obj) => {
        const str = JSON.stringify(obj);
        return btoa(unescape(encodeURIComponent(str)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };
    
    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(payload);
    const data = `${encodedHeader}.${encodedPayload}`;

    // 如果 crypto.subtle 不可用 (如 http 环境)，则抛出更友好的错误或提示用户
    if (!window.crypto || !window.crypto.subtle) {
        console.error('Crypto API 不可用，请确保在 HTTPS 环境下运行');
        // 如果智谱支持不带签名的鉴权或者有其他方式，可以在这里尝试
        // 但 JWT 通常必须签名，所以这里提示用户
        throw new Error('当前环境安全限制导致签名失败，请使用 HTTPS 访问以修复此问题。');
    }
    
    const hmac = new TextEncoder().encode(data);
    const key = new TextEncoder().encode(secret);
    
    try {
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            key,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, hmac);
        const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        
        return `${data}.${base64Signature}`;
    } catch (e) {
        console.error('签名生成失败:', e);
        throw e;
    }
}

async function callAI(messages) {
    try {
        const token = await generateJWT(API_KEY);
        const model = modelSelect.value;
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000,
                stream: false
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || '请求失败');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('AI 调用失败:', error);
        throw error;
    }
}

async function generateImage(prompt) {
    const token = await generateJWT(API_KEY);
    const model = modelSelect.value;
    
    const response = await fetch(IMAGE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            model: model,
            prompt: prompt
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        const errorCode = error.error?.code;
        const errorMessage = error.error?.message;
        
        if (errorCode === '1113') {
            throw new Error('图片生成需要充值或购买资源包。请访问 https://open.bigmodel.cn/ 控制台充值。');
        } else {
            throw new Error(errorMessage || '图片生成失败');
        }
    }
    
    const data = await response.json();
    return data.data[0].url;
}

function createMessageElement(content, role, isImage = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (isImage) {
        const img = document.createElement('img');
        img.src = content;
        img.alt = '生成的图片';
        img.className = 'thumbnail-image';
        img.dataset.originalUrl = content;
        contentDiv.appendChild(img);
    } else {
        contentDiv.innerHTML = formatMessage(content);
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    
    return messageDiv;
}

function formatMessage(content) {
    return content.replace(/\n/g, '<br>');
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.id = 'loadingIndicator';
    loadingDiv.innerHTML = `
        <div class="loading-dots">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
        </div>
        <span>AI正在思考...</span>
    `;
    chatContainer.appendChild(loadingDiv);
    scrollToBottom();
}

function hideLoading() {
    const loading = document.getElementById('loadingIndicator');
    if (loading) {
        loading.remove();
    }
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function typeWriter(element, text, speed = 10) {
    let i = 0;
    const formattedText = formatMessage(text);
    
    element.innerHTML = '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formattedText;
    const plainText = tempDiv.textContent;
    
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (i < plainText.length) {
                element.innerHTML = formatMessage(plainText.substring(0, i + 1));
                i++;
                scrollToBottom();
            } else {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

async function sendMessage() {
    const content = messageInput.value.trim();
    
    if (!content || isLoading) {
        return;
    }
    
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    const selectedOption = modelSelect.options[modelSelect.selectedIndex];
    const modelType = selectedOption.getAttribute('data-type');
    
    messageHistory.push({
        role: 'user',
        content: content
    });
    
    const userMessage = createMessageElement(content, 'user');
    chatContainer.appendChild(userMessage);
    
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    isLoading = true;
    sendButton.disabled = true;
    
    showLoading();
    
    try {
        if (modelType === 'image') {
            const imageUrl = await generateImage(content);
            
            messageHistory.push({
                role: 'assistant',
                content: imageUrl,
                isImage: true
            });
            
            hideLoading();
            
            const aiMessage = createMessageElement(imageUrl, 'assistant', true);
            chatContainer.appendChild(aiMessage);
            
            const imgElement = aiMessage.querySelector('img');
            if (imgElement) {
                imgElement.addEventListener('click', () => {
                    openImageModal(imageUrl);
                });
            }
        } else {
            const response = await callAI(messageHistory);
            
            messageHistory.push({
                role: 'assistant',
                content: response
            });
            
            hideLoading();
            
            const aiMessage = createMessageElement('', 'assistant');
            chatContainer.appendChild(aiMessage);
            
            await typeWriter(aiMessage.querySelector('.message-content'), response, 5);
        }
        
        saveChatHistory();
        
    } catch (error) {
        hideLoading();
        
        const errorMessage = createMessageElement(`抱歉，发生了错误：${error.message}`, 'assistant');
        chatContainer.appendChild(errorMessage);
        
        console.error('API调用失败:', error);
    } finally {
        isLoading = false;
        sendButton.disabled = false;
        scrollToBottom();
    }
}

function generateChatId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) {
        return '刚刚';
    } else if (diff < 3600000) {
        return Math.floor(diff / 60000) + '分钟前';
    } else if (diff < 86400000) {
        return Math.floor(diff / 3600000) + '小时前';
    } else if (diff < 604800000) {
        return Math.floor(diff / 86400000) + '天前';
    } else {
        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
}

function saveChatHistory() {
    if (messageHistory.length === 0) {
        return;
    }
    
    const firstUserMessage = messageHistory.find(msg => msg.role === 'user');
    if (!firstUserMessage) {
        return;
    }
    
    const title = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
    
    if (!currentChatId) {
        currentChatId = generateChatId();
    }
    
    const existingIndex = chatHistory.findIndex(chat => chat.id === currentChatId);
    
    const chatData = {
        id: currentChatId,
        title: title,
        messages: messageHistory,
        timestamp: Date.now(),
        model: modelSelect.value
    };
    
    if (existingIndex >= 0) {
        chatHistory[existingIndex] = chatData;
    } else {
        chatHistory.unshift(chatData);
    }
    
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    renderHistoryList();
}

function loadChatHistory() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
        try {
            chatHistory = JSON.parse(saved);
            renderHistoryList();
        } catch (e) {
            console.error('加载历史记录失败:', e);
            chatHistory = [];
        }
    }
}

function renderHistoryList() {
    historyList.innerHTML = '';
    
    chatHistory.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.dataset.id = chat.id;
        
        if (chat.id === currentChatId) {
            item.classList.add('active');
        }
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'history-item-title';
        titleDiv.textContent = chat.title;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'history-item-time';
        timeDiv.textContent = formatTime(chat.timestamp);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'history-item-delete';
        deleteBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        
        item.appendChild(titleDiv);
        item.appendChild(timeDiv);
        item.appendChild(deleteBtn);
        
        item.addEventListener('click', (e) => {
            if (e.target.closest('.history-item-delete')) {
                return;
            }
            loadChat(chat.id);
        });
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteChat(chat.id);
        });
        
        historyList.appendChild(item);
    });
}

function loadChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) {
        return;
    }
    
    currentChatId = chatId;
    messageHistory = [...chat.messages];
    modelSelect.value = chat.model || 'glm-4';
    updateModelTypeBadge();
    
    chatContainer.innerHTML = '';
    
    messageHistory.forEach(msg => {
        const messageElement = createMessageElement(msg.content, msg.role, msg.isImage || false, msg.isVideo || false);
        chatContainer.appendChild(messageElement);
        
        if (msg.isImage) {
            const imgElement = messageElement.querySelector('img');
            if (imgElement) {
                imgElement.addEventListener('click', () => {
                    openImageModal(msg.content);
                });
            }
        } else if (msg.isVideo) {
            const videoElement = messageElement.querySelector('video');
            if (videoElement) {
                videoElement.addEventListener('click', () => {
                    openVideoModal(msg.content);
                });
            }
        }
    });
    
    renderHistoryList();
    scrollToBottom();
}

function deleteChat(chatId) {
    chatHistory = chatHistory.filter(chat => chat.id !== chatId);
    
    if (currentChatId === chatId) {
        startNewChat();
    }
    
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    renderHistoryList();
}

function clearAllHistory() {
    if (confirm('确定要清空所有对话历史吗？此操作不可恢复。')) {
        chatHistory = [];
        localStorage.removeItem('chatHistory');
        startNewChat();
        renderHistoryList();
    }
}

function startNewChat() {
    currentChatId = null;
    messageHistory = [];
    chatContainer.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-icon">🤖</div>
            <h2>欢迎使用 AI Chat</h2>
            <p>基于智普AI大模型，为您提供智能对话服务</p>
            <div class="welcome-features">
                <div class="feature-item">
                    <span class="feature-icon">💬</span>
                    <div>
                        <strong>文本对话</strong>
                        <p>支持 GLM-4 系列模型</p>
                    </div>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🎨</span>
                    <div>
                        <strong>图片生成</strong>
                        <p>支持 CogView-3 Flash（需充值）</p>
                        <p style="font-size: 12px; margin-top: 4px; opacity: 0.7;">点击图片可放大预览</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderHistoryList();
}

function updateModelTypeBadge() {
    const selectedOption = modelSelect.options[modelSelect.selectedIndex];
    const modelType = selectedOption.getAttribute('data-type');
    
    if (modelType === 'image') {
        modelTypeBadge.textContent = '图片';
        modelTypeBadge.classList.remove('video');
        modelTypeBadge.classList.add('image');
        messageInput.placeholder = '描述您想要生成的图片...';
    } else {
        modelTypeBadge.textContent = '文本';
        modelTypeBadge.classList.remove('image', 'video');
        messageInput.placeholder = '输入消息，按 Enter 发送...';
    }
}

function openImageModal(imageUrl) {
    modalImage.src = imageUrl;
    modalImage.style.display = 'block';
    modalVideo.style.display = 'none';
    imageModal.classList.add('active');
}

function closeImageModal() {
    imageModal.classList.remove('active');
    setTimeout(() => {
        modalImage.src = '';
        modalImage.style.display = 'none';
    }, 300);
}

function closeAllModals() {
    imageModal.classList.remove('active');
    setTimeout(() => {
        modalImage.src = '';
        modalImage.style.display = 'none';
    }, 300);
}

function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
}

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

messageInput.addEventListener('input', autoResizeTextarea);

newChatBtn.addEventListener('click', startNewChat);

clearHistoryBtn.addEventListener('click', clearAllHistory);

modelSelect.addEventListener('change', updateModelTypeBadge);

modalClose.addEventListener('click', closeAllModals);

imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
        closeAllModals();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imageModal.classList.contains('active')) {
        closeAllModals();
    }
});

loadChatHistory();

updateModelTypeBadge();

messageInput.focus();
