import '../styles/globals.css';
import type { ReactNode } from 'react';
import ToastContainer from '../components/ui/Toast';
import { Metadata, Viewport } from 'next';
import { defaultMetadata, defaultViewport } from '@/lib/metadata';
import LoadingScreen from '@/components/LoadingScreen';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import ClientOptimizedScripts from '@/components/performance/ClientOptimizedScripts';

export const metadata: Metadata = defaultMetadata;
export const viewport: Viewport = defaultViewport;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        {/* Local font preloading */}
        <link
          rel="preload"
          href="/fonts/Cairo-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Cairo-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
          @font-face {
            font-family: 'Cairo';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('/fonts/Cairo-Regular.woff2') format('woff2');
          }
          @font-face {
            font-family: 'Cairo';
            font-style: normal;
            font-weight: 700;
            font-display: swap;
            src: url('/fonts/Cairo-Bold.woff2') format('woff2');
          }
        `}} />

        {/* Critical image preloads */}
        <link
          rel="preload"
          href="/images/hero-image.avif"
          as="image"
          type="image/avif"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/images/islamic-pattern.webp"
          as="image"
          type="image/webp"
        />
      </head>
      <body suppressHydrationWarning className="bg-gray-900 text-white font-[Cairo] min-h-screen flex flex-col">
        <AuthProvider>
          <LoadingScreen />
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-6">{children}</main>          <Footer />
          <ToastContainer />
          <ClientOptimizedScripts />
        </AuthProvider>
      </body>
    </html>
  );
}