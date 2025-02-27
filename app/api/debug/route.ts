import { NextResponse } from 'next/server';
import { debugPermissions } from '@/lib/feishu';

export async function GET() {
  try {
    const result = await debugPermissions();
    
    // 确保返回的是有效的 JSON
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: result
    });
  } catch (error) {
    console.error('Debug failed:', error);
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    });
  }
} 