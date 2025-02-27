import { NextResponse } from 'next/server';
import { addLink } from '@/lib/feishu';

// 需要定时添加的新闻源链接
const NEWS_SOURCES = [
  'https://36kr.com/information/technology',
  'https://www.cnbeta.com/tech.htm',
  // 添加更多新闻源
];

export async function GET(request: Request) {
  try {
    // 验证请求是否来自Vercel Cron
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 添加新链接
    const results = await Promise.allSettled(
      NEWS_SOURCES.map(url => addLink(url))
    );

    // 统计结果
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').map(r => {
      if (r.status === 'rejected') {
        return r.reason.message;
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        succeeded,
        failed,
      }
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 