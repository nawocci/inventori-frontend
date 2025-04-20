import { NextResponse } from 'next/server';
import { executeQuery } from '@/utils/db';

// Get a specific item by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const query = `
      SELECT i.*, c.name as category_name, s.name as supplier_name 
      FROM items i
      JOIN categories c ON i.category_id = c.id
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      WHERE i.id = ?
    `;
    const items = await executeQuery({ query, values: [id] });
    const item = (items as any[])[0];
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

// Update an item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { name, category_id, stock, supplier_id } = body;
    
    // Validate required fields
    if (!name || !category_id) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      );
    }
    
    // Check if item exists
    const checkQuery = 'SELECT id FROM items WHERE id = ?';
    const existingItems = await executeQuery({ query: checkQuery, values: [id] });
    
    if ((existingItems as any[]).length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    const query = `
      UPDATE items
      SET name = ?, category_id = ?, stock = ?, supplier_id = ?
      WHERE id = ?
    `;
    
    const values = [name, category_id, stock || 0, supplier_id || null, id];
    await executeQuery({ query, values });
    
    return NextResponse.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

// Delete an item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if item exists
    const checkQuery = 'SELECT id FROM items WHERE id = ?';
    const existingItems = await executeQuery({ query: checkQuery, values: [id] });
    
    if ((existingItems as any[]).length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    // Check for foreign key constraints (stock_in, stock_out, requests)
    const constraintQueries = [
      'SELECT COUNT(*) as count FROM stock_in WHERE item_id = ?',
      'SELECT COUNT(*) as count FROM stock_out WHERE item_id = ?',
      'SELECT COUNT(*) as count FROM requests WHERE item_id = ?'
    ];
    
    for (const checkQuery of constraintQueries) {
      const result = await executeQuery({ query: checkQuery, values: [id] });
      if ((result as any[])[0].count > 0) {
        return NextResponse.json(
          { error: 'Cannot delete item because it is referenced in transactions or requests' },
          { status: 400 }
        );
      }
    }
    
    const query = 'DELETE FROM items WHERE id = ?';
    await executeQuery({ query, values: [id] });
    
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}