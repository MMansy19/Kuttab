"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

function getInitialTheme() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem('theme');
    if (stored) return stored;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  }
  return 'dark';
}

export default function Navbar() {
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav dir="rtl" className="w-full bg-white dark:bg-gray-900 text-emerald-900 dark:text-white py-4 px-2 sm:px-6 flex flex-col sm:flex-row items-center justify-between shadow-md transition-colors duration-300 border-b border-accent">
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <span className="text-3xl font-bold tracking-tight text-accent">كُتّاب <span className="text-emerald-700 dark:text-emerald-400">|</span> KOTTAB</span>
      </div>
      <ul className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-lg font-bold w-full sm:w-auto text-center">
        <li><Link href="/" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">الرئيسية</Link></li>
        <li><Link href="/about" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">عن المنصة</Link></li>
        <li><Link href="/teachers" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">المعلمون</Link></li>
        <li><Link href="/donate" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">تبرع</Link></li>
        <li><Link href="/contact" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">تواصل</Link></li>
      </ul>
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        {/* make theme only dark (NEED TO BE CHANGED) */}

        {/* <button
          onClick={toggleTheme}
          className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition text-emerald-900 dark:text-white text-lg border border-accent"
          aria-label="تبديل الوضع الليلي/النهاري"
        >
            {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 9.003 0 008.354-5.646z" />
            </svg>
            )}
        </button> */}
        <Link href="/auth/login" className="px-3 py-1 rounded bg-accent hover:bg-emerald-700 dark:hover:bg-emerald-600 transition text-white font-bold">دخول</Link>
        <Link href="/auth/signup" className="px-3 py-1 rounded bg-emerald-200 dark:bg-emerald-700 hover:bg-emerald-300 dark:hover:bg-emerald-800 transition text-emerald-900 dark:text-white font-bold">حساب جديد</Link>
      </div>
    </nav>
  );
}