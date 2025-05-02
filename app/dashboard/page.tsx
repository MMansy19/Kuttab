"use client";

import { useSession } from "next-auth/react";

// Simple dashboard loader/placeholder
export default function DashboardPage() {
  const { status } = useSession();

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