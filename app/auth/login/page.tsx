"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
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
    <div className="min-h-screen py-12 flex flex-col items-center justify-center">
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
    </div>
  );
}
