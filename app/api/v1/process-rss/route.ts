import { NextResponse } from 'next/server';
import { RssService } from '@/lib/services/rssService';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'RSS URL is required' },
        { status: 400 }
      );
    }

    const rssService = new RssService();
    const result = await rssService.processRssArticles(url);
    
    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error processing RSS:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 