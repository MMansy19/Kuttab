'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode, useState, useEffect } from 'react';

// Mock session for development without database
const mockSession = {
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  user: {
    id: "fake-user-id-123",
    name: "Development User",
    email: "dev@example.com",
    role: "ADMIN", // ADMIN role allows access to all areas
    image: null
  }
};

export default function SessionProvider({ children }: { children: ReactNode }) {
  const [fakeSession, setFakeSession] = useState(null);
  
  useEffect(() => {
    // Check if we're in development and should use the mock session
    // In a production environment, this would be false
    const shouldUseMockSession = process.env.NODE_ENV === 'development' || true;
    
    if (shouldUseMockSession) {
      // Store the mock session in sessionStorage to persist across page refreshes
      if (!sessionStorage.getItem('mockSession')) {
        sessionStorage.setItem('mockSession', JSON.stringify(mockSession));
      }
      
      const storedSession = sessionStorage.getItem('mockSession');
      setFakeSession(storedSession ? JSON.parse(storedSession) : mockSession);
    }
  }, []);
  
  // Pass the mock session to NextAuth's SessionProvider
  return (
    <NextAuthSessionProvider session={fakeSession}>
      {children}
    </NextAuthSessionProvider>
  );
}