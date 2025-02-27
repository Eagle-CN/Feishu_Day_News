import { NextResponse } from 'next/server';
import { getTables } from '@/lib/feishu';

export async function GET() {
  try {
    const tables = await getTables();
    return NextResponse.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
} 