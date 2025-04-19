'use client';

import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="h-16 px-6 bg-white shadow flex items-center justify-between">
      <h1 className="font-semibold">Sistem Inventori Nantech</h1>
      <div className="flex items-center gap-4">
        <span className=" text-gray-700">
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