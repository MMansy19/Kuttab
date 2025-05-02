import React, { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Sign Up | KOTTAB",
  description: "Create a new KOTTAB account",
};

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

export default function SignupPage() {
  return (
    <div className="min-h-screen py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">إنشاء حسابك</h1>
        <Suspense fallback={<AuthFormLoading />}>
          <AuthForm type="signup" />
        </Suspense>
      </div>
    </div>
  );
}