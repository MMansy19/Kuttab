import '../styles/globals.css';
import type { ReactNode } from 'react';
import { AuthProvider, AuthSyncProvider } from '@/features/auth';
import ToastContainer from '../components/ui/Toast';
import ClientLayout from '../components/ClientLayout';
import { Metadata, Viewport } from 'next';
import { defaultMetadata, defaultViewport } from '@/lib/metadata';

// Use the improved metadata configuration from our centralized file
export const metadata: Metadata = defaultMetadata;
// Export viewport separately according to Next.js 15 requirements
export const viewport: Viewport = defaultViewport;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>      <body className="bg-gray-900 text-white font-[Cairo] min-h-screen flex flex-col transition-colors duration-300">
        <AuthProvider>
          <AuthSyncProvider>
            <ClientLayout>{children}</ClientLayout>
            <ToastContainer />
          </AuthSyncProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
