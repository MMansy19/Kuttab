import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

// Common dashboard layout for all user types
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // if (!session) {
  //   redirect("/auth/login");
  // }

  // Shared dashboard layout with sidebar navigation
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex min-h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">لوحة التحكم</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                مرحباً، 
                {/* {session.user.name} */}
              </span>
            </div>
          </header>
          
          {/* Main Content Area */}
          <main className="flex-1 p-6">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="py-4 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              جميع الحقوق محفوظة &copy; {new Date().getFullYear()} كتّاب
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}