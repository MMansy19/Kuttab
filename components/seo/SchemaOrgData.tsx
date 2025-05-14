'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import StructuredData from './StructuredData';
import {
  generateOrganizationSchema,
  generateEducationalServiceSchema,
  generateFaqSchema,
  generatePersonSchema,
  generateCourseSchema,
} from '@/utils/structured-data';

/**
 * Component that adds appropriate schema.org structured data based on current route
 * Enhanced with better path detection and multiple schema support
 */
export default function SchemaOrgData() {
  const pathname = usePathname() || '/';
  const [schemaData, setSchemaData] = useState<Record<string, any> | null>(null);
  const [breadcrumbData, setBreadcrumbData] = useState<Record<string, any> | null>(null);
  
  useEffect(() => {
    // Default organization data is always present
    let data = generateOrganizationSchema();
    let additionalSchema = null;
    let breadcrumb = generateBreadcrumbSchema(pathname);
    setBreadcrumbData(breadcrumb);
    
    // Homepage - add educational service data
    if (pathname === '/') {
      setSchemaData(generateEducationalServiceSchema());
      return;
    }
    
    // Teachers listing page
    else if (pathname === '/teachers') {
      // Default organization schema is sufficient
      setSchemaData(data);
      return;
    }
    
    // Single teacher profile page
    else if (pathname.startsWith('/teachers/') && pathname.split('/').length === 3) {
      // In a real app, you would fetch teacher data here
      // For now, we'll just use a placeholder
      const teacherId = pathname.split('/')[2];
      
      // This would be fetched from your API in production
      const teacherData = {
        name: 'معلم القرآن',
        description: 'معلم متخصص في تعليم القرآن الكريم والتجويد',
        image: `/images/teachers/${teacherId}.webp`,
        jobTitle: 'معلم القرآن',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${pathname}`,
      };
      
      additionalSchema = generatePersonSchema(teacherData);
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
          
          additionalSchema = generateFaqSchema(faqs);
        }
      }
    }
    
    // Contact page
    else if (pathname === '/contact') {
      // Use default organization schema with contact info
    }
    
    // Set the determined schema
    setSchemaData(additionalSchema || data);
  }, [pathname]);
  
  // Generate breadcrumb schema based on current path
  function generateBreadcrumbSchema(path: string): Record<string, any> | null {
    if (path === '/') return null;
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const pathSegments = path.split('/').filter(Boolean);
    
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'الرئيسية',
        'item': baseUrl
      }
    ];
    
    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      
      // Skip certain admin paths from breadcrumbs
      if (segment === 'admin' || segment === 'private') return;
      
      // Get human readable name for the segment
      let name = segment;
      switch(segment) {
        case 'teachers': name = 'المعلمين'; break;
        case 'about': name = 'عن المنصة'; break;
        case 'contact': name = 'اتصل بنا'; break;
        case 'auth': name = 'الحساب'; break;
        case 'login': name = 'تسجيل الدخول'; break;
        case 'signup': name = 'إنشاء حساب'; break;
        case 'donate': name = 'تبرع'; break;
        case 'dashboard': name = 'لوحة التحكم'; break;
        // Add more mappings as needed
        default: name = segment; // Keep original if no mapping
      }
      
      breadcrumbItems.push({
        '@type': 'ListItem',
        'position': breadcrumbItems.length + 1,
        'name': name,
        'item': `${baseUrl}${currentPath}`
      });
    });
    
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbItems
    };
  }
  
  if (!schemaData && !breadcrumbData) {
    return null;
  }
  
  return (
    <>
      {schemaData && <StructuredData data={schemaData} />}
      {breadcrumbData && <StructuredData data={breadcrumbData} />}
    </>
  );
}
