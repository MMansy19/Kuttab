'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

/**
 * Enhanced SessionProvider that configures proper session caching and optimization
 */
export default function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider 
      // Refresh session every 5 minutes (300 seconds)
      refetchInterval={300} 
      // Refetch on window focus to ensure session state is current
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  );
}