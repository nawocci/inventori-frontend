// filepath: /home/nawo/projects/inventori-frontend/src/utils/api.ts

// Types for the data based on actual database schema
export interface Item {
  id: number;
  name: string;
  category_id: number;
  stock: number;
  supplier_id: number | null;
  category_name?: string; // Added for join queries
  supplier_name?: string; // Added for join queries
}

export interface Category {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  division_id: number;
  role: 'admin' | 'validator' | 'user';
  division_name?: string; // Added for join queries
}

export interface Division {
  id: number;
  name: string;
}

export interface Request {
  id: number;
  user_id: number;
  item_id: number;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  request_date: string;
  user_name?: string; // Added for join queries
  item_name?: string; // Added for join queries
}

export interface StockIn {
  id: number;
  item_id: number;
  supplier_id: number;
  quantity: number;
  received_by: number;
  date: string;
  item_name?: string; // Added for join queries
  supplier_name?: string; // Added for join queries
  receiver_name?: string; // Added for join queries
}

export interface StockOut {
  id: number;
  item_id: number;
  request_id: number | null;
  quantity: number;
  issued_by: number;
  date: string;
  item_name?: string; // Added for join queries
  issuer_name?: string; // Added for join queries
}

export interface Supplier {
  id: number;
  name: string;
  contact: string | null;
}

// API functions using fetch instead of direct DB access
export async function getItems(): Promise<Item[]> {
  const response = await fetch('/api/items');
  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }
  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function searchItems(searchTerm: string): Promise<Item[]> {
  const response = await fetch(`/api/items/search?term=${encodeURIComponent(searchTerm)}`);
  if (!response.ok) {
    throw new Error('Failed to search items');
  }
  return response.json();
}

export async function getItemsByCategory(categoryId: number): Promise<Item[]> {
  const response = await fetch(`/api/items?categoryId=${categoryId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch items by category');
  }
  return response.json();
}

export async function getItem(id: number): Promise<Item> {
  const response = await fetch(`/api/items/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch item');
  }
  return response.json();
}

export async function createItem(item: Omit<Item, 'id' | 'category_name' | 'supplier_name'>): Promise<{ id: number }> {
  const response = await fetch('/api/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create item');
  }
  
  return response.json();
}

export async function updateItem(id: number, item: Omit<Item, 'id' | 'category_name' | 'supplier_name'>): Promise<void> {
  const response = await fetch(`/api/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update item');
  }
}

export async function deleteItem(id: number): Promise<void> {
  const response = await fetch(`/api/items/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete item');
  }
}

export async function getSuppliers(): Promise<Supplier[]> {
  const response = await fetch('/api/suppliers');
  if (!response.ok) {
    throw new Error('Failed to fetch suppliers');
  }
  return response.json();
}