"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaCalendarCheck, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';

const navLinks = [
  {
    title: "لوحة التحكم",
    path: "/dashboard/admin",
    icon: <FaChartBar />
  },
  {
    title: "المستخدمين",
    path: "/dashboard/admin/users",
    icon: <FaUsers />
  },
  {
    title: "المعلمين",
    path: "/dashboard/admin/teachers",
    icon: <FaChalkboardTeacher />
  },
  {
    title: "الحجوزات",
    path: "/dashboard/admin/bookings",
    icon: <FaCalendarCheck />
  },
  {
    title: "الإعدادات",
    path: "/dashboard/admin/settings",
    icon: <FaCog />
  }
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white dark:bg-gray-800 shadow"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-8">
            <Link href="/dashboard/admin" className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              لوحة تحكم المشرف
            </Link>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.path || 
                               (link.path !== '/dashboard/admin' && pathname && pathname.startsWith(link.path));

              return (
                <Link
                  href={link.path}
                  key={index}
                  className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.title}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 right-0 w-full p-6">
            <button
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 py-2 px-4 w-full hover:text-red-500 dark:hover:text-red-400 transition-colors"
              onClick={() => {
                // In a real app, this would call a logout function
                window.location.href = '/auth/login';
              }}
            >
              <FaSignOutAlt />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:mr-64 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}