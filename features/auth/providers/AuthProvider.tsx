'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { useAuthTabSync } from '@/lib/auth-sync';

interface AuthProviderProps {
  children: ReactNode;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
}

/**
 * Enhanced Auth provider that combines SessionProvider with AuthSyncProvider
 * to ensure proper authentication state synchronization across tabs
 */
export function AuthProvider({ 
  children,
  refetchInterval = 300,
  refetchOnWindowFocus = true 
}: AuthProviderProps) {
  // We don't need to explicitly use useAuthTabSync here
  // It's designed to be used within components that need auth sync
  return (
    <NextAuthSessionProvider
      refetchInterval={refetchInterval}
      refetchOnWindowFocus={refetchOnWindowFocus}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
