'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

/**
 * Component to add structured data (JSON-LD) to a page for SEO
 */
export default function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Create a script element
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(data);
    
    // Add it to the document head
    document.head.appendChild(script);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
  
  // This component doesn't render anything visible
  return null;
}
