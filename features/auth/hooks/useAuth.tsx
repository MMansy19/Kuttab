"use client";

import { useSession, signOut } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { authApiService } from '../services/auth-api-service'; 
import { authService } from '../services/auth-service';
import { LoginCredentials, AuthUser, RegisterData, AuthResult } from '../types';

/**
 * Hook that provides authentication state and methods
 */
export function useAuth() {
  // Check if we're in build mode to provide mock data during static generation
  const isBuildMode = typeof window !== 'undefined' ? 
    window?.__NEXT_DATA__?.buildId === 'development' || 
    process.env.NEXT_PUBLIC_BUILD_MODE === 'true' : false;
  
  // Handle special build mode by providing empty session data
  if (isBuildMode && process.env.NEXT_PUBLIC_SKIP_AUTH_CHECK === 'true') {
    return {
      user: null,
      status: 'unauthenticated',
      loading: false,
      login: async () => ({ success: false, error: 'In build mode' }),
      register: async () => ({ success: false, error: 'In build mode' }),
      logout: async () => {},
      isAuthenticated: false,
      isLoading: false,
    };
  }
  
  // Safe access to session data with proper fallback values for SSG/SSR
  const session_result = useSession();
  const { data: session, status, update } = session_result || { 
    data: null, 
    status: 'loading', 
    update: () => Promise.resolve(null) 
  };
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch additional user data when session changes
  useEffect(() => {
    async function loadUserProfile() {
      if (status === 'authenticated' && session?.user?.email) {
        try {
          const userData = await authApiService.getCurrentUserProfile();
          if (userData) {
            setUser(userData);
          } else {          // If we couldn't get additional profile data, use session data
            // First, extend the session user type to include our custom properties
            const userWithExtras = {
              ...session.user,
              id: (session.user as any).id as string,
              role: (session.user as any).role as string
            };
            
            setUser(userWithExtras as AuthUser);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        } finally {
          setLoading(false);
        }
      } else if (status === 'unauthenticated') {
        setUser(null);
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [session, status]);

  // Login method
  const login = useCallback(
    async (credentials: LoginCredentials, callbackUrl?: string): Promise<AuthResult> => {
      setLoading(true);
      try {
        const result = await authService.login(credentials, callbackUrl);
        if (result.success) {
          await update(); // Refresh the session
        }
        return result;
      } finally {
        setLoading(false);
      }
    },
    [update]
  );
  // Register method
  const register = useCallback(
    async (data: RegisterData): Promise<AuthResult> => {
      setLoading(true);
      try {
        return await authService.register(data);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Logout method
  const logout = useCallback(
    async (callbackUrl?: string) => {
      setLoading(true);
      try {
        await signOut({ redirect: !!callbackUrl, callbackUrl });
        setUser(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    user,
    status,
    loading,
    login,
    register,
    logout,
    isAuthenticated: status === 'authenticated' && !!user,
    isLoading: status === 'loading' || loading,
  };
}
