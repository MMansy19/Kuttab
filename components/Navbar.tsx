"use client";
import React, { useEffect, useState } from 'react';

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
    <nav dir="rtl" className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-4 px-2 sm:px-6 flex flex-col sm:flex-row items-center justify-between shadow-md transition-colors duration-300">
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <span className="text-2xl font-bold tracking-tight">كتاب</span>
      </div>
      <ul className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-base sm:text-lg font-medium w-full sm:w-auto text-center">
        <li><a href="/" className="hover:text-blue-500 dark:hover:text-blue-400 transition">الرئيسية</a></li>
        <li><a href="/about" className="hover:text-blue-500 dark:hover:text-blue-400 transition">من نحن</a></li>
        <li><a href="/teachers" className="hover:text-blue-500 dark:hover:text-blue-400 transition">المعلمون</a></li>
        <li><a href="/donate" className="hover:text-blue-500 dark:hover:text-blue-400 transition">تبرع</a></li>
        <li><a href="/contact" className="hover:text-blue-500 dark:hover:text-blue-400 transition">تواصل</a></li>
      </ul>
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        <button
          onClick={toggleTheme}
          className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-800 transition text-gray-900 dark:text-white text-lg"
          aria-label="تبديل الوضع الليلي/النهاري"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <a href="/auth/login" className="px-3 py-1 rounded bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 transition text-white">دخول</a>
        <a href="/auth/signup" className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-800 transition text-gray-900 dark:text-white">حساب جديد</a>
      </div>
    </nav>
  );
}