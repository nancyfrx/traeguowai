const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatContainer = document.getElementById('chatContainer');
const welcomeScreen = document.getElementById('welcomeScreen');
const newChatBtn = document.getElementById('newChatBtn');
const historyList = document.getElementById('historyList');
const modelSelector = document.getElementById('modelSelector');
const mediaModal = document.getElementById('mediaModal');
const modalMediaContainer = document.getElementById('modalMediaContainer');
const modalDownloadBtn = document.getElementById('modalDownloadBtn');
const closeModal = document.querySelector('.close-modal');

// Config
const ZHIPU_KEY = '00b08fee86f84b33a353f45b0b0f6c0f.tBYJiYISieVqrTjA';
const [API_ID, API_SECRET] = ZHIPU_KEY.split('.');

// State
let currentChatId = Date.now().toString();
let chats = JSON.parse(localStorage.getItem('deepseek_chats') || '{}');
let isGenerating = false;

// Initialize
initHistory();
messageInput.focus();

// --- API Helpers ---

async function generateJWT() {
    const header = { alg: 'HS256', sign_type: 'SIGN' };
    const now = Date.now();
    const payload = {
        api_key: API_ID,
        exp: now + 3600000,
        timestamp: now
    };

    const sHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
    const sPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');
    const unsignedToken = `${sHeader}.${sPayload}`;

    // 优先使用 CryptoJS (支持 HTTP 环境)
    if (typeof CryptoJS !== 'undefined') {
        try {
            const signature = CryptoJS.HmacSHA256(unsignedToken, API_SECRET);
            const sSignature = CryptoJS.enc.Base64.stringify(signature)
                .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            return `${unsignedToken}.${sSignature}`;
        } catch (e) {
            console.error('CryptoJS 签名失败:', e);
        }
    }

    // 回退到原生 Crypto API (仅 HTTPS 可用)
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error('当前环境安全限制导致签名失败。已尝试加载 CryptoJS 但未成功，请检查网络或使用 HTTPS 访问。');
    }

    const encoder = new TextEncoder();
    const keyData = encoder.encode(API_SECRET);
    const cryptoKey = await crypto.subtle.importKey(
        'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(unsignedToken));
    
    const sSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    return `${unsignedToken}.${sSignature}`;
}

async function callZhipu(endpoint, data) {
    const token = await generateJWT();
    const response = await fetch(`https://open.bigmodel.cn/api/paas/v4/${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

// --- Chat Logic ---

function initHistory() {
    historyList.innerHTML = '';
    const sortedIds = Object.keys(chats).sort((a, b) => b - a);
    sortedIds.forEach(id => {
        const chat = chats[id];
        const item = document.createElement('div');
        item.className = `history-item ${id === currentChatId ? 'active' : ''}`;
        item.textContent = chat.title || '新对话';
        item.onclick = () => loadChat(id);
        historyList.appendChild(item);
    });
}

function loadChat(id) {
    currentChatId = id;
    chatContainer.innerHTML = '';
    const chat = chats[id];
    if (chat && chat.messages && chat.messages.length > 0) {
        welcomeScreen.style.display = 'none';
        chat.messages.forEach(msg => addMessageUI(msg.content, msg.role, msg.type, msg.mediaUrl));
    } else {
        chatContainer.appendChild(welcomeScreen);
        welcomeScreen.style.display = 'block';
    }
    initHistory();
}

function saveCurrentChat(message, role, type = 'text', mediaUrl = null) {
    if (!chats[currentChatId]) {
        chats[currentChatId] = {
            title: message.substring(0, 20),
            messages: []
        };
    }
    chats[currentChatId].messages.push({ role, content: message, type, mediaUrl });
    localStorage.setItem('deepseek_chats', JSON.stringify(chats));
    initHistory();
}

async function sendMessage() {
    if (isGenerating) return;
    const text = messageInput.value.trim();
    if (!text) return;

    const model = modelSelector.value;
    welcomeScreen.style.display = 'none';

    // User Message
    addMessageUI(text, 'user');
    saveCurrentChat(text, 'user');

    messageInput.value = '';
    messageInput.disabled = true;
    sendButton.disabled = true;
    isGenerating = true;

    // AI Message Placeholder
    const aiMsgDiv = addMessageUI('', 'ai', 'loading');

    try {
        if (model === 'glm-4-flash') {
            const data = await callZhipu('chat/completions', {
                model: 'glm-4-flash',
                messages: [{ role: 'user', content: text }]
            });
            const responseText = data.choices[0].message.content;
            updateMessageUI(aiMsgDiv, responseText, 'text');
            saveCurrentChat(responseText, 'ai');
        } 
        else if (model === 'cogview-3-flash') {
            const data = await callZhipu('images/generations', {
                model: 'cogview-3-flash',
                prompt: text
            });
            const imageUrl = data.data[0].url;
            updateMessageUI(aiMsgDiv, '已为你生成图片：', 'image', imageUrl);
            saveCurrentChat('已为你生成图片', 'ai', 'image', imageUrl);
        }
        else if (model === 'cogvideoX-flash') {
            const data = await callZhipu('videos/generations', {
                model: 'cogvideoX-flash',
                prompt: text
            });
            const taskId = data.id;
            updateMessageUI(aiMsgDiv, '视频正在生成中，请稍候...', 'text');
            
            // Poll for video
            pollVideoStatus(taskId, aiMsgDiv);
        }
    } catch (error) {
        console.error(error);
        updateMessageUI(aiMsgDiv, '抱歉，发生了错误：' + error.message, 'text');
    } finally {
        isGenerating = false;
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
    }
}

async function pollVideoStatus(taskId, aiMsgDiv) {
    const checkStatus = async () => {
        try {
            const token = await generateJWT();
            const response = await fetch(`https://open.bigmodel.cn/api/paas/v4/async-result/${taskId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (data.task_status === 'SUCCESS') {
                const videoUrl = data.video_result[0].url;
                updateMessageUI(aiMsgDiv, '已为你生成视频：', 'video', videoUrl);
                saveCurrentChat('已为你生成视频', 'ai', 'video', videoUrl);
                return true;
            } else if (data.task_status === 'FAIL') {
                updateMessageUI(aiMsgDiv, '视频生成失败。', 'text');
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return true;
        }
    };

    const interval = setInterval(async () => {
        const done = await checkStatus();
        if (done) clearInterval(interval);
    }, 5000);
}

