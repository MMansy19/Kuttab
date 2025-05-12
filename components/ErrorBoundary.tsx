// Global Error Boundary Component for React
"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Optional: Send to a logging service like Sentry
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">😓</div>
          <h2 className="text-2xl font-bold text-red-500 mb-2">حدث خطأ ما</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            نعتذر عن هذا الخطأ، يرجى المحاولة مرة أخرى
          </p>
          <div className="px-8 py-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-right overflow-auto max-w-full">
            <pre className="text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap">
              {this.state.error?.message || 'خطأ غير معروف'}
            </pre>
          </div>
          <div className="flex gap-4">
            <Button variant="default" onClick={this.resetErrorBoundary}>
              حاول مرة أخرى
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              تحديث الصفحة
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
