'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { AuthSyncProvider } from './AuthSyncProvider';

interface AuthProviderProps {
  children: ReactNode;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
  enableSync?: boolean;
}

/**
 * Enhanced Auth provider that combines SessionProvider with AuthSyncProvider
 * to ensure proper authentication state synchronization across tabs
 */
export function AuthProvider({ 
  children,
  refetchInterval = 300,
  refetchOnWindowFocus = true,
  enableSync = true
}: AuthProviderProps) {
  // First wrap with NextAuthSessionProvider
  const content = (
    <NextAuthSessionProvider
      refetchInterval={refetchInterval}
      refetchOnWindowFocus={refetchOnWindowFocus}
    >
      {enableSync ? <AuthSyncProvider>{children}</AuthSyncProvider> : children}
    </NextAuthSessionProvider>
  );
  
  return content;
}
