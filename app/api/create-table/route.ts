import { NextResponse } from 'next/server';
import { createTable } from '@/lib/feishu';

export async function GET() {
  try {
    // 打印环境变量（隐藏敏感信息）
    console.log('Environment:', {
      FEISHU_APP_ID: process.env.FEISHU_APP_ID,
      FEISHU_APP_SECRET: process.env.FEISHU_APP_SECRET?.slice(0, 4) + '***',
      FEISHU_BASE_ID: process.env.FEISHU_BASE_ID,
    });

    const result = await createTable();
    console.log('Create table result:', result);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Create table failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      type: error.constructor.name
    });
  }
} 