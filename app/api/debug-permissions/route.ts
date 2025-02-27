import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/feishu';

export async function GET() {
  try {
    // 1. 检查环境变量
    const env = {
      FEISHU_APP_ID: process.env.FEISHU_APP_ID,
      FEISHU_APP_SECRET: process.env.FEISHU_APP_SECRET?.slice(0, 4) + '***',
      FEISHU_BASE_ID: process.env.FEISHU_BASE_ID,
      FEISHU_TABLE_ID: process.env.FEISHU_TABLE_ID,
    };
    console.log('Environment:', env);

    // 2. 获取访问令牌
    const token = await getAccessToken();
    console.log('Got token:', token.slice(0, 10) + '***');

    // 3. 测试 Base 权限
    const baseResponse = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${process.env.FEISHU_BASE_ID}?lang=zh_cn`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let baseData;
    try {
      const baseText = await baseResponse.text();
      console.log('Raw base response:', baseText);
      baseData = JSON.parse(baseText.trim());
    } catch (e) {
      console.error('Failed to parse base response:', e);
      baseData = { error: 'Failed to parse response' };
    }

    // 4. 测试表格列表权限
    const tablesResponse = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${process.env.FEISHU_BASE_ID}/tables?lang=zh_cn`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let tablesData;
    try {
      const tablesText = await tablesResponse.text();
      console.log('Raw tables response:', tablesText);
      tablesData = JSON.parse(tablesText.trim());
    } catch (e) {
      console.error('Failed to parse tables response:', e);
      tablesData = { error: 'Failed to parse response' };
    }

    // 5. 测试具体表格权限
    const tableResponse = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${process.env.FEISHU_BASE_ID}/tables/${process.env.FEISHU_TABLE_ID}/records?page_size=1&lang=zh_cn`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let tableData;
    try {
      const tableText = await tableResponse.text();
      console.log('Raw table response:', tableText);
      tableData = JSON.parse(tableText.trim());
    } catch (e) {
      console.error('Failed to parse table response:', e);
      tableData = { error: 'Failed to parse response' };
    }

    // 返回所有测试结果
    return NextResponse.json({
      success: true,
      env,
      base: baseData,
      tables: tablesData,
      table: tableData,
      token: token.slice(0, 10) + '***'
    });
  } catch (error) {
    console.error('Debug permissions failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      type: error.constructor.name
    });
  }
} 