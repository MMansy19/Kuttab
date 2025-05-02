"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthForm from "@/components/AuthForm";

// Loading component to show while the form is loading
function AuthFormLoading() {
  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-6"></div>
        <div className="space-y-5">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mt-4"></div>
        </div>
      </div>
    </div>
  );
}

// Create a client component that uses useSearchParams
function LoginContent() {
  const searchParams = useSearchParams();
  const [urlError, setUrlError] = useState<string | null>(null);
  
  useEffect(() => {
    // Get error message from URL if it exists
    const errorParam = searchParams?.get("error");
    if (errorParam) {
      setUrlError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-bold text-center mb-8">مرحبًا بعودتك</h1>
      
      {urlError && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-md mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{urlError}</span>
        </div>
      )}
      <AuthForm type="login" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen py-12 flex flex-col items-center justify-center">
      <Suspense fallback={<AuthFormLoading />}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