// --- UI Helpers ---

function addMessageUI(content, role, type = 'text', mediaUrl = null) {
    const row = document.createElement('div');
    row.className = `message-row ${role}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (type === 'loading') {
        contentDiv.innerHTML = '<div class="loading-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
    } else {
        renderMessageContent(contentDiv, content, type, mediaUrl);
    }
    
    row.appendChild(contentDiv);
    chatContainer.appendChild(row);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return contentDiv;
}

function updateMessageUI(div, content, type, mediaUrl = null) {
    div.innerHTML = '';
    renderMessageContent(div, content, type, mediaUrl);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function renderMessageContent(container, content, type, mediaUrl) {
    const textSpan = document.createElement('span');
    textSpan.textContent = content;
    container.appendChild(textSpan);

    if (type === 'image' && mediaUrl) {
        const mediaWrap = document.createElement('div');
        mediaWrap.className = 'media-container';
        const img = document.createElement('img');
        img.src = mediaUrl;
        img.onclick = () => openPreview(mediaUrl, 'image');
        mediaWrap.appendChild(img);
        
        const actions = document.createElement('div');
        actions.className = 'media-actions';
        actions.innerHTML = `<button class="action-btn" onclick="downloadMedia('${mediaUrl}', 'image.png')">下载图片</button>`;
        
        container.appendChild(mediaWrap);
        container.appendChild(actions);
    }

    if (type === 'video' && mediaUrl) {
        const mediaWrap = document.createElement('div');
        mediaWrap.className = 'media-container';
        const video = document.createElement('video');
        video.src = mediaUrl;
        video.controls = true;
        video.onclick = () => openPreview(mediaUrl, 'video');
        mediaWrap.appendChild(video);

        const actions = document.createElement('div');
        actions.className = 'media-actions';
        actions.innerHTML = `<button class="action-btn" onclick="downloadMedia('${mediaUrl}', 'video.mp4')">下载视频</button>`;
        
        container.appendChild(mediaWrap);
        container.appendChild(actions);
    }
}

// --- Media Features ---

function openPreview(url, type) {
    modalMediaContainer.innerHTML = '';
    if (type === 'image') {
        const img = document.createElement('img');
        img.src = url;
        modalMediaContainer.appendChild(img);
    } else {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.autoplay = true;
        modalMediaContainer.appendChild(video);
    }
    
    modalDownloadBtn.onclick = () => downloadMedia(url, type === 'image' ? 'image.png' : 'video.mp4');
    mediaModal.style.display = 'flex';
}

async function downloadMedia(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
    } catch (e) {
        window.open(url, '_blank');
    }
}

// --- Event Listeners ---

messageInput.addEventListener('input', () => {
    sendButton.disabled = !messageInput.value.trim() || isGenerating;
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 200) + 'px';
});

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendButton.addEventListener('click', sendMessage);

newChatBtn.addEventListener('click', () => {
    currentChatId = Date.now().toString();
    loadChat(currentChatId);
    messageInput.focus();
});

closeModal.onclick = () => {
    mediaModal.style.display = 'none';
    modalMediaContainer.innerHTML = '';
};

window.onclick = (event) => {
    if (event.target === mediaModal) {
        mediaModal.style.display = 'none';
        modalMediaContainer.innerHTML = '';
    }
};

function setPrompt(text) {
    messageInput.value = text;
    messageInput.dispatchEvent(new Event('input'));
    messageInput.focus();
}
