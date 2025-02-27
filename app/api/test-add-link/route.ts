import { NextResponse } from 'next/server';
import { addLink } from '@/lib/feishu';

export async function GET() {
  try {
    // 打印环境变量（隐藏敏感信息）
    console.log('Environment:', {
      FEISHU_APP_ID: process.env.FEISHU_APP_ID,
      FEISHU_APP_SECRET: process.env.FEISHU_APP_SECRET?.slice(0, 4) + '***',
      FEISHU_BASE_ID: process.env.FEISHU_BASE_ID,
      FEISHU_TABLE_ID: process.env.FEISHU_TABLE_ID,
    });

    const testUrl = 'https://36kr.com/p/2581276351315969';
    console.log('Testing URL:', testUrl);

    const result = await addLink(testUrl);
    console.log('Add link result:', result);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Test add link failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      type: error.constructor.name
    });
  }
} 