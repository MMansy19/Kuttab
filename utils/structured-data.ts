/**
 * Helper functions to generate JSON-LD structured data for SEO
 * https://developers.google.com/search/docs/guides/intro-structured-data
 */

// Base organization schema
export function generateOrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'كتّاب',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/images/logo.webp`,
      width: 192,
      height: 192
    },
    sameAs: [
      'https://facebook.com/kottab',
      'https://twitter.com/kottab',
      'https://instagram.com/kottab',
      'https://youtube.com/kottab',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-123-456-7890',
      contactType: 'customer support',
      availableLanguage: ['Arabic', 'English'],
      email: 'support@kottab.com',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Saudi Arabia',
      addressLocality: 'Riyadh',
    },
    foundingDate: '2023-01-01',
    founders: [
      {
        '@type': 'Person',
        name: 'مؤسس كتّاب'
      }
    ],
    slogan: 'تعلم القرآن الكريم بطريقة سهلة وفعالة',
  };
}

// Course schema for teacher courses
export function generateCourseSchema(course: {
  name: string;
  description: string;
  provider: string;
  url: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  timeRequired?: string;
  teaches?: string[];
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider || 'كتّاب',
      sameAs: baseUrl,
    },
    url: course.url,
    ...(course.image && { image: course.image }),
    ...(course.startDate && { startDate: course.startDate }),
    ...(course.endDate && { endDate: course.endDate }),
    ...(course.timeRequired && { timeRequired: course.timeRequired }),
    ...(course.teaches && { teaches: course.teaches }),
    inLanguage: ['ar', 'en'],
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'SAR',
    },
    educationalCredentialAwarded: 'شهادة في تعليم القرآن الكريم',
  };
}

// Person schema for teacher profiles
export function generatePersonSchema(teacher: {
  name: string;
  description: string;
  image: string;
  jobTitle?: string;
  url: string;
  gender?: string;
  nationality?: string;
  specialty?: string[];
  rating?: number;
  reviewCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: teacher.name,
    description: teacher.description,
    image: teacher.image,
    jobTitle: teacher.jobTitle || 'معلم القرآن الكريم',
    url: teacher.url,
    worksFor: {
      '@type': 'Organization',
      name: 'كتّاب',
    },
    ...(teacher.gender && { gender: teacher.gender }),
    ...(teacher.nationality && { nationality: teacher.nationality }),
    ...(teacher.specialty && { knowsAbout: teacher.specialty }),
    ...(teacher.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: teacher.rating.toString(),
        reviewCount: (teacher.reviewCount || 0).toString(),
        bestRating: '5',
        worstRating: '1',
      }
    }),
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalService',
    name: 'كتّاب - منصة تعليم القرآن الكريم',
    serviceType: 'Islamic Education',
    provider: {
      '@type': 'Organization',
      name: 'كتّاب',
      url: baseUrl,
    },
    description: 'منصة كتّاب تجمع بين المعلمين المتخصصين والطلاب الراغبين في تعلم القرآن الكريم والعلوم الإسلامية',
    audience: {
      '@type': 'Audience',
      audienceType: 'Muslim Students',
      geographicArea: {
        '@type': 'AdministrativeArea',
        name: 'Global'
      }
    },
    availableLanguage: ['Arabic', 'English'],
    serviceOutput: 'تعلم القرآن الكريم والعلوم الإسلامية',
    termsOfService: `${baseUrl}/terms`,
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 24.7136,
        longitude: 46.6753,
      },
      geoRadius: '20000', // Global service
    },
  };
}

// Reviews schema for teacher reviews
export function generateReviewSchema(reviewData: {
  itemReviewed: string;
  reviewCount: number;
  ratingValue: number;
  reviews?: Array<{
    author: string;
    datePublished: string;
    reviewBody: string;
    ratingValue: number;
  }>;
}) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: reviewData.itemReviewed,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: reviewData.ratingValue.toString(),
      reviewCount: reviewData.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
  };

  // Add individual reviews if provided
  if (reviewData.reviews && reviewData.reviews.length > 0) {
    return {
      ...baseSchema,
      review: reviewData.reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author,
        },
        datePublished: review.datePublished,
        reviewBody: review.reviewBody,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.ratingValue.toString(),
          bestRating: '5',
          worstRating: '1',
        },
      })),
    };
  }

  return baseSchema;
}

// Website schema for sitewide structured data
export function generateWebsiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'كتّاب - منصة تعليم القرآن الكريم',
    url: baseUrl,
    description: 'منصة كتّاب تجمع بين المعلمين المتخصصين والطلاب الراغبين في تعلم القرآن الكريم والعلوم الإسلامية',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/teachers?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'ar-SA',
    copyrightYear: new Date().getFullYear(),
    author: {
      '@type': 'Organization',
      name: 'كتّاب'
    }
  };
}

// Event schema for Quran classes or special events
export function generateEventSchema(eventData: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  imageUrl?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: eventData.name,
    description: eventData.description,
    startDate: eventData.startDate,
    endDate: eventData.endDate,
    location: {
      '@type': 'VirtualLocation',
      url: eventData.location || baseUrl,
    },
    organizer: {
      '@type': 'Organization',
      name: eventData.organizer || 'كتّاب',
      url: baseUrl,
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    ...(eventData.imageUrl && { image: eventData.imageUrl }),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      url: baseUrl,
    }
  };
}
      name: 'Muslim Students',
    },
  };
}
