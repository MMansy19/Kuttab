'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

/**
 * Enhanced SessionProvider that configures proper session caching and optimization
 * This helps prevent multiple redundant session requests
 */
export default function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider 
      // Refresh session only when needed, not on every render
      refetchInterval={0} 
      // Only refetch on window focus if the session might be expired
      refetchOnWindowFocus={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
}