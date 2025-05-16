"use client"

import React, { ReactNode, Suspense } from "react";

interface AuthCardProps {
  title: string;
  error?: string | null;
  success?: string | null;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  error,
  success,
  children,
  footer,
  className = ""
}: AuthCardProps) {
  return (
    <div dir="rtl" className="min-h-screen py-12 flex flex-col items-center justify-center">
      <div className={`w-full max-w-md ${className}`}>
        <h1 className="text-3xl font-bold text-center mb-8">{title}</h1>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-md mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-md mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        )}
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-6 rounded-md mb-4"></div>}>
          {children}
        </Suspense>

        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  );
}
