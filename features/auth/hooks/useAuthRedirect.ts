"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './useAuth';

interface UseAuthRedirectOptions {
  /**
   * Where to redirect authenticated users
   * @default "/dashboard"
   */
  authenticatedRedirectTo?: string;
  
  /**
   * Where to redirect unauthenticated users
   * @default "/auth/login"
   */
  unauthenticatedRedirectTo?: string;
  
  /**
   * If true, will redirect authenticated users away from pages like login/signup
   * @default true
   */
  redirectIfAuthenticated?: boolean;
  
  /**
   * If true, will redirect unauthenticated users away from protected pages
   * @default false
   */
  redirectIfUnauthenticated?: boolean;
  
  /**
   * Role requirements for this redirect
   * If specified, will redirect users who don't have one of these roles
   */
  requiredRoles?: string[];
  
  /**
   * Query parameter name to use for storing the return URL
   * @default "callbackUrl"
   */
  callbackUrlParam?: string;
  
  /**
   * Whether to include the current URL as a callback parameter when redirecting
   * @default true
   */
  preserveReturnUrl?: boolean;
}

/**
 * Hook that handles common authentication redirect patterns
 * Use this for auth pages, protected pages, and role-specific pages
 */
export function useAuthRedirect({
  authenticatedRedirectTo = "/dashboard",
  unauthenticatedRedirectTo = "/auth/login",
  redirectIfAuthenticated = true,
  redirectIfUnauthenticated = false,
  requiredRoles = [],
  callbackUrlParam = "callbackUrl",
  preserveReturnUrl = true,
}: UseAuthRedirectOptions = {}) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Don't redirect while still loading
    if (status === 'loading') {
      return;
    }
    
    // Get user role if available
    const userRole = user?.role?.toLowerCase();
    
    // For authenticated users on auth pages
    if (status === 'authenticated' && redirectIfAuthenticated) {
      // Check role requirements if any
      if (requiredRoles.length > 0 && userRole) {
        const hasRequiredRole = requiredRoles.some(role => 
          role.toLowerCase() === userRole
        );
        
        // If user doesn't have required role, redirect to dashboard
        if (!hasRequiredRole) {
          // Determine appropriate dashboard based on role
          let roleDashboard = "/dashboard";
          if (userRole === 'admin') roleDashboard = "/dashboard/admin";
          else if (userRole === 'teacher') roleDashboard = "/dashboard/teacher";
          else if (userRole === 'user') roleDashboard = "/dashboard/user";
          
          router.replace(roleDashboard);
          return;
        }
      }
      
      // Redirect to authenticated destination (taking into account user role)
      let destination = authenticatedRedirectTo;
      
      // Dynamically determine destination based on role if it's a dashboard URL
      if (destination === "/dashboard" && userRole) {
        if (userRole === 'admin') destination = "/dashboard/admin";
        else if (userRole === 'teacher') destination = "/dashboard/teacher";
        else if (userRole === 'user') destination = "/dashboard/user";
      }
      
      router.replace(destination);
      return;
    }
    
    // For unauthenticated users on protected pages
    if (status === 'unauthenticated' && redirectIfUnauthenticated) {
      // Add the current path as return URL
      let destination = unauthenticatedRedirectTo;
      
      // Append the callback URL parameter if needed
      if (preserveReturnUrl && pathname) {
        const separator = destination.includes('?') ? '&' : '?';
        const encodedReturnUrl = encodeURIComponent(pathname);
        destination = `${destination}${separator}${callbackUrlParam}=${encodedReturnUrl}`;
      }
      
      router.replace(destination);
      return;
    }
  }, [
    status, 
    user, 
    router, 
    pathname,
    redirectIfAuthenticated, 
    redirectIfUnauthenticated,
    authenticatedRedirectTo,
    unauthenticatedRedirectTo,
    requiredRoles,
    callbackUrlParam,
    preserveReturnUrl
  ]);
  
  // Return auth state for convenience
  return { user, status };
}
