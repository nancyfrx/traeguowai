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

async function testVideoGenerationComplete() {
    console.log('=== 测试视频生成完整流程 ===\n');
    
    try {
        const token = await generateJWT(API_KEY);
        console.log('1. Token生成成功');
        
        const model = 'cogvideox-flash';
        const prompt = '一只小猫在玩球';
        
        console.log(`\n2. 创建视频生成任务`);
        console.log(`   模型: ${model}`);
        console.log(`   提示词: ${prompt}`);
        
        const createResponse = await fetch('https://open.bigmodel.cn/api/paas/v4/videos/generations', {
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
        
        console.log(`   状态码: ${createResponse.status}`);
        
        if (!createResponse.ok) {
            const error = await createResponse.json();
            console.error('   创建任务失败:', JSON.stringify(error, null, 2));
            return;
        }
        
        const createData = await createResponse.json();
        console.log('   创建任务成功!');
        console.log('   响应数据:', JSON.stringify(createData, null, 2));
        
        if (!createData.id) {
            console.error('   错误: 响应中没有任务ID');
            return;
        }
        
        const taskId = createData.id;
        console.log(`\n3. 任务ID: ${taskId}`);
        console.log('   开始轮询任务状态...\n');
        
        let attempts = 0;
        const maxAttempts = 30;
        
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            console.log(`   [${attempts + 1}/${maxAttempts}] 查询任务状态...`);
            
            try {
                const statusResponse = await fetch(`https://open.bigmodel.cn/api/paas/v4/videos/generations/${taskId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                console.log(`      状态码: ${statusResponse.status}`);
                
                if (!statusResponse.ok) {
                    const error = await statusResponse.json();
                    console.error('      查询失败:', JSON.stringify(error, null, 2));
                    attempts++;
                    continue;
                }
                
                const statusData = await statusResponse.json();
                console.log(`      任务状态: ${statusData.task_status}`);
                
                if (statusData.task_status === 'SUCCESS') {
                    console.log('\n   ✓ 视频生成成功!');
                    console.log('   完整响应:', JSON.stringify(statusData, null, 2));
                    
                    if (statusData.result && statusData.result.video_url) {
                        console.log(`\n   视频URL: ${statusData.result.video_url}`);
                    } else if (statusData.data && statusData.data[0] && statusData.data[0].url) {
                        console.log(`\n   视频URL: ${statusData.data[0].url}`);
                    } else {
                        console.log('\n   警告: 未找到视频URL');
                    }
                    
                    return;
                } else if (statusData.task_status === 'FAILED') {
                    console.error('\n   ✗ 视频生成失败');
                    console.log('   失败原因:', statusData.error || '未知错误');
                    return;
                }
                
                attempts++;
            } catch (error) {
                console.error(`      查询错误: ${error.message}`);
                attempts++;
            }
        }
        
        console.log('\n   ⏱ 轮询超时');
        
    } catch (error) {
        console.error('\n✗ 测试失败:', error.message);
        console.error('错误详情:', error);
    }
}

testVideoGenerationComplete();
