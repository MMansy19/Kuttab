"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

interface UserMenuProps {
  /**
   * Whether to show the full profile (avatar + name + dropdown)
   * If false, only shows avatar or icon
   */
  showFull?: boolean;
  
  /**
   * Whether to show logout button
   */
  showLogout?: boolean;
  
  /**
   * Whether to make the component smaller
   */
  compact?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Component that displays the current user's avatar and menu
 * Shows login/register links if not authenticated
 */
export function UserMenu({
  showFull = true,
  showLogout = true,
  compact = false,
  className = "",
}: UserMenuProps) {
  const { user, status, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setIsMenuOpen(false);
    
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);
  
  const handleLogout = async () => {
    await logout();
  };
  
  // If still loading, show skeleton
  if (status === 'loading') {
    return (
      <div className={`animate-pulse flex items-center ${className}`}>
        <div className={`rounded-full bg-gray-200 dark:bg-gray-700 ${compact ? 'h-8 w-8' : 'h-10 w-10'}`}></div>
        {showFull && (
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mr-2"></div>
        )}
      </div>
    );
  }
  
  // If not authenticated, show login/register buttons
  if (status === 'unauthenticated') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Link
          href="/auth/login"
          className={`text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white ${compact ? 'py-1 px-2' : 'py-2 px-3'}`}
        >
          تسجيل الدخول
        </Link>
        <Link
          href="/auth/signup"
          className={`text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md ${compact ? 'py-1 px-2' : 'py-2 px-3'}`}
        >
          إنشاء حساب
        </Link>
      </div>
    );
  }
  
  // User is authenticated, show profile/menu
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen(!isMenuOpen);
        }}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className={`relative ${compact ? 'h-8 w-8' : 'h-10 w-10'} rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700`}>
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              width={compact ? 32 : 40}
              height={compact ? 32 : 40}
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <FiUser size={compact ? 16 : 20} />
            </div>
          )}
        </div>
        
        {showFull && (
          <>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name || 'المستخدم'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role === 'ADMIN' ? 'مدير' : user?.role === 'TEACHER' ? 'معلم' : 'طالب'}
              </span>
            </div>
            <FiChevronDown className={`transition-transform duration-200 ${isMenuOpen ? 'transform rotate-180' : ''}`} />
          </>
        )}
      </button>
      
      {isMenuOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-100 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
          
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            لوحة التحكم
          </Link>
          
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            الملف الشخصي
          </Link>
          
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            <FiSettings className="inline mb-0.5 ml-1" /> الإعدادات
          </Link>
          
          {showLogout && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-right block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
            >
              <FiLogOut className="inline mb-0.5 ml-1" /> تسجيل الخروج
            </button>
          )}
        </div>
      )}
    </div>
  );
}
