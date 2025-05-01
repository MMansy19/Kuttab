"use client";

import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';

interface ThemeSwitcherProps {
  className?: string;
  variant?: 'icon' | 'toggle' | 'button';
}

export function ThemeSwitcher({ className, variant = 'toggle' }: ThemeSwitcherProps) {
  const { theme, toggleTheme } = useTheme();
  
  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'p-2 rounded-full transition-colors',
          'hover:bg-gray-200 dark:hover:bg-gray-700',
          className
        )}
        aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <FaMoon className="text-gray-700" /> : <FaSun className="text-yellow-400" />}
      </button>
    );
  }
  
  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors',
          'text-gray-700 dark:text-white',
          'hover:bg-gray-200 dark:hover:bg-gray-700',
          className
        )}
      >
        {theme === 'light' ? <FaMoon /> : <FaSun className="text-yellow-400" />}
        {theme === 'light' ? 'الوضع الليلي' : 'الوضع النهاري'}
      </button>
    );
  }
  
  return (
    <div className={cn('flex items-center', className)}>
      <FaSun className="text-yellow-500 ml-2" />
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-emerald-600 peer-focus:ring-2 peer-focus:ring-emerald-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
      </label>
      <FaMoon className="text-gray-500 dark:text-gray-400 ml-2" />
    </div>
  );
}

export default ThemeSwitcher;