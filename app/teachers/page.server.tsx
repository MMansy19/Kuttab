import type { Metadata } from 'next';
import { defaultMetadata, siteKeywords } from '@/lib/metadata';
import teachersData from '@/data/teachers';

// Generate static parameters for teacher pages that should be pre-rendered
export const generateStaticParams = async () => {
  // Pre-render the first 10 most experienced teachers for better SEO
  const topTeachers = teachersData
    .sort((a, b) => b.experience - a.experience)
    .slice(0, 10)
    .map(teacher => ({ id: teacher.id }));
    
  return topTeachers;
};

// Define dynamic metadata for this route
export const generateMetadata = async (): Promise<Metadata> => {
  return {
    ...defaultMetadata,
    title: 'معلمون القرآن الكريم | كُتّاب',
    description: 'اكتشف معلمين متخصصين في تعليم القرآن الكريم والعلوم الإسلامية. معلمون مؤهلون لتعليم التلاوة والتجويد والتفسير وعلوم القرآن بطرق احترافية.',
    keywords: [
      ...siteKeywords,
      'معلمون القرآن',
      'أساتذة القرآن',
      'معلمين تجويد',
      'معلم قرآن أونلاين',
      'دروس قرآنية مباشرة',
      'معلمين متخصصين',
    ],
    alternates: {
      canonical: '/teachers',
      languages: {
        'ar-SA': '/teachers',
        'en-US': '/en/teachers',
      },
    },
    openGraph: {
      title: 'معلمون القرآن الكريم | كُتّاب',
      description: 'اكتشف معلمين متخصصين في تعليم القرآن الكريم والعلوم الإسلامية',
      url: '/teachers',
      type: 'website',
    }
  }
};

// Force static rendering with ISR for this route (Next.js 13+)
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// This file re-exports the page component from the client file
export { default } from './page.client';
