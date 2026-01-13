const API_KEY = '00b08fee86f84b33a353f45b0b0f6c0f.tBYJiYISieVqrTjA';

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
        return btoa(JSON.stringify(obj))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };
    
    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(payload);
    const data = `${encodedHeader}.${encodedPayload}`;
    
    const signData = (data, secret) => {
        const hmac = new TextEncoder().encode(data);
        const key = new TextEncoder().encode(secret);
        return crypto.subtle.importKey(
            'raw',
            key,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        ).then(key => {
            return crypto.subtle.sign('HMAC', key, hmac);
        }).then(signature => {
            return btoa(String.fromCharCode(...new Uint8Array(signature)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        });
    };
    
    return signData(data, secret).then(signature => {
        return `${data}.${signature}`;
    });
}

async function testVideoGeneration() {
    console.log('=== 测试视频生成 API ===');
    
    const models = ['cogvideox-flash'];
    
    for (const model of models) {
        console.log(`\n测试模型: ${model}`);
        
        try {
            const token = await generateJWT(API_KEY);
            
            const response = await fetch('https://open.bigmodel.cn/api/paas/v4/videos/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    model: model,
                    prompt: '一只小猫在玩球'
                })
            });
            
            console.log('状态码:', response.status);
            
            if (!response.ok) {
                const error = await response.json();
                console.error('错误:', JSON.stringify(error, null, 2));
                continue;
            }
            
            const data = await response.json();
            console.log('成功! 完整响应数据:', JSON.stringify(data, null, 2));
            
            if (data.data) {
                console.log('data 数组长度:', data.data.length);
                if (data.data.length > 0) {
                    console.log('第一个元素:', data.data[0]);
                }
            }
            
        } catch (error) {
            console.error('请求失败:', error.message);
        }
    }
}

testVideoGeneration();
