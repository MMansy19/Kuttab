import '../styles/globals.css';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth';
import ToastContainer from '../components/ui/Toast';
import { Metadata, Viewport } from 'next';
import { defaultMetadata, defaultViewport } from '@/lib/metadata';

// Import the client component wrapper
import ClientLayoutWrapper from '../components/ClientLayoutWrapper';
// Import optimized scripts component for better performance
import OptimizedScripts from '../components/performance/OptimizedScripts';

export const metadata: Metadata = defaultMetadata;
export const viewport: Viewport = defaultViewport;

export default function RootLayout({ children }: { children: ReactNode }) {  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link rel="preload" href="/images/learn-quran.jpg" as="image" />
        <link rel="preload" href="/images/islamic-pattern.png" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" as="style" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>      
      <body suppressHydrationWarning className="bg-gray-900 text-white font-[Cairo] min-h-screen flex flex-col transition-colors duration-300">
        <AuthProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          <ToastContainer />
          <OptimizedScripts />
        </AuthProvider>
      </body>
    </html>
  );
}