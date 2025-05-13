"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from '../hooks/useAuth';
import { addToast } from '@/utils/toast';

interface AuthErrorHandlerProps {
  /**
   * Error code from URL or API
   */
  errorCode?: string | null;
  
  /**
   * Whether to show a toast notification
   * @default true
   */
  showToast?: boolean;
  
  /**
   * Children to render
   */
  children?: React.ReactNode;
  
  /**
   * Fallback UI to show when an error occurs
   */
  errorFallback?: React.ReactNode;
  
  /**
   * Where to redirect on error
   */
  redirectTo?: string;
  
  /**
   * Callback function when error occurs
   */
  onError?: (error: string) => void;
  
  /**
   * Whether to display an error message component
   * @default false
   */
  displayError?: boolean;
}

/**
 * Maps authentication error codes to user-friendly messages
 */
export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'Signin':
      return "حدث خطأ أثناء تسجيل الدخول، الرجاء المحاولة مرة أخرى.";
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'OAuthCreateAccount':
    case 'EmailCreateAccount':
    case 'Callback':
      return "حدث خطأ أثناء مصادقة الحساب الخارجي، الرجاء المحاولة مرة أخرى.";
    case 'OAuthAccountNotLinked':
      return "للمصادقة، الرجاء استخدام نفس الحساب الذي استخدمته في المرة الأولى.";
    case 'CredentialsSignin':
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    case 'SessionRequired':
      return "يجب تسجيل الدخول للوصول إلى هذه الصفحة.";
    case 'AccessDenied':
      return "ليس لديك صلاحية للوصول إلى هذه الصفحة.";
    case 'EmailSignin':
      return "حدث خطأ في إرسال رابط تسجيل الدخول، الرجاء التحقق من البريد الإلكتروني والمحاولة مرة أخرى.";
    case 'VerifyRequest':
      return "تم إرسال رابط التحقق، الرجاء التحقق من بريدك الإلكتروني.";
    case 'TokenExpired':
      return "انتهت صلاحية رمز المصادقة، الرجاء تسجيل الدخول مرة أخرى.";
    case 'Default':
    default:
      return "حدث خطأ غير متوقع، الرجاء المحاولة مرة أخرى.";
  }
};

/**
 * Get an error title from an error code
 */
export const getAuthErrorTitle = (errorCode: string): string => {
  switch (errorCode) {
    case "CredentialsSignin":
      return "خطأ في بيانات الدخول";
    case "OAuthAccountNotLinked":
      return "الحساب غير مرتبط";
    case "AccessDenied":
      return "غير مصرح بالوصول";
    case "SessionRequired":
      return "الجلسة منتهية";
    case "TokenExpired":
      return "الجلسة منتهية";
    default:
      return "خطأ في المصادقة";
  }
};

/**
 * Component that handles authentication errors
 * 
 * This component can:
 * - Display error messages from URL parameters
 * - Show toast notifications for auth errors
 * - Redirect to a specified page on error
 * - Show a fallback UI when errors occur
 * 
 * @example
 * // Basic usage
 * <AuthErrorHandler>
 *   <YourProtectedComponent />
 * </AuthErrorHandler>
 * 
 * @example
 * // With explicit error handling
 * <AuthErrorHandler 
 *   errorCode="SessionExpired"
 *   redirectTo="/auth/login"
 *   onError={(err) => console.log(err)}
 * >
 *   <Dashboard />
 * </AuthErrorHandler>
 */
export function AuthErrorHandler({
  errorCode: propErrorCode,
  showToast = true,
  children,
  errorFallback,
  redirectTo,
  onError,
  displayError = false
}: AuthErrorHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { status } = useAuth();
  
  useEffect(() => {
    // Check for error from props first, then URL
    const urlError = searchParams?.get("error");
    const currentError = propErrorCode || urlError;
    
    if (currentError) {
      const decodedError = typeof currentError === 'string' ? decodeURIComponent(currentError) : null;
      setError(decodedError);
      
      if (decodedError) {
        const message = getAuthErrorMessage(decodedError);
        setErrorMessage(message);
        
        if (onError) {
          onError(decodedError);
        }
        
        if (showToast) {
          addToast(message, 'error');
        }
        
        // Redirect if specified
        if (redirectTo) {
          router.push(redirectTo);
        }
      }
    }
  }, [propErrorCode, searchParams, showToast, redirectTo, router, onError]);
  
  // Show error fallback if there's an error and fallback is provided
  if (error && errorFallback) {
    return <>{errorFallback}</>;
  }
  
  // Show error message component if displayError is true
  if (displayError && errorMessage && status !== 'authenticated') {
    return (
      <>
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mr-3">
              <h3 className="text-sm font-medium">{error ? getAuthErrorTitle(error) : 'خطأ في المصادقة'}</h3>
              <div className="mt-2 text-sm">{errorMessage}</div>
            </div>
          </div>
        </div>
        {children}
      </>
    );
  }
  
  // Otherwise, show children
  return <>{children}</>;
}
