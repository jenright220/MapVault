"use client";

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { LogIn, LogOut, Plus, User, Settings } from 'lucide-react';

export default function Header() {
  const { isAuthenticated, username, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">MapVault</h1>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 font-medium"
            >
              Collection
            </Link>
            
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/admin/manage"
                      className="hidden sm:inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 font-medium"
                    >
                      <Settings size={16} />
                      <span>Manage</span>
                    </Link>
                    
                    <Link
                      href="/admin/upload"
                      className="hidden sm:inline-flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 font-medium transition-colors"
                    >
                      <Plus size={16} />
                      <span>Add Map</span>
                    </Link>
                    
                    <div className="flex items-center space-x-3">
                      <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                        <User size={16} />
                        <span>{username}</span>
                      </div>
                      
                      <button
                        onClick={handleLogout}
                        className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 font-medium"
                      >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 font-medium"
                  >
                    <LogIn size={16} />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}
            
            {/* Mobile Add Map Button */}
            {isAuthenticated && (
              <Link
                href="/admin/upload"
                className="sm:hidden inline-flex items-center justify-center w-10 h-10 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                <Plus size={20} />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}