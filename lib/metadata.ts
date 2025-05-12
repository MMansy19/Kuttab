import { Metadata } from "next";

// Default metadata configuration for the entire site
// Override in specific pages as needed

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'كُتّاب | منصة تعليم القرآن الكريم عبر الإنترنت',
    template: '%s | كُتّاب',
  },
  description: 'منصة كُتّاب تجمع بين المعلمين المتخصصين والطلاب الراغبين في تعلم القرآن الكريم والعلوم الإسلامية',
  keywords: [
    'تعليم القرآن',
    'حفظ القرآن',
    'دروس تجويد',
    'معلمين قرآن',
    'تعليم عن بعد',
    'دروس إسلامية',
    'تعلم القرآن أونلاين',
    'حفظ القرآن عن بعد',
    'معلم قرآن',
    'دروس قرآن'
  ],
  authors: [{ name: 'كُتّاب' }],
  creator: 'كُتّاب',
  publisher: 'كُتّاب',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  openGraph: {
    title: 'كُتّاب | منصة تعليم القرآن الكريم عبر الإنترنت',
    description: 'منصة كُتّاب تجمع بين المعلمين المتخصصين والطلاب الراغبين في تعلم القرآن الكريم والعلوم الإسلامية',
    url: siteUrl,
    siteName: 'كُتّاب',
    locale: 'ar_SA',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'كُتّاب - منصة تعليم القرآن',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'كُتّاب | منصة تعليم القرآن الكريم عبر الإنترنت',
    description: 'منصة كُتّاب تجمع بين المعلمين المتخصصين والطلاب الراغبين في تعلم القرآن الكريم والعلوم الإسلامية',
    images: [`${siteUrl}/images/twitter-image.jpg`],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'ar': siteUrl,
    },
  },
  verification: {
    // Add your verification tokens here when available
    google: 'google-site-verification-token',
    // yandex: 'yandex-verification-token',
    // bing: 'bing-verification-token',
  },
  // Add structured data for better SEO
  other: {
    'google-site-verification': 'your-google-site-verification-code',
  },
  assets: [`${siteUrl}/favicon.ico`],
  manifest: `${siteUrl}/manifest.json`,
};
