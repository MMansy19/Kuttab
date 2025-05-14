"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './useAuth';

interface AuthRedirectOptions {
  /**
   * URL to redirect to if user is authenticated
   * @default "/dashboard"
   */
  authRedirectUrl?: string;
  
  /**
   * URL to redirect to if user is not authenticated
   * @default "/auth/login"
   */
  unauthRedirectUrl?: string;
  
  /**
   * If true, redirect authenticated users
   * If false, redirect unauthenticated users
   * @default false
   */
  redirectAuthenticated?: boolean;
  
  /**
   * Role required to access the page
   * If provided, users without this role will be redirected
   */
  requiredRole?: string;
  
  /**
   * Whether to include the current URL in the redirect
   * @default true
   */
  includeCallbackUrl?: boolean;
}

/**
 * Hook for handling authentication-based redirects
 */
export function useAuthRedirect({
  authRedirectUrl = "/dashboard",
  unauthRedirectUrl = "/auth/login",
  redirectAuthenticated = false,
  requiredRole,
  includeCallbackUrl = true,
}: AuthRedirectOptions = {}) {  // Use useAuth which already has the safe session handling implemented
  const { user, status, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    // Build callback URL if needed
    const callbackParam = includeCallbackUrl ? 
      `?callbackUrl=${encodeURIComponent(window.location.href)}` : '';
    
    // Redirect authenticated users (for login/register pages)
    if (redirectAuthenticated && isAuthenticated) {
      router.replace(authRedirectUrl);
      return;
    }

    // Redirect unauthenticated users (for protected pages)
    if (!redirectAuthenticated && !isAuthenticated) {
      router.replace(`${unauthRedirectUrl}${callbackParam}`);
      return;
    }    // Role-based redirect
    if (requiredRole && (user as any)?.role !== requiredRole) {
      router.replace(`/dashboard`);
      return;
    }
  }, [
    isAuthenticated, 
    status, 
    router, 
    authRedirectUrl, 
    unauthRedirectUrl, 
    redirectAuthenticated, 
    requiredRole, 
    includeCallbackUrl,
    (user as any)?.role
  ]);

  return { isAuthenticated, user, status };
}
