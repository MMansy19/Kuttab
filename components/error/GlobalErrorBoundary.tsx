"use client";

import React, { ReactNode, useEffect } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { useRouter } from 'next/navigation';

interface GlobalErrorBoundaryProps {
  children: ReactNode;
}

/**
 * A custom fallback component for critical errors
 */
const GlobalErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => {
  const router = useRouter();
  
  // Optional: log error to a monitoring service like Sentry
  useEffect(() => {
    // Send to logging service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Uncaught application error:', error);
      
      // If Sentry is configured, you would capture the exception here
      // Sentry.captureException(error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="text-red-500 text-5xl mb-4">😓</div>
      <h2 className="text-2xl font-bold text-red-500 mb-2">حدث خطأ في التطبيق</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        نعتذر عن هذا الخطأ، لقد تم تسجيله تلقائيًا وسيتم إصلاحه في أقرب وقت.
      </p>
      
      <div className="px-8 py-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-right overflow-auto max-w-full">
        <pre className="text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap">
          {error?.message || 'خطأ غير معروف'}
        </pre>
      </div>
      
      <div className="flex gap-4 flex-wrap justify-center">
        <button 
          onClick={resetError}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
        >
          إعادة المحاولة
        </button>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-sm transition-colors"
        >
          العودة للصفحة الرئيسية
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:bg-emerald-50 font-semibold rounded-lg shadow-sm transition-colors"
        >
          تحديث الصفحة
        </button>
      </div>
    </div>
  );
};

/**
 * Global error boundary that wraps the entire application
 * Catches uncaught errors and provides a user-friendly fallback UI
 */
export default function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }) => (
        <GlobalErrorFallback 
          error={error} 
          resetError={resetErrorBoundary} 
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * HOC to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType<{error: Error; resetErrorBoundary: () => void}>
): React.FC<P> {
  const WithErrorBoundary: React.FC<P> = (props) => {
    return (
      <ErrorBoundary 
        fallback={({ error, resetErrorBoundary }) => 
          FallbackComponent ? <FallbackComponent error={error} resetErrorBoundary={resetErrorBoundary} /> : null
        }
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  WithErrorBoundary.displayName = `WithErrorBoundary(${Component.displayName || Component.name || 'Component'})`;
  
  return WithErrorBoundary;
}
