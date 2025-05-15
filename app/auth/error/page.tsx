"use client"

// Force dynamic rendering for authentication pages
export const dynamic = 'force-dynamic';

import React, { Suspense } from "react";
import { AuthCard, AuthErrorHandler } from "@/features/auth";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Component that uses useSearchParams
function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  
  return (
    <>
      {error && (
        <AuthErrorHandler
          errorCode={error}
          showToast={true}
          displayError={true}
          errorFallback={
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">
                حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {error && `رمز الخطأ: ${error}`}
              </p>
            </div>
          }
        />
      )}
      
      <div className="flex justify-center mt-6 space-x-4 rtl:space-x-reverse">
        <Link
          href="/auth/login"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
        >
          العودة إلى تسجيل الدخول
        </Link>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
        >
          الصفحة الرئيسية
        </Link>
      </div>
    </>
  );
}

// Loading fallback component
function ErrorPageLoading() {
  return <div className="p-4 text-center">جاري التحميل...</div>;
}

export default function ErrorPage() {
  return (
    <div className="min-h-screen py-12 flex flex-col items-center justify-center">
      <AuthCard title="خطأ في المصادقة">
        <Suspense fallback={<ErrorPageLoading />}>
          <ErrorContent />
        </Suspense>
      </AuthCard>
    </div>
  );
}
