"use client";

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  /**
   * Content to render if authenticated
   */
  children: ReactNode;
  
  /**
   * Where to redirect if not authenticated
   * @default "/auth/login"
   */
  redirectTo?: string;
  
  /**
   * Loading component to show while checking auth status
   */
  loadingComponent?: ReactNode;
}

/**
 * Component that only renders its children if the user is authenticated
 * Otherwise redirects to login page or specified route
 */
export function ProtectedRoute({
  children,
  redirectTo = "/auth/login",
  loadingComponent = <div className="flex justify-center items-center min-h-screen">جاري التحميل...</div>,
}: ProtectedRouteProps) {
  const { status, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Show loading while checking auth status
  if (status === 'loading') {
    return <>{loadingComponent}</>;
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    const redirectPath = `${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
    router.replace(redirectPath);
    return <>{loadingComponent}</>;
  }
  
  // User is authenticated, render children
  return <>{children}</>;
}
