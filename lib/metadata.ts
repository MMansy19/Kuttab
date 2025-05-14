import { Metadata, Viewport } from "next";

/**
 * Enhanced metadata configuration for optimal SEO performance
 * Implements best practices for search engine visibility
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteName = 'كُتّاب';
const defaultTitle = 'كُتّاب | منصة تعليم القرآن الكريم عبر الإنترنت';
const defaultDescription = 'منصة كُتّاب تجمع بين المعلمين المتخصصين والطلاب الراغبين في تعلم القرآن الكريم والعلوم الإسلامية. تعلم القرآن، التجويد، والعلوم الإسلامية من خلال معلمين مؤهلين عن بعد.';

// Standard keywords to rank higher in Islamic educational searches
export const siteKeywords = [
  'تعليم القرآن',
  'حفظ القرآن',
  'دروس تجويد',
  'معلمين قرآن',
  'تعليم عن بعد',
  'دروس إسلامية',
  'تعلم القرآن أونلاين',
  'حفظ القرآن عن بعد',
  'معلم قرآن مؤهل',
  'دروس قرآن افتراضية',
  'تفسير القرآن',
  'تعلم التجويد',
  'قراءة صحيحة للقرآن',
  'تعليم الأطفال القرآن',
  'دورات إسلامية أونلاين',
  'علوم شرعية',
  'حصص قرآنية للأطفال',
  'معلم قرآن محترف',
  'منصة تعليمية إسلامية',
  'كُتّاب اونلاين',
];

// Export viewport with improved mobile optimization
export const defaultViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#047857', // Match with your brand color
  colorScheme: 'dark light',
};

// Base metadata shared by all pages
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: '%s | كُتّاب', // Used for individual page titles
  },
  description: defaultDescription,
  keywords: siteKeywords,
  authors: [
    { name: siteName, url: siteUrl },
  ],
  creator: siteName,
  publisher: siteName,
  applicationName: siteName,
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
      noimageindex: false,
    }
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName: siteName,
    locale: 'ar_SA',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${siteName} - منصة تعليم القرآن`,
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [`${siteUrl}/images/twitter-image.jpg`],
    site: '@kottab',
    creator: '@kottab',
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'ar': siteUrl,
    },
    types: {
      'application/rss+xml': `${siteUrl}/rss.xml`,
    }
  },  verification: {
    google: 'google-site-verification-token',
    yandex: 'yandex-verification-token',
    other: {
      'msvalidate.01': 'bing-verification-token',
      'yahoo-verification': 'yahoo-verification-token'
    },
  },
  // Additional meta tags for better indexing
  other: {
    'google-site-verification': 'your-google-site-verification-code', 
    'msvalidate.01': 'your-bing-verification-code',
    'yandex-verification': 'your-yandex-verification-code',
    'norton-safeweb-site-verification': 'norton-verification-code',
    'p:domain_verify': 'pinterest-verification-code',
  },
  category: 'education',
  assets: [`${siteUrl}/favicon.ico`],
  manifest: `${siteUrl}/manifest.json`,
  archives: [`${siteUrl}/blog/archive`],
  bookmarks: [`${siteUrl}/features`],
  classification: 'Islamic Education',
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: 'black-translucent',
  },
};

// Helper to create page-specific metadata
interface PageMetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  canonicalPath?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
}

/**
 * Creates page-specific metadata based on default settings
 * Use this function when defining metadata for specific routes
 */
export function createPageMetadata({
  title,
  description,
  keywords = [],
  image,
  canonicalPath,
  robots,
}: PageMetadataProps): Metadata {
  const pageUrl = canonicalPath ? `${siteUrl}${canonicalPath}` : undefined;
  const imageUrl = image ? `${siteUrl}${image}` : undefined;
  
  return {
    title: title,
    description: description,
    keywords: [...siteKeywords, ...keywords],
    alternates: {
      canonical: pageUrl,
    },
    robots: robots ? {
      index: robots.index,
      follow: robots.follow,
      googleBot: {
        index: robots.index,
        follow: robots.follow,
      }
    } : undefined,
    openGraph: title || description || imageUrl ? {
      title: title || defaultTitle,
      description: description || defaultDescription,
      url: pageUrl,
      ...(imageUrl && {
        images: [{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || defaultTitle,
        }]
      })
    } : undefined,
    twitter: title || description || imageUrl ? {
      title: title || defaultTitle,
      description: description || defaultDescription,
      ...(imageUrl && { images: [imageUrl] })
    } : undefined,
  };
}
