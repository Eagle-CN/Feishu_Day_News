import { NextResponse } from 'next/server';
import { JinaParser } from '@/lib/jinaParser';
import { RecordService } from '@/lib/feishu/services/recordService';
import { ENV } from '@/lib/feishu/constants/config';
import { FeiShuError } from '@/lib/feishu/utils/errors';

export async function GET(request: Request) {
  try {
    // 获取 URL 参数
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // 解析文章
    const jinaParser = new JinaParser(ENV.JINA_API_KEY!);
    const parsed = await jinaParser.parseUrl(url);

    // 创建记录服务
    const recordService = new RecordService(ENV.BASE_ID!, ENV.TABLE_ID!);

    // 创建记录
    const result = await recordService.createRecord({
      fields: {
        标题: parsed.title,
        链接: parsed.url,
        内容: parsed.content,
        摘要: parsed.description,
        发布时间: Date.now(),
        来源: '测试来源',
        分类: '测试分类',
        状态: '待处理'
      }
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error processing article:', error);
    const errorMessage = error instanceof Error ? error.message : 
      error instanceof FeiShuError ? error.details?.msg || error.message : 
      'Unknown error';
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
} 