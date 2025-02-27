import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/feishu';

export async function GET() {
  try {
    const token = await getAccessToken();
    
    // 获取表格字段信息
    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${process.env.FEISHU_BASE_ID}/tables/${process.env.FEISHU_TABLE_ID}/fields`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    
    return NextResponse.json({
      success: true,
      fields: data.data?.items || [],
      table_id: process.env.FEISHU_TABLE_ID
    });
  } catch (error) {
    console.error('Debug table failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      type: error.constructor.name
    });
  }
} 