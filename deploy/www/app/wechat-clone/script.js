// 初始化图标
lucide.createIcons();

// 状态管理
const state = {
    currentTab: 'wechat',
    activeChatId: null,
    messages: {
        'longya': [
            { type: 'received', contentType: 'image', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=baby', text: '我是老实人', time: '15:35' },
            { type: 'sent', text: '算个啥', time: '15:36' },
            { type: 'received', contentType: 'video', url: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=400', text: '上海初中英语作文题让语数英霸集体沉默了', time: '15:37' },
            { type: 'sent', contentType: 'image', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=math', text: '', time: '15:37' },
            { type: 'sent', text: '会数学或会英语的都沉默了', time: '15:38' }
        ]
    }, // 存储每个聊天 ID 的消息历史
    chats: [
        {
            id: 'longya',
            name: '龙牙',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Girl',
            lastMsg: '会数学或会英语的都沉默了',
            time: '15:38',
            unread: 0
        },
        {
            id: 'robot_ai',
            name: 'AI 助手 (GLM-4)',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=robot',
            lastMsg: '你好！我是你的 AI 助手，有什么可以帮你的吗？',
            time: '15:00',
            unread: 0,
            isRobot: true
        },
        {
            id: 'gh_1',
            name: '公众号',
            avatar: 'bg-blue',
            icon: 'file-text',
            lastMsg: '[21条]软件工程 3.0 时代：今年春节，程序员...',
            time: '14:56',
            unread: 21,
            isOfficial: true
        },
        {
            id: 'group_1',
            name: '人大 23 级应用心理学硕士',
            avatarType: 'grid',
            avatars: [
                'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=9'
            ],
            lastMsg: '[4条] 冯如雪 Gary-深圳：【通知：现场确...',
            time: '14:55',
            unread: 4
        },
        {
            id: 'user_1',
            name: '冯如雪',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
            lastMsg: '[链接] 年度反腐大片，明晚开播！',
            time: '14:51'
        },
        {
            id: 'user_random_1',
            name: '李明',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiMing',
            lastMsg: '晚上的羽毛球赛别忘了。',
            time: '14:30'
        },
        {
            id: 'user_random_2',
            name: '张伟',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangWei',
            lastMsg: '方案已经发你邮箱了。',
            time: '14:20'
        },
        {
            id: 'user_random_3',
            name: '王芳',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangFang',
            lastMsg: '好的，谢谢！',
            time: '14:18'
        },
        {
            id: 'mail',
            name: 'QQ 邮箱提醒',
            avatar: 'bg-blue',
            icon: 'mail',
            lastMsg: 'BOCHK：提防您的银行账户成为傀儡户口 Be...',
            time: '14:15'
        },
        {
            id: 'user_random_4',
            name: '赵敏',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhaoMin',
            lastMsg: '周末去爬山吗？',
            time: '14:10'
        },
        {
            id: 'news',
            name: '腾讯新闻',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=news',
            lastMsg: '美国 32 岁世界顶级翼装飞行员身亡，以约...',
            time: '14:06',
            mute: true
        },
        {
            id: 'user_random_5',
            name: '孙立',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SunLi',
            lastMsg: '收到了，多谢。',
            time: '13:50'
        },
        {
            id: 'user_random_6',
            name: '周杰',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhouJie',
            lastMsg: '明天见！',
            time: '13:45'
        },
        {
            id: 'user_random_7',
            name: '吴倩',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WuQian',
            lastMsg: '照片拍得真好看。',
            time: '13:30'
        },
        {
            id: 'user_random_8',
            name: '陈龙',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChenLong',
            lastMsg: '有空出来聚聚。',
            time: '13:10'
        },
        {
            id: 'service',
            name: '服务号',
            avatar: 'bg-red',
            icon: 'box',
            lastMsg: '中山大学附属第三医院：警惕腰腹疼痛信号！...',
            time: '12:13'
        },
        {
            id: 'pay',
            name: '微信支付',
            avatar: 'bg-green',
            icon: 'check-circle-2',
            lastMsg: '记账日报',
            time: '09:27',
            mute: true
        },
        {
            id: 'starbucks',
            name: '💕星巴克小助手💕 @星巴克企业号',
            avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=starbucks',
            lastMsg: '[8条] 【周末必囤 👊】¥28.97 喝超大杯 小...',
            time: '09:09',
            unread: 8,
            mute: true
        }
    ],
    contacts: [
        { group: 'R', items: [
            { id: 'robot_ai', name: 'AI 助手 (GLM-4)', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=robot' }
        ]},
        { group: 'A', items: [
            { name: '小雪', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=a' },
            { name: '小冯', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=afeng' },
            { name: '小如', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yellow' }
        ]}
    ],
    moments: [
        {
            id: 1,
            name: '有木有',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=baby',
            text: '惊喜加感动，感谢家人！感谢陌生朋友，节日快乐！',
            images: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400'],
            time: '1小时前'
        },
        {
            id: 2,
            name: '吴胜男 律师',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lawyer',
            text: '新年伊始，赢下 2026 第一个 writ of attachment 假扣押，几乎每天都有机会作为许律师的 Co-counsel 上庭，在洛杉矶 Downtown 的新办公室也即将启用。',
            images: [
                'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
                'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400',
                'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=400'
            ],
            time: '2小时前'
        },
        {
            id: 3,
            name: '科技每日推送',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=tech',
            text: '这就是未来的手机形态吗？全透明机身，这也太酷了吧！',
            images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
            time: '昨天'
        },
        {
            id: 4,
            name: '王小二',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangXiaoEr',
            text: '今天的天气真不错，适合出去走走。',
            images: ['https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400'],
            time: '3小时前'
        },
        {
            id: 5,
            name: '美食达人',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Foodie',
            text: '这家店的火锅真的绝了！推荐大家去试试。',
            images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'],
            time: '5小时前'
        },
        {
            id: 6,
            name: '摄影师阿强',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Photo',
            text: '街头摄影的一瞬间。',
            images: ['https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400'],
            time: '6小时前'
        },
        {
            id: 7,
            name: '旅行者',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Travel',
            text: '下一站，出发！',
            images: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'],
            time: '8小时前'
        },
        {
            id: 8,
            name: '健身狂人',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gym',
            text: '坚持就是胜利，今天又是充满活力的一天。',
            images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400'],
            time: '10小时前'
        },
        {
            id: 9,
            name: '爱宠人士',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pet',
            text: '我家主子又在卖萌了。',
            images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'],
            time: '12小时前'
        },
        {
            id: 10,
            name: '文艺青年',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Art',
            text: '生活不只有眼前的苟且，还有诗和远方。',
            images: ['https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400'],
            time: '15小时前'
        },
        {
            id: 11,
            name: '职场精英',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Job',
            text: '加班中，为了梦想奋斗！',
            images: ['https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400'],
            time: '20小时前'
        }
    ]
};

// 1. 标签切换逻辑
function switchTab(tabId) {
    state.currentTab = tabId;
    
    // 关闭所有可能打开的二级页面
    closeChat();
    closeMoments();
    
    // 更新页面显示
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const targetPage = document.getElementById(`page-${tabId}`);
    if (targetPage) targetPage.classList.add('active');
    
    // 更新标签栏状态
    document.querySelectorAll('.tab-item').forEach(item => {
        item.classList.remove('active');
        // 使用更可靠的方式匹配 tabId
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${tabId}'`)) {
            item.classList.add('active');
        }
    });

    if (tabId === 'wechat') renderChats();
    if (tabId === 'contacts') renderContacts();
}

// 渲染聊天列表
function renderChats() {
    const list = document.getElementById('chatList');
    list.innerHTML = state.chats.map(chat => `
        <div class="chat-item" onclick="openChat('${chat.id}')">
            <div class="avatar ${chat.avatar && chat.avatar.startsWith('bg-') ? chat.avatar : ''}">
                ${chat.avatarType === 'grid' ? `
                    <div class="avatar-grid">
                        ${chat.avatars.map(img => `<img src="${img}" alt="grid-avatar">`).join('')}
                    </div>
                ` : (chat.icon ? `<i data-lucide="${chat.icon}" class="text-white"></i>` : `<img src="${chat.avatar}" alt="avatar">`)}
                ${chat.unread ? `<span class="badge">${chat.unread}</span>` : ''}
            </div>
            <div class="info">
                <div class="top">
                    <span class="nickname">${chat.name}</span>
                    <span class="time">${chat.time}</span>
                </div>
                <div class="bottom">
                    <span class="last-msg">${chat.lastMsg}</span>
                    ${chat.mute ? '<i data-lucide="bell-off" class="mute-icon"></i>' : ''}
                </div>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

// 3. 聊天详情逻辑
function openChat(chatId) {
    state.activeChatId = chatId;
    const chat = state.chats.find(c => c.id === chatId);
    if (!chat) return;

    // 清除未读
    chat.unread = 0;
    renderChats();

    const subpage = document.getElementById('subpage-chat');
    document.getElementById('chat-title').innerText = chat.name;
    subpage.style.display = 'flex';
    setTimeout(() => subpage.classList.add('active'), 10);

    // 如果没有历史记录，初始化
    if (!state.messages[chatId]) {
        state.messages[chatId] = [
            { type: 'received', text: chat.lastMsg, time: chat.time }
        ];
    }
    renderMessages();
}

function closeChat() {
    const subpage = document.getElementById('subpage-chat');
    subpage.classList.remove('active');
    setTimeout(() => {
        subpage.style.display = 'none';
        state.activeChatId = null;
    }, 300);
}

function renderMessages() {
    const container = document.getElementById('chat-messages');
    const messages = state.messages[state.activeChatId] || [];
    const chat = state.chats.find(c => c.id === state.activeChatId);
    const userAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dog'; // 模拟图片中的狗狗头像

    let html = '';
    // 添加模拟的时间戳和系统提示（仅在第一次进入时且消息较少时）
    if (messages.length === 1 && state.activeChatId !== 'longya') {
        html += `<div class="msg-time">2025年12月18日 03:01</div>`;
        html += `
            <div class="message received">
                <img src="${chat.avatar}" class="m-avatar">
                <div class="bubble">我是${chat.name}</div>
            </div>
        `;
        html += `<div class="msg-time">2025年12月18日 09:43</div>`;
        html += `<div class="msg-system">你已添加了${chat.name}，以上是打招呼的消息。</div>`;
    }

    html += messages.map(msg => {
        let content = '';
        if (msg.contentType === 'image') {
            content = `
                <div class="bubble bubble-media">
                    <img src="${msg.url}" class="media-content" onclick="previewImage('${msg.url}')">
                    ${msg.text ? `<div class="media-text">${msg.text}</div>` : ''}
                </div>
            `;
        } else if (msg.contentType === 'video') {
            content = `
                <div class="bubble bubble-media bubble-video">
                    <div class="video-container">
                        <img src="${msg.url}" class="media-content">
                        <div class="video-play-btn">
                            <i data-lucide="play-circle"></i>
                        </div>
                        <div class="video-badge">
                            <i data-lucide="video" class="icon-tiny"></i> 海峡教育报
                        </div>
                    </div>
                    ${msg.text ? `<div class="media-text">${msg.text}</div>` : ''}
                </div>
            `;
        } else {
            content = `<div class="bubble">${msg.text}</div>`;
        }

        return `
            <div class="message ${msg.type}">
                <img src="${msg.type === 'sent' ? userAvatar : chat.avatar}" class="m-avatar">
                ${content}
            </div>
        `;
    }).join('');

    container.innerHTML = html;
    lucide.createIcons();
    container.scrollTop = container.scrollHeight;
}

// 消息输入监听
const msgInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const plusBtn = document.getElementById('plus-btn');
const emojiBtn = document.getElementById('emoji-btn');
const plusPanel = document.getElementById('chat-plus-panel');
const emojiPanel = document.getElementById('chat-emoji-panel');

if (msgInput) {
    msgInput.addEventListener('input', () => {
        if (msgInput.value.trim()) {
            sendBtn.style.display = 'block';
            plusBtn.style.display = 'none';
        } else {
            sendBtn.style.display = 'none';
            plusBtn.style.display = 'block';
        }
    });

    sendBtn.addEventListener('click', sendMessage);
    msgInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // 展开/收起加号面板
    plusBtn.addEventListener('click', () => {
        emojiPanel.classList.remove('active');
        plusPanel.classList.toggle('active');
        // 自动滚动到底部
        scrollToBottom();
    });

    // 展开/收起表情面板
    emojiBtn.addEventListener('click', () => {
        plusPanel.classList.remove('active');
        emojiPanel.classList.toggle('active');
        // 自动滚动到底部
        scrollToBottom();
    });

    // 点击输入框收起面板
    msgInput.addEventListener('focus', () => {
        plusPanel.classList.remove('active');
        emojiPanel.classList.remove('active');
    });

    // 表情点击逻辑
    document.querySelectorAll('.emoji-grid span').forEach(span => {
        span.addEventListener('click', () => {
            msgInput.value += span.innerText;
            // 触发 input 事件以显示发送按钮
            msgInput.dispatchEvent(new Event('input'));
        });
    });
}

function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 300);
}

// 加号面板功能处理
function handlePlusAction(action) {
    console.log('Action:', action);
    if (action === '照片') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const chatId = state.activeChatId;
                    const msg = { 
                        type: 'sent', 
                        contentType: 'image', 
                        url: event.target.result, 
                        text: '', 
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    };
                    state.messages[chatId].push(msg);
                    renderMessages();
                    plusPanel.classList.remove('active');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    } else {
        alert(`功能 [${action}] 正在开发中...`);
    }
}

async function sendMessage() {
    const text = msgInput.value.trim();
    if (!text) return;

    const chatId = state.activeChatId;
    const msg = { type: 'sent', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    
    if (!state.messages[chatId]) state.messages[chatId] = [];
    state.messages[chatId].push(msg);
    msgInput.value = '';
    sendBtn.style.display = 'none';
    plusBtn.style.display = 'block';
    
    renderMessages();
    
    // 更新最后一条消息
    const chat = state.chats.find(c => c.id === chatId);
    chat.lastMsg = text;
    chat.time = msg.time;
    renderChats();

    // 隐藏面板
    plusPanel.classList.remove('active');
    emojiPanel.classList.remove('active');

    // 自动回复逻辑
    if (chat.isRobot) {
        await handleRobotReply(chatId, text);
    } else {
        setTimeout(() => {
            const reply = { type: 'received', text: '已收到，稍后回复你~', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            state.messages[chatId].push(reply);
            if (state.activeChatId === chatId) renderMessages();
            chat.lastMsg = reply.text;
            chat.time = reply.time;
            renderChats();
        }, 1000);
    }
}

async function handleRobotReply(chatId, userText) {
    const chat = state.chats.find(c => c.id === chatId);
    
    // 显示正在输入...
    const loadingMsg = { type: 'received', text: '正在思考...', time: '' };
    state.messages[chatId].push(loadingMsg);
    renderMessages();

    try {
        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer 00b08fee86f84b33a353f45b0b0f6c0f.tBYJiYISieVqrTjA`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'glm-4-flash',
                messages: [{ role: 'user', content: userText }]
            })
        });

        const data = await response.json();
        const aiText = data.choices[0].message.content;
        
        // 移除“正在思考...”
        state.messages[chatId].pop();
        
        const reply = { 
            type: 'received', 
            text: aiText, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        state.messages[chatId].push(reply);
        
        if (state.activeChatId === chatId) renderMessages();
        chat.lastMsg = aiText;
        chat.time = reply.time;
        renderChats();
    } catch (error) {
        console.error('Robot reply error:', error);
        state.messages[chatId].pop();
        state.messages[chatId].push({ type: 'received', text: 'AI 暂时掉线了，请稍后再试。', time: '' });
        renderMessages();
    }
}

// 4. 渲染通讯录
function renderContacts() {
    const list = document.getElementById('contactList');
    list.innerHTML = state.contacts.map(group => `
        <div class="group-title">${group.group}</div>
        ${group.items.map(item => `
            <div class="contact-item">
                <img src="${item.avatar}" alt="avatar">
                <span>${item.name}</span>
            </div>
        `).join('')}
    `).join('');
}

// 2. 朋友圈逻辑
function openMoments() {
    const subpage = document.getElementById('subpage-moments');
    subpage.style.display = 'flex';
    setTimeout(() => subpage.classList.add('active'), 10);
    renderMoments();
}

function closeMoments() {
    const subpage = document.getElementById('subpage-moments');
    subpage.classList.remove('active');
    setTimeout(() => subpage.style.display = 'none', 300);
}

function renderMoments() {
    const list = document.getElementById('momentsList');
    list.innerHTML = state.moments.map(m => `
        <div class="moment-item">
            <img src="${m.avatar}" class="m-avatar" alt="avatar">
            <div class="moment-content">
                <div class="m-name">${m.name}</div>
                <div class="m-text">${m.text}</div>
                ${m.images.length > 0 ? `
                    <div class="m-images ${m.images.length === 1 ? 'single' : ''}">
                        ${m.images.map(img => `<img src="${img}" onclick="previewImage('${img}')" alt="moment-img">`).join('')}
                    </div>
                ` : ''}
                <div class="moment-footer">
                    <span class="m-time">${m.time}</span>
                    <div class="m-action-btn">
                        <i data-lucide="more-horizontal"></i>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

// 3. 朋友圈滚动监听 (处理导航栏透明度)
const momentsContent = document.getElementById('moments-content');
const momentsNav = document.getElementById('moments-nav');

momentsContent.addEventListener('scroll', () => {
    const scrollTop = momentsContent.scrollTop;
    if (scrollTop > 200) {
        momentsNav.classList.remove('transparent');
        momentsNav.classList.add('scrolled');
        const opacity = Math.min(1, (scrollTop - 200) / 50);
        momentsNav.style.backgroundColor = `rgba(237, 237, 237, ${opacity})`;
    } else {
        momentsNav.classList.add('transparent');
        momentsNav.classList.remove('scrolled');
        momentsNav.style.backgroundColor = 'transparent';
    }
});

// 4. 下拉刷新模拟
let startY = 0;
momentsContent.addEventListener('touchstart', (e) => {
    if (momentsContent.scrollTop === 0) {
        startY = e.touches[0].pageY;
    }
});

momentsContent.addEventListener('touchmove', (e) => {
    const moveY = e.touches[0].pageY;
    if (momentsContent.scrollTop === 0 && moveY > startY) {
        momentsContent.classList.add('pulling');
    }
});

momentsContent.addEventListener('touchend', () => {
    if (momentsContent.classList.contains('pulling')) {
        setTimeout(() => {
            momentsContent.classList.remove('pulling');
        }, 1000);
    }
});

// 5. 图片预览
function previewImage(url) {
    const preview = document.getElementById('imagePreview');
    const img = document.getElementById('previewImg');
    img.src = url;
    preview.style.display = 'flex';
}

function closePreview() {
    document.getElementById('imagePreview').style.display = 'none';
}

// 初始化加载微信首页
switchTab('wechat');
