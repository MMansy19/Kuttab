// Role-Based Access Control (RBAC) System
// This module handles permission checks and role-based UI rendering

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

// Define user roles
export type UserRole = 'user' | 'teacher' | 'admin';

// Permission structure
export interface Permission {
  id: string;
  name: string;
  description?: string;
}

// Define permissions for each role
const permissionsByRole: Record<UserRole, string[]> = {
  user: [
    'view_own_bookings',
    'create_booking',
    'cancel_own_booking',
    'view_teachers',
    'update_own_profile',
  ],
  teacher: [
    'view_own_bookings',
    'view_student_bookings',
    'cancel_student_booking', 
    'update_own_profile',
    'manage_availability',
    'view_own_students',
  ],
  admin: [
    'view_all_users',
    'manage_users',
    'view_all_bookings',
    'manage_bookings',
    'manage_teachers',
    'manage_content',
    'view_analytics',
    'system_settings',
  ],
};

// Helper function to check if a user has a specific permission
export const hasPermission = (userRole: UserRole | undefined, permission: string): boolean => {
  if (!userRole) return false;
  return permissionsByRole[userRole]?.includes(permission) || false;
};

// Hook for checking if the current user has a specific permission
export function usePermission(permission: string): boolean {
  const { data: session } = useSession();
  const userRole = session?.user?.role as UserRole | undefined;
  
  return hasPermission(userRole, permission);
}

// Component for conditional rendering based on permissions
interface PermissionGateProps {
  permission: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({ permission, fallback = null, children }: PermissionGateProps) {
  const hasRequiredPermission = usePermission(permission);
  
  return hasRequiredPermission ? <>{children}</> : <>{fallback}</>;
}

// Hook for role-based routing protection
export function useRoleProtection(allowedRoles: UserRole[]) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userRole = session?.user?.role as UserRole | undefined;
  
  useEffect(() => {
    // Check if the authentication status is known
    if (status === 'loading') return;
    
    // If not authenticated, redirect to login
    if (!session) {
      // Save the current path for redirect after login
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/auth/login?returnUrl=${returnUrl}`);
      return;
    }
    
    // If authenticated but role not allowed, redirect to appropriate dashboard
    if (userRole && !allowedRoles.includes(userRole as UserRole)) {
      // More specific dashboard paths for better UX
      switch(userRole) {
        case 'user':
          router.push('/dashboard/user');
          break;
        case 'teacher':
          router.push('/dashboard/teacher');
          break;
        case 'admin':
          router.push('/dashboard/admin');
          break;
        default:
          // Fallback to login if role is undefined or invalid
          router.push('/auth/login');
          console.error('User has invalid role:', userRole);
      }
    }
  }, [session, status, router, allowedRoles, userRole]);
  
  // Return loading status to help with rendering logic
  return { 
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    userRole,
    hasRequiredRole: userRole ? allowedRoles.includes(userRole as UserRole) : false
  };
}

// HOC for role-based page protection
interface RoleProtectedProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  loadingComponent?: ReactNode;
}

export function RoleProtected({ 
  allowedRoles, 
  children, 
  loadingComponent = <div className="flex items-center justify-center p-8">جاري التحميل...</div> 
}: RoleProtectedProps) {
  const { isLoading, hasRequiredRole } = useRoleProtection(allowedRoles);
  
  if (isLoading) {
    return <>{loadingComponent}</>;
  }
  
  // The redirect logic is handled in the hook
  // This will only render if the user has the required role
  return hasRequiredRole ? <>{children}</> : null;
}

// Helper functions for dashboard routing
export const getDashboardPathForRole = (role?: UserRole): string => {
  switch(role) {
    case 'teacher':
      return '/dashboard/teacher';
    case 'admin':
      return '/dashboard/admin';
    case 'user':
    default:
      return '/dashboard/user';
  }
};

export default {
  hasPermission,
  usePermission,
  PermissionGate,
  useRoleProtection,
  RoleProtected,
  getDashboardPathForRole,
};
