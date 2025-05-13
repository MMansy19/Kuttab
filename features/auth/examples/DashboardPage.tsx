"use client";

import { useEffect } from "react";
import { useAuth, RoleGuard } from "@/features/auth";
import Link from "next/link";

export default function DashboardPage() {
  const { user, status } = useAuth();
  
  // Determine what content to show based on user role
  const renderRoleSpecificContent = () => {
    if (!user) return null;
    
    switch (user.role) {
      case "ADMIN":
        return (
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-300">
              لوحة تحكم المدير
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              يمكنك إدارة المستخدمين والمحتوى من هنا.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/admin/users"
                className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  إدارة المستخدمين
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  عرض وتعديل حسابات المستخدمين
                </p>
              </Link>
              <Link
                href="/dashboard/admin/teachers"
                className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  إدارة المعلمين
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  إدارة معلمي المنصة والجداول
                </p>
              </Link>
              <Link
                href="/dashboard/admin/settings"
                className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  إعدادات النظام
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  تعديل إعدادات المنصة الرئيسية
                </p>
              </Link>
            </div>
          </div>
        );
      
      case "TEACHER":
        return (
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-300">
              لوحة تحكم المعلم
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              يمكنك إدارة جدولك وفصولك من هنا.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/teacher/schedule"
                className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  الجدول الدراسي
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  إدارة مواعيدك وجدولك الدراسي
                </p>
              </Link>
              <Link
                href="/dashboard/teacher/students"
                className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  الطلاب
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  عرض وإدارة الطلاب المسجلين
                </p>
              </Link>
              <Link
                href="/dashboard/teacher/materials"
                className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  المواد التعليمية
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  عرض وتحميل المواد التعليمية
                </p>
              </Link>
            </div>
          </div>
        );
        
      default: // Student or regular user
        return (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">
              لوحة تحكم الطالب
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              يمكنك إدارة تعلمك ومتابعة تقدمك من هنا.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/user/classes"
                className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  فصولي
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  عرض الفصول المسجلة وجدول الحصص
                </p>
              </Link>
              <Link
                href="/dashboard/user/teachers"
                className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  المعلمين
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  تصفح واختيار معلمين جدد
                </p>
              </Link>
              <Link
                href="/dashboard/user/profile"
                className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  الملف الشخصي
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  عرض وتعديل بيانات حسابك الشخصي
                </p>
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          {/* Dashboard header */}
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                لوحة التحكم
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                مرحباً بك، {user?.name || 'جاري التحميل...'}
              </p>
            </div>
            
            <div className="flex space-x-4 rtl:space-x-reverse">
              <Link
                href="/dashboard/notifications"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                الإشعارات
              </Link>
            </div>
          </div>
          
          {/* User welcome section */}
          <div className="px-4 py-5 sm:p-6 bg-gray-50 dark:bg-gray-900/50">
            {status === 'loading' ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  مرحباً بك في لوحة التحكم
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {user ? `تاريخ اليوم: ${new Date().toLocaleDateString('ar-EG')}` : 'يرجى تسجيل الدخول للوصول إلى المحتوى'}
                </p>
              </>
            )}
          </div>
          
          {/* Role-specific sections */}
          <div className="px-4 py-5 sm:p-6">
            {status === 'loading' ? (
              <div className="animate-pulse">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ) : status === 'authenticated' ? (
              renderRoleSpecificContent()
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-red-600 dark:text-red-400">
                  يجب تسجيل الدخول للوصول إلى لوحة التحكم
                </h3>
                <div className="mt-4">
                  <Link
                    href="/auth/login?callbackUrl=/dashboard"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    تسجيل الدخول
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
