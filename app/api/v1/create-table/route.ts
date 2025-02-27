/**
创建表格
curl -X POST http://localhost:3000/api/v1/create-table

curl -X POST http://localhost:3000/api/v1/create-table \
-H "Content-Type: application/json" \
-d '{"name": "自定义表格名", "viewName": "自定义视图名"}'
 */

import { NextResponse } from 'next/server';
import { TableService } from '@/lib/feishu/services/tableService';
import { ENV } from '@/lib/feishu/constants/config';
import { FeiShuError } from '@/lib/feishu/utils/errors';
import { FIELD_TYPES } from '@/lib/feishu/constants/config';

export async function POST(request: Request) {
  try {
    // 设置默认值，并尝试解析请求体
    let name = '新闻采集表';
    let viewName = '默认视图';

    try {
      const body = await request.json();
      name = body.name || name;
      viewName = body.viewName || viewName;
    } catch (e) {
      console.log('Using default values');
    }

    // 验证环境变量
    console.log('Environment variables:', {
      BASE_ID: ENV.BASE_ID,
      APP_ID: ENV.APP_ID,
      APP_SECRET: ENV.APP_SECRET
    });

    // 创建表格服务
    const tableService = new TableService(ENV.BASE_ID!, ENV.APP_ID!);

    // 打印请求数据
    console.log('Creating table with config:', {
      name,
      viewName,
      appToken: ENV.BASE_ID,
      appId: ENV.APP_ID
    });

    // 创建数据表
    const result = await tableService.createTable({
      name,
      default_view_name: viewName,
      fields: [
        {
          field_name: '标题',
          type: FIELD_TYPES.TEXT
        },
        {
          field_name: '链接',
          type: FIELD_TYPES.URL
        },
        {
          field_name: '内容',
          type: FIELD_TYPES.TEXT,
          property: {
            formatter: 'rich'
          }
        },
        {
          field_name: '摘要',
          type: FIELD_TYPES.TEXT
        },
        {
          field_name: '发布时间',
          type: FIELD_TYPES.DATE_TIME
        },
        {
          field_name: '来源',
          type: FIELD_TYPES.SINGLE_SELECT,
          property: {
            options: [
              { name: '36氪', color: 0 },
              { name: '测试来源', color: 1 },
              { name: '其他', color: 2 }
            ]
          }
        },
        {
          field_name: '分类',
          type: FIELD_TYPES.SINGLE_SELECT,
          property: {
            options: [
              { name: '科技', color: 0 },
              { name: '创投', color: 1 },
              { name: '其他', color: 2 }
            ]
          }
        },
        {
          field_name: '状态',
          type: FIELD_TYPES.SINGLE_SELECT,
          property: {
            options: [
              { name: '待处理', color: 0 },
              { name: '处理中', color: 1 },
              { name: '已完成', color: 2 }
            ]
          }
        },
        {
          field_name: '关键词',
          type: FIELD_TYPES.MULTI_SELECT,
          property: {
            options: [
              { name: 'AI', color: 0 },
              { name: '创业', color: 1 },
              { name: '融资', color: 2 }
            ]
          }
        }
      ]
    });

    console.log('API Response:', result);

    return NextResponse.json({
      success: true,
      data: result,
      table_id: result.data?.table_id
    });

  } catch (error) {
    console.error('Detailed error:', error);
    
    // 更详细的错误信息
    const errorDetails = error instanceof FeiShuError ? {
      message: error.message,
      details: error.details,
      name: error.name
    } : {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };

    console.error('Error details:', errorDetails);
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorDetails.message,
        details: errorDetails
      },
      { status: 500 }
    );
  }
} 