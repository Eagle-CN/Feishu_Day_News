import { NextResponse } from 'next/server';
import { CronService } from '@/lib/services/cronService';

export async function POST(request: Request) {
  try {
    // 验证请求是否合法（可以添加密钥验证）
    const cronService = new CronService();
    await cronService.processArticles();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 