import { NextFont } from 'next/dist/compiled/@next/font';
import localFont from 'next/font/local';

// Define the Cairo font with optimized loading
export const cairo = localFont({
  src: [
    {
      path: '../public/fonts/cairo/Cairo-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/cairo/Cairo-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/cairo/Cairo-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/cairo/Cairo-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/cairo/Cairo-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/cairo/Cairo-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  display: 'swap', // Ensures text is never invisible during load
  fallback: ['Arial', 'sans-serif'],
  preload: true,
  variable: '--font-cairo',
});
