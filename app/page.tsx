"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

// Import components using dynamic imports for better code splitting with specific loading states
const HeroSection = dynamic(() => import('@/components/home/HeroSection'), { 
  ssr: true,
  loading: () => <div className="h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900/70 via-blue-900/70 to-gray-900/70"><LoadingScreen /></div>
});

const FeaturesSection = dynamic(() => import('@/components/home/FeaturesSection'), { 
  ssr: true,
  loading: () => <div className="py-20 bg-white dark:bg-gray-900"></div>
});

const AboutSection = dynamic(() => import('@/components/home/AboutSection'), { 
  ssr: true,
  loading: () => <div className="py-20 bg-gray-50 dark:bg-gray-800"></div>
});

const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), { 
  ssr: true,
  loading: () => <div className="py-20 bg-white dark:bg-gray-900"></div>
});

const ContactSection = dynamic(() => import('@/components/home/ContactSection'), { 
  ssr: true,
  loading: () => <div className="py-20 bg-gray-50 dark:bg-gray-800"></div>
});

const CTASection = dynamic(() => import('@/components/home/CTASection'), { 
  ssr: true,
  loading: () => <div className="py-16 bg-gradient-to-r from-emerald-700 to-blue-800"></div>
});

const GradientStyles = dynamic(() => import('@/components/home/GradientStyles'), { 
  ssr: true 
});

export default function Home() {  
  return (
    <main className="overflow-hidden">
      {/* Hero section is rendered with priority and its own loading state */}
      <HeroSection />
      
      {/* Features section */}
      <Suspense fallback={
        <div className="py-20 bg-white dark:bg-gray-900" aria-hidden="true" />
      }>
        <FeaturesSection />
      </Suspense>
      
      {/* About section */}
      <Suspense fallback={
        <div className="py-20 bg-gray-50 dark:bg-gray-800" aria-hidden="true" />
      }>
        <AboutSection />
      </Suspense>
      
      {/* Testimonials section */}
      <Suspense fallback={
        <div className="py-20 bg-white dark:bg-gray-900" aria-hidden="true" />
      }>
        <TestimonialsSection />
      </Suspense>
      
      {/* Contact section */}
      <Suspense fallback={
        <div className="py-20 bg-gray-50 dark:bg-gray-800" aria-hidden="true" />
      }>
        <ContactSection />
      </Suspense>
      
      {/* CTA section */}
      <Suspense fallback={
        <div className="py-16 bg-gradient-to-r from-emerald-700 to-blue-800" aria-hidden="true" />
      }>
        <CTASection />
      </Suspense>
      
      {/* Global styles */}
      <GradientStyles />
    </main>
  );
}
