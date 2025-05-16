// app/layout.tsx
import '../styles/globals.css';
import type { ReactNode } from 'react';
import ToastContainer from '../components/ui/Toast';
import { Metadata, Viewport } from 'next';
import { defaultMetadata, defaultViewport } from '@/lib/metadata';
import OptimizedScripts from '../components/performance/OptimizedScripts';
import LoadingScreen from '@/components/LoadingScreen';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';

export const metadata: Metadata = defaultMetadata;
export const viewport: Viewport = defaultViewport;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link
          rel="preload"
          href="/images/icon-192x192.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/images/islamic-pattern.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" as="style" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="bg-gray-900 text-white font-[Cairo] min-h-screen flex flex-col transition-colors duration-300">
        <AuthProvider>
        <LoadingScreen />
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
        <Footer />
        <ToastContainer />
        <OptimizedScripts />
        </AuthProvider>
      </body>
    </html>
  );
}