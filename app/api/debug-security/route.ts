import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/feishu';

export async function GET() {
  try {
    // 1. 检查环境变量
    const env = {
      FEISHU_APP_ID: process.env.FEISHU_APP_ID,
      FEISHU_APP_SECRET: process.env.FEISHU_APP_SECRET?.slice(0, 4) + '***',
      FEISHU_BASE_ID: process.env.FEISHU_BASE_ID,
    };
    console.log('Environment:', env);

    // 2. 获取访问令牌
    const token = await getAccessToken();
    console.log('Got token:', token.slice(0, 10) + '***');

    // 3. 测试应用安全设置
    const securityResponse = await fetch(
      'https://open.feishu.cn/open-apis/application/v6/security/settings?lang=zh_cn',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let securityData;
    try {
      const securityText = await securityResponse.text();
      console.log('Raw security response:', securityText);
      securityData = JSON.parse(securityText);
    } catch (e) {
      console.error('Failed to parse security response:', e);
      securityData = { error: 'Failed to parse response' };
    }

    return NextResponse.json({
      success: true,
      env,
      security: securityData,
      token: token.slice(0, 10) + '***'
    });
  } catch (error) {
    console.error('Debug security failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      type: error.constructor.name
    });
  }
} 