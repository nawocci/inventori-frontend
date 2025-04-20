import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/db';

export async function GET() {
  try {
    const query = `
      SELECT i.*, c.name as category_name, s.name as supplier_name 
      FROM items i
      JOIN categories c ON i.category_id = c.id
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      ORDER BY i.name ASC
    `;
    const items = await executeQuery({ query });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// Create a new item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category_id, stock, supplier_id } = body;
    
    // Validate required fields
    if (!name || !category_id) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      );
    }
    
    const query = `
      INSERT INTO items (name, category_id, stock, supplier_id)
      VALUES (?, ?, ?, ?)
    `;
    
    const values = [name, category_id, stock || 0, supplier_id || null];
    const result = await executeQuery({ query, values });
    
    return NextResponse.json({ 
      message: 'Item created successfully', 
      id: (result as any).insertId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}