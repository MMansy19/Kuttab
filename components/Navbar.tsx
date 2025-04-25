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
    <nav dir="rtl" className="w-full bg-white dark:bg-gray-900 text-emerald-900 dark:text-white py-4 px-2 sm:px-6 flex flex-col sm:flex-row items-center justify-between shadow-md transition-colors duration-300 border-b border-accent">
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <span className="text-3xl font-bold tracking-tight text-accent">كُتّاب <span className="text-emerald-700">|</span> KOTTAB</span>
      </div>
      <ul className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-lg font-bold w-full sm:w-auto text-center">
        <li><a href="/" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">الرئيسية</a></li>
        <li><a href="/about" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">عن المنصة</a></li>
        <li><a href="/teachers" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">المعلمون</a></li>
        <li><a href="/donate" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">تبرع</a></li>
        <li><a href="/contact" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">تواصل</a></li>
      </ul>
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        <button
          onClick={toggleTheme}
          className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition text-emerald-900 dark:text-white text-lg border border-accent"
          aria-label="تبديل الوضع الليلي/النهاري"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <a href="/auth/login" className="px-3 py-1 rounded bg-accent hover:bg-emerald-700 transition text-white font-bold">دخول</a>
        <a href="/auth/signup" className="px-3 py-1 rounded bg-emerald-200 dark:bg-emerald-700 hover:bg-emerald-300 dark:hover:bg-emerald-800 transition text-emerald-900 dark:text-white font-bold">حساب جديد</a>
      </div>
    </nav>
  );
}