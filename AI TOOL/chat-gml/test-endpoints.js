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

async function testDifferentEndpoints() {
    console.log('=== 测试不同的查询端点 ===\n');
    
    const token = await generateJWT(API_KEY);
    
    const taskId = '8081767841413145-7995158447630998770';
    const requestId = '2026010917503042277d10c755459f';
    
    const endpoints = [
        `https://open.bigmodel.cn/api/paas/v4/videos/generations/${taskId}`,
        `https://open.bigmodel.cn/api/paas/v4/videos/generations?task_id=${taskId}`,
        `https://open.bigmodel.cn/api/paas/v4/videos/generations?request_id=${requestId}`,
        `https://open.bigmodel.cn/api/paas/v4/videos/${taskId}`,
        `https://open.bigmodel.cn/api/paas/v4/videos/result/${taskId}`,
        `https://open.bigmodel.cn/api/paas/v4/videos/status/${taskId}`,
    ];
    
    for (const endpoint of endpoints) {
        console.log(`测试端点: ${endpoint}`);
        
        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log(`  状态码: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`  ✓ 成功!`);
                console.log(`  响应:`, JSON.stringify(data, null, 2));
                console.log('');
            } else {
                const error = await response.json();
                console.log(`  ✗ 失败`);
                console.log(`  错误:`, JSON.stringify(error, null, 2));
                console.log('');
            }
        } catch (error) {
            console.log(`  ✗ 请求失败: ${error.message}`);
            console.log('');
        }
    }
}

testDifferentEndpoints();
