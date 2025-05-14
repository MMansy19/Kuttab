"use client"

// These settings prevent static generation issues with session data
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
;

import { useSession } from "next-auth/react";

// Simple dashboard loader/placeholder
export default function DashboardPage() {
  // Safe access to session with fallback for SSG
  const session_result = useSession();
  const { status } = session_result || { status: 'loading' };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          {status === "loading" ? "جاري تحميل لوحة التحكم..." : "جاري التحويل..."}
        </h2>
      </div>
    </div>
  );
}