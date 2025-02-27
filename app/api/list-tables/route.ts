import { NextResponse } from 'next/server';
import { listTables } from '@/lib/feishu';

export async function GET() {
  try {
    const result = await listTables();
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Failed to list tables:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 