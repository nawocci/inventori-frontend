import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value
  const path = request.nextUrl.pathname
  
  if (!authToken && path !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (authToken && path === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  if (authToken) {
    try {
      const tokenData = Buffer.from(authToken, 'base64').toString('utf-8')
      const parts = tokenData.split(':')
      const userId = parts[0]
      const username = parts[1]
      const role = parts[2]
      
      // Dashboard - only admins and validators allowed
      if (path === '/dashboard' && role === 'user') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      // User management - only admins allowed
      if (path.startsWith('/users') && role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      // Inventory management - admins can modify, users can view
      if (path.startsWith('/inventory/manage') && role !== 'admin') {
        return NextResponse.redirect(new URL('/inventory', request.url))
      }
      
      // Validators should focus on transaction approvals
      if (role === 'validator' && !path.startsWith('/transactions') && path !== '/dashboard') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
    } catch (error) {
      request.cookies.delete('auth-token')
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard',
    '/inventory',
    '/inventory/:path*',
    '/transactions',
    '/transactions/:path*',
    '/users',
    '/users/:path*'
  ],
}