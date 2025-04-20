import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/db';

export async function GET() {
  try {
    const query = 'SELECT * FROM suppliers ORDER BY name ASC';
    const suppliers = await executeQuery({ query });
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    );
  }
}