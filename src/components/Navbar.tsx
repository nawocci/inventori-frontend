'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <header className="h-16 px-6 bg-white shadow flex items-center justify-between">
      <h1 className="font-semibold">Sistem Inventori Nantech</h1>
      
      <nav className="flex items-center gap-4">
        {user.role !== 'user' && (
          <Link 
          href="/dashboard" 
          className={`px-3 py-2 hover:text-blue-700 transition-colors ${pathname === '/dashboard' ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
        >
          Dashboard
        </Link>
        )}
        
        {user.role !== 'validator' && (
          <Link 
            href="/inventory" 
            className={`px-3 py-2 hover:text-blue-700 transition-colors ${pathname === '/inventory' ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
          >
            Inventory
          </Link>
        )}
        
        <Link 
          href="/transactions" 
          className={`px-3 py-2 hover:text-blue-700 transition-colors ${pathname === '/transactions' ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
        >
          Transactions
        </Link>
        
        {user.role === 'admin' && (
          <Link 
            href="/users" 
            className={`px-3 py-2 hover:text-blue-700 transition-colors ${pathname === '/users' ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
          >
            Users
          </Link>
        )}
      </nav>
      
      <div className="flex items-center gap-4">
        <span className="text-gray-700">
          Halo, <span className="font-medium">{user.name}</span>
          {user.role && (
            <span className="ml-2 text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-sm">
              {user.role}
            </span>
          )}
        </span>
        <button
          onClick={logout}
          className="hover:cursor-pointer bg-red-600 hover:bg-red-700 transition-colors text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}