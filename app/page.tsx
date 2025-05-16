"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

// Import components using dynamic imports for better code splitting
const HeroSection = dynamic(() => import('@/components/home/HeroSection'), { ssr: true });
const FeaturesSection = dynamic(() => import('@/components/home/FeaturesSection'), { ssr: true });
const AboutSection = dynamic(() => import('@/components/home/AboutSection'), { ssr: true });
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), { ssr: true });
const ContactSection = dynamic(() => import('@/components/home/ContactSection'), { ssr: true });
const CTASection = dynamic(() => import('@/components/home/CTASection'), { ssr: true });
const GradientStyles = dynamic(() => import('@/components/home/GradientStyles'), { ssr: true });

export default function Home() {  return (
    <main className="overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
        <CTASection />
        <GradientStyles />
      </Suspense>
    </main>
  );
}
