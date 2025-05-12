'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import StructuredData from './StructuredData';
import {
  generateOrganizationSchema,
  generateEducationalServiceSchema,
  generateFaqSchema,
} from '@/utils/structured-data';

/**
 * Component that adds appropriate schema.org structured data based on current route
 */
export default function SchemaOrgData() {
  const pathname = usePathname();
  const [schemaData, setSchemaData] = useState<Record<string, any> | null>(null);
  
  useEffect(() => {
    // Default organization data
    let data = generateOrganizationSchema();
    
    // Homepage - add educational service data
    if (pathname === '/') {
      setSchemaData(generateEducationalServiceSchema());
      return;
    }
    // About page - add FAQ data if applicable
    else if (pathname === '/about') {
      // Add FAQ schema if we have FAQs on this page
      if (typeof window !== 'undefined') {
        const faqElements = document.querySelectorAll('.faq-item');
        if (faqElements.length > 0) {
          const faqs = Array.from(faqElements).map(el => {
            const questionEl = el.querySelector('.faq-question');
            const answerEl = el.querySelector('.faq-answer');
            return {
              question: questionEl?.textContent || '',
              answer: answerEl?.textContent || '',
            };
          });
          
          setSchemaData(generateFaqSchema(faqs));
          return;
        }
      }
    }
    
    setSchemaData(data);
  }, [pathname]);
  
  if (!schemaData) {
    return null;
  }
  
  return <StructuredData data={schemaData} />;
}
