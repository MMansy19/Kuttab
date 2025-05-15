'use client';

import { ReactNode, useEffect, useState } from 'react';
import ClientLayout from './ClientLayout';

/**
 * A wrapper for ClientLayout that prevents hydration mismatches
 * by only rendering the full layout on the client side after mounting.
 * This is important because ClientLayout uses usePathname() which can
 * have different values during server render vs client hydration.
 */
export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  // Use a useState and useEffect to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);

  // On mount, mark as client rendered
  useEffect(() => {
    setIsClient(true);
  }, []);

  // During the initial server render and hydration phase, return a minimal wrapper
  // that matches what the server would render without any client-specific detection
  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  // Once mounted on client, use the actual ClientLayout component with all features
  return <ClientLayout>{children}</ClientLayout>;
}
