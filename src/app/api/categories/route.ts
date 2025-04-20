import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/db';

export async function GET() {
  try {
    const query = 'SELECT * FROM categories ORDER BY name ASC';
    const categories = await executeQuery({ query });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}