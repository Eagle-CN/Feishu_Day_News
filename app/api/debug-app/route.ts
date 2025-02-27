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

    // 3. 测试应用权限
    const appResponse = await fetch(
      'https://open.feishu.cn/open-apis/application/v6/applications/info',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const appText = await appResponse.text();
    console.log('Raw app response:', appText);

    if (!appResponse.ok) {
      console.error('App API Error:', {
        status: appResponse.status,
        statusText: appResponse.statusText,
        headers: Object.fromEntries(appResponse.headers.entries()),
        body: appText
      });
    }

    let appData;
    try {
      appData = JSON.parse(appText);
    } catch (e) {
      console.error('Failed to parse app response:', e);
      appData = { error: 'Failed to parse response', raw: appText };
    }

    // 4. 测试多维表格权限
    const tableResponse = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${process.env.FEISHU_BASE_ID}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const tableText = await tableResponse.text();
    console.log('Raw table response:', tableText);

    if (!tableResponse.ok) {
      console.error('Table API Error:', {
        status: tableResponse.status,
        statusText: tableResponse.statusText,
        headers: Object.fromEntries(tableResponse.headers.entries()),
        body: tableText
      });
    }

    let tableData;
    try {
      tableData = JSON.parse(tableText);
    } catch (e) {
      console.error('Failed to parse table response:', e);
      tableData = { error: 'Failed to parse response', raw: tableText };
    }

    // 5. 测试 Base 权限
    const baseResponse = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${process.env.FEISHU_BASE_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const baseText = await baseResponse.text();
    console.log('Raw base response:', baseText);

    if (!baseResponse.ok) {
      console.error('Base API Error:', {
        status: baseResponse.status,
        statusText: baseResponse.statusText,
        headers: Object.fromEntries(baseResponse.headers.entries()),
        body: baseText
      });
    }

    let baseData;
    try {
      baseData = JSON.parse(baseText);
    } catch (e) {
      console.error('Failed to parse base response:', e);
      baseData = { error: 'Failed to parse response', raw: baseText };
    }

    return NextResponse.json({
      success: true,
      env,
      app: {
        status: appResponse.status,
        data: appData
      },
      table: {
        status: tableResponse.status,
        data: tableData
      },
      base: {
        status: baseResponse.status,
        data: baseData
      },
      token: token.slice(0, 10) + '***'
    });
  } catch (error) {
    console.error('Debug app failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      type: error.constructor.name
    });
  }
} 