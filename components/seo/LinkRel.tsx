'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface LinkRelProps {
  type: 'next' | 'prev' | 'canonical' | 'alternate';
  href: string;
  hrefLang?: string;
  title?: string;
}

/**
 * LinkRel component for dynamic client-side link relation management
 * Helps search engines understand page relationships and language variants
 */
const LinkRel: React.FC<LinkRelProps> = ({ type, href, hrefLang, title }) => {
  const pathname = usePathname();

  useEffect(() => {
    // Create the link element
    const link = document.createElement('link');
    
    // Set the relationship type
    link.rel = type;
    
    // Set the URL
    link.href = href;
      // Add optional attributes if provided
    if (hrefLang) link.hreflang = hrefLang;
    if (title) link.title = title;
    
    // Add to head
    document.head.appendChild(link);
    
    // Cleanup when component unmounts
    return () => {
      document.head.removeChild(link);
    };
  }, [type, href, hrefLang, title, pathname]);
  
  // This component doesn't render anything visible
  return null;
};

export default LinkRel;
