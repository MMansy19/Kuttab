/**
 * Helper functions to generate JSON-LD structured data for SEO
 * https://developers.google.com/search/docs/guides/intro-structured-data
 */

// Base organization schema
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'كتّاب',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/images/logo.webp`,
    sameAs: [
      'https://facebook.com/kottab',
      'https://twitter.com/kottab',
      'https://instagram.com/kottab',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-123-456-7890',
      contactType: 'customer support',
      availableLanguage: ['Arabic', 'English'],
    },
  };
}

// Course schema for teacher courses
export function generateCourseSchema(course: {
  name: string;
  description: string;
  provider: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider,
      sameAs: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
    url: course.url,
  };
}

// Person schema for teacher profiles
export function generatePersonSchema(teacher: {
  name: string;
  description: string;
  image: string;
  jobTitle?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: teacher.name,
    description: teacher.description,
    image: teacher.image,
    jobTitle: teacher.jobTitle || 'Quran Teacher',
    url: teacher.url,
    worksFor: {
      '@type': 'Organization',
      name: 'كتّاب',
    },
  };
}

// FAQ schema for FAQ sections
export function generateFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Educational service schema
export function generateEducationalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalService',
    name: 'كتّاب - منصة تعليم القرآن الكريم',
    serviceType: 'Islamic Education',
    provider: {
      '@type': 'Organization',
      name: 'كتّاب',
    },
    description: 'منصة كتّاب تجمع بين المعلمين المتخصصين والطلاب الراغبين في تعلم القرآن الكريم والعلوم الإسلامية',
    audience: {
      '@type': 'Audience',
      name: 'Muslim Students',
    },
  };
}
