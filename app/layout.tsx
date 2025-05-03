import '../styles/globals.css';
import type { ReactNode } from 'react';
import SessionProvider from '../components/SessionProvider';
import ToastContainer from '../components/ui/Toast';
import { ThemeProvider } from '../context/ThemeContext';
import ClientLayout from '../components/ClientLayout';
import { AnimatePresence } from '../utils/framer-motion';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-emerald-50 text-emerald-900 dark:bg-gray-900 dark:text-white font-[Cairo] min-h-screen flex flex-col transition-colors duration-300">
        <SessionProvider>
          <ThemeProvider>
            <AnimatePresence mode="wait">
              <ClientLayout>{children}</ClientLayout>
              <ToastContainer />
            </AnimatePresence>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
