'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface RoleGuardProps {
  /**
   * The roles that are allowed to view this component
   */
  allowedRoles: string[];
  
  /**
   * The content to render if the user is authorized
   */
  children: ReactNode;
  
  /**
   * Optional fallback content to show when user doesn't have permission
   */
  fallback?: ReactNode;
  
  /**
   * Whether to redirect unauthorized users to login or their dashboard
   * @default false
   */
  redirect?: boolean;
  
  /**
   * Optional component to show while loading
   */
  loadingComponent?: ReactNode;
}

/**
 * Component that conditionally renders content based on user roles
 * Can either show fallback content or redirect unauthorized users
 */
export function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
  redirect = false,
  loadingComponent = <div className="p-4 text-center">جاري التحميل...</div>
}: RoleGuardProps) {
  const { user, status } = useAuth();
  const router = useRouter();
  const userRole = user?.role?.toLowerCase() || null;
  
  // While loading the session
  if (status === 'loading') {
    return <>{loadingComponent}</>;
  }
  
  // If not authenticated
  if (status === 'unauthenticated') {
    // Redirect to login if specified
    if (redirect) {
      // Use setTimeout to avoid React hydration issues with immediate redirects
      React.useEffect(() => {
        const redirectTimeout = setTimeout(() => {
          const returnUrl = encodeURIComponent(window.location.pathname);
          router.push(`/auth/login?callbackUrl=${returnUrl}`);
        }, 100);
        
        return () => clearTimeout(redirectTimeout);
      }, [router]);
      
      return <>{loadingComponent}</>;
    }
    
    // Otherwise show fallback
    return <>{fallback}</>;
  }
  
  // Check if user has an allowed role
  const hasAllowedRole = userRole && allowedRoles.includes(userRole);
  
  // If user doesn't have permission but is authenticated
  if (!hasAllowedRole) {
    // Redirect to appropriate dashboard if specified
    if (redirect) {
      // Use setTimeout to avoid React hydration issues
      React.useEffect(() => {
        const redirectTimeout = setTimeout(() => {
          // Determine dashboard based on role
          let dashboardPath = '/dashboard';
          
          switch(userRole) {
            case 'admin':
              dashboardPath = '/dashboard/admin';
              break;
            case 'teacher':
              dashboardPath = '/dashboard/teacher';
              break;
            case 'user':
              dashboardPath = '/dashboard/user';
              break;
          }
          
          router.push(dashboardPath);
        }, 100);
        
        return () => clearTimeout(redirectTimeout);
      }, [router, userRole]);
      
      return <>{loadingComponent}</>;
    }
    
    // Otherwise show fallback
    return <>{fallback}</>;
  }
  
  // User is authenticated and has correct role
  return <>{children}</>;
}
