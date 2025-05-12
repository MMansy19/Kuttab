"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import NotificationBell from '@/components/notifications/NotificationBell';
import { FaUser } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav dir="rtl" className="w-full bg-white dark:bg-gray-900 text-emerald-900 dark:text-white py-4 px-2 sm:px-6 flex flex-col sm:flex-row items-center justify-between shadow-md transition-colors duration-300 border-b border-accent">
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-blue-600 inline-block text-transparent bg-clip-text">
            <span>كُتّاب <span className="text-emerald-700 dark:text-emerald-400 opacity-30 mx-1">|</span> <span dir="ltr" className="inline-block">iKuttab</span></span>
          </h1>

        </div>
      </div>

      {/* Mobile menu button */}
      <button
        className="sm:hidden absolute top-4 left-4"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Navigation Links */}
      <ul className={`flex flex-col sm:flex-row gap-2 sm:gap-4 text-lg font-bold w-full sm:w-auto text-center ${isMenuOpen ? 'block' : 'hidden'} sm:flex`}>
        <li><Link href="/" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">الرئيسية</Link></li>
        <li><Link href="/about" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">عن المنصة</Link></li>
        <li><Link href="/teachers" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">المعلمون</Link></li>
        <li><Link href="/donate" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">تبرع</Link></li>
        <li><Link href="/contact" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">تواصل</Link></li>
      </ul>

      {/* Auth and User Actions */}
      <div className={`flex items-center gap-2 mt-2 sm:mt-0 ${isMenuOpen ? 'block' : 'hidden'} sm:flex`}>
        {session ? (
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <NotificationBell />

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1 rounded bg-emerald-100 dark:bg-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-700 transition">
                <span className="hidden md:inline">{session.user?.name}</span>
                <FaUser className="text-emerald-800 dark:text-emerald-400" />
              </button>

              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                <Link
                  href="/dashboard/user"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  لوحة التحكم
                </Link>
                <Link
                  href="/dashboard/notifications"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  الإشعارات
                </Link>
                {session.user?.role === 'TEACHER' && (
                  <Link
                    href="/dashboard/teacher"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    صفحة المعلم
                  </Link>
                )}
                {session.user?.role === 'ADMIN' && (
                  <Link
                    href="/dashboard/admin"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    صفحة المدير
                  </Link>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <Link
                  href="/api/auth/signout"
                  className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  تسجيل الخروج
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Link href="/auth/login" className="px-3 py-1 rounded bg-accent hover:bg-emerald-700 dark:hover:bg-emerald-600 transition text-white font-bold">دخول</Link>
            <Link href="/auth/signup" className="px-3 py-1 rounded bg-emerald-200 dark:bg-emerald-700 hover:bg-emerald-300 dark:hover:bg-emerald-800 transition text-emerald-900 dark:text-white font-bold">حساب جديد</Link>
          </>
        )}
      </div>
    </nav>
  );
}