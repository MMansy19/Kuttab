import type { Metadata } from 'next';
import { defaultMetadata, siteKeywords } from '@/lib/metadata';

// Define optimal dynamic parameters to be prerendered at build time
// This helps with SEO by ensuring key pages are indexed faster
export const generateStaticParams = async () => {
  return [];
};

// Define dynamic metadata for this route
export const generateMetadata = async (): Promise<Metadata> => {
  return {
    ...defaultMetadata,
    title: 'كُتّاب | منصة تعليم القرآن الكريم عبر الإنترنت',
    description: 'منصة كُتّاب تجمع بين المعلمين المتخصصين والطلاب الراغبين في تعلم القرآن الكريم والعلوم الإسلامية. انضم إلينا الآن لبداية رحلتك مع القرآن الكريم.',
    keywords: [
      ...siteKeywords,
      'دروس قرآنية مباشرة',
      'تعلم عبر الإنترنت',
      'معلم قرآن أونلاين',
      'منصة تعليمية إسلامية',
    ],
    alternates: {
      canonical: '/',
      languages: {
        'ar-SA': '/',
        'en-US': '/en',
      },
    },
  }
};

// Force static rendering for this route (Next.js 13+)
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// This file re-exports the page component from the client file
export { default } from './page';
