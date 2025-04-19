import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/utils/db';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    const users = await executeQuery<any[]>({
      query: 'SELECT id, username, name, division_id, role FROM users WHERE username = ? AND password = ? LIMIT 1',
      values: [username, password],
    });

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0];
    
    const authToken = Buffer.from(`${user.id}:${user.username}:${Date.now()}`).toString('base64');
    
    const cookieStore = cookies();
    await cookieStore.set({
      name: 'auth-token',
      value: authToken,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'strict',
    });

    return NextResponse.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
}