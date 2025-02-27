import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/feishu';

export async function GET() {
  try {
    const result = await checkAuth();
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Auth check failed:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 