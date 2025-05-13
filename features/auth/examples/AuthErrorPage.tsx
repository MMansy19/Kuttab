"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/features/auth";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorMessage = searchParams?.get("error") || null;
    setError(errorMessage);
  }, [searchParams]);

  const getErrorMessage = () => {
    switch (error) {
      case "Signin":
        return "حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى بحساب آخر.";
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
      case "Callback":
        return "حدث خطأ أثناء محاولة تسجيل الدخول. الرجاء المحاولة مرة أخرى.";
      case "OAuthAccountNotLinked":
        return "للتأكيد، الرجاء تسجيل الدخول بنفس الحساب الذي استخدمته في المرة الأولى.";
      case "CredentialsSignin":
        return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      case "SessionRequired":
        return "يجب تسجيل الدخول للوصول إلى هذه الصفحة.";
      case "AccessDenied":
        return "ليس لديك صلاحية للوصول إلى هذه الصفحة.";
      case "TokenExpired":
        return "انتهت صلاحية جلسة المستخدم. الرجاء تسجيل الدخول مرة أخرى.";
      case "default":
        return "تعذر تسجيل الدخول. الرجاء المحاولة مرة أخرى.";
      default:
        return "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.";
    }
  };

  const errorTitle = {
    "CredentialsSignin": "خطأ في بيانات الدخول",
    "OAuthAccountNotLinked": "الحساب غير مرتبط",
    "AccessDenied": "غير مصرح بالوصول",
    "SessionRequired": "الجلسة منتهية",
    "TokenExpired": "الجلسة منتهية",
    "Default": "خطأ في المصادقة",
  }[error || "Default"] || "خطأ في المصادقة";

  return (
    <AuthCard title={errorTitle} error={getErrorMessage()}>
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex justify-center mt-6 space-x-4 rtl:space-x-reverse">
          <Link
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-colors"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-5 py-2 rounded-md transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
        
        {error && (
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>رمز الخطأ: {error}</p>
            <p className="mt-2">
              إذا استمرت المشكلة، يرجى{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                الاتصال بالدعم الفني
              </Link>
            </p>
          </div>
        )}
      </div>
    </AuthCard>
  );
}
