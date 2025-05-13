"use client";

import { useEffect, useState } from "react";
import { useAuth, RoleGuard, UserMenu } from '@/features/auth';
import Link from "next/link";

export default function HomePage() {
  const { user, status } = useAuth();
  const [greeting, setGreeting] = useState("");
  
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    let newGreeting = "";
    
    if (hour < 12) {
      newGreeting = "صباح الخير";
    } else if (hour < 18) {
      newGreeting = "مساء الخير";
    } else {
      newGreeting = "مساء الخير";
    }
    
    setGreeting(newGreeting);
  }, []);
  
  // Role-specific dashboard links
  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    
    switch (user.role) {
      case "ADMIN":
        return "/dashboard/admin";
      case "TEACHER":
        return "/dashboard/teacher";
      default:
        return "/dashboard/student";
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">كُتّاب</span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex">
                <Link href="/" className="border-indigo-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  الرئيسية
                </Link>
                <Link href="/teachers" className="border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  المعلمون
                </Link>
                <Link href="/about" className="border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  حول كُتّاب
                </Link>
                <Link href="/contact" className="border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  اتصل بنا
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <UserMenu showFull />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content with conditional rendering based on auth status */}
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            مرحباً بك في منصة كُتّاب
          </h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
            منصة تعليمية متخصصة في تعليم القرآن والعلوم الإسلامية
          </p>
          
          <div className="mt-10">
            {status === 'loading' && (
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-64"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mt-4"></div>
              </div>
            )}
            
            {status === 'unauthenticated' && (
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  ابدأ رحلتك التعليمية الآن
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  سجل حساب جديد للوصول إلى الدروس والمعلمين
                </p>
                <div className="mt-6 flex gap-4">
                  <a 
                    href="/auth/signup" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium text-lg transition-colors"
                  >
                    إنشاء حساب جديد
                  </a>
                  <a 
                    href="/auth/login"
                    className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-md font-medium text-lg transition-colors"
                  >
                    تسجيل الدخول
                  </a>
                </div>
              </div>
            )}
            
            {status === 'authenticated' && (
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  مرحباً {user?.name}!
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {user?.role === 'TEACHER' 
                    ? 'يمكنك إدارة جدولك وطلابك من لوحة التحكم'
                    : user?.role === 'ADMIN'
                    ? 'يمكنك إدارة المنصة من لوحة التحكم الخاصة بك'
                    : 'يمكنك حجز دروسك والوصول إلى محتوى التعلم من لوحة التحكم'}
                </p>
                <div className="mt-6">
                  <a 
                    href="/dashboard" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium text-lg transition-colors"
                  >
                    الذهاب إلى لوحة التحكم
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
