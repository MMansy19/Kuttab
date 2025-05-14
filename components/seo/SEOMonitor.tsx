'use client';

import React, { useEffect, useState } from 'react';

interface SEOMonitorProps {
  pageUrl?: string;
}

/**
 * SEOMonitor component for development and testing
 * Helps verify SEO implementations and provides insights into page optimization
 * This should be disabled in production or shown only to admin users
 */
const SEOMonitor: React.FC<SEOMonitorProps> = ({ pageUrl }) => {
  const [seoData, setSeoData] = useState<{
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    ogTags: Record<string, string>;
    metaTags: Record<string, string>;
    h1Count: number;
    linkCount: number;
    imgCount: number;
    imgWithoutAlt: number;
    pageSize: string;
    loadTime: string;
    structuredData: string[];
  } | null>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Only run this in development or for admin users
    if (process.env.NODE_ENV !== 'development' && !localStorage.getItem('isAdmin')) {
      return;
    }
    
    // Get SEO data for the current page
    const collectSEOData = () => {
      // Basic meta tags
      const title = document.title;
      const descriptionTag = document.querySelector('meta[name="description"]');
      const keywordsTag = document.querySelector('meta[name="keywords"]');
      const canonicalTag = document.querySelector('link[rel="canonical"]');
      
      // Open Graph tags
      const ogTags = Array.from(document.querySelectorAll('meta[property^="og:"]'))
        .reduce((acc, tag) => {
          const property = tag.getAttribute('property');
          if (property) {
            acc[property] = tag.getAttribute('content') || '';
          }
          return acc;
        }, {} as Record<string, string>);
      
      // Other meta tags
      const metaTags = Array.from(document.querySelectorAll('meta[name]'))
        .reduce((acc, tag) => {
          const name = tag.getAttribute('name');
          if (name && !['description', 'keywords'].includes(name)) {
            acc[name] = tag.getAttribute('content') || '';
          }
          return acc;
        }, {} as Record<string, string>);
      
      // Content structure
      const h1Count = document.querySelectorAll('h1').length;
      const linkCount = document.querySelectorAll('a').length;
      const imgElements = document.querySelectorAll('img');
      const imgCount = imgElements.length;
      const imgWithoutAlt = Array.from(imgElements).filter(img => !img.alt).length;
      
      // Performance
      const pageSize = `~${Math.round(document.documentElement.innerHTML.length / 1024)} KB`;
      
      // Calculate approximate page load time
      const loadTime = performance.now() ? `~${Math.round(performance.now() / 10) / 100}s` : 'N/A';
      
      // Structured data
      const structuredDataScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .map(script => script.textContent || '');
      
      setSeoData({
        title,
        description: descriptionTag?.getAttribute('content') || 'Missing',
        keywords: keywordsTag?.getAttribute('content') || 'Missing',
        canonical: canonicalTag?.getAttribute('href') || 'Missing',
        ogTags,
        metaTags,
        h1Count,
        linkCount,
        imgCount,
        imgWithoutAlt,
        pageSize,
        loadTime,
        structuredData: structuredDataScripts,
      });
    };
    
    // Run on mount and when URL changes
    collectSEOData();
    
    // Add an interval to check periodically (for SPAs with changing content)
    const interval = setInterval(collectSEOData, 2000);
    
    return () => clearInterval(interval);
  }, [pageUrl]);
  
  if (!seoData) return null;
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg hover:bg-gray-700 flex items-center"
      >
        {isOpen ? 'Hide SEO Data' : 'Show SEO Data'}
      </button>
      
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-xl p-4 mt-4 max-w-2xl max-h-[80vh] overflow-auto">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">SEO Monitor Tool</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Basic Meta</h4>
              <ul className="text-sm space-y-2">
                <li><span className="font-semibold">Title:</span> {seoData.title}</li>
                <li><span className="font-semibold">Description:</span> {seoData.description}</li>
                <li><span className="font-semibold">Keywords:</span> {seoData.keywords}</li>
                <li><span className="font-semibold">Canonical:</span> {seoData.canonical}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Open Graph Tags</h4>
              <ul className="text-sm space-y-2">
                {Object.entries(seoData.ogTags).map(([key, value]) => (
                  <li key={key}><span className="font-semibold">{key}:</span> {value}</li>
                ))}
                {Object.keys(seoData.ogTags).length === 0 && <li>No Open Graph tags found</li>}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Content Structure</h4>
              <ul className="text-sm space-y-2">
                <li><span className="font-semibold">H1 Tags:</span> {seoData.h1Count} {seoData.h1Count !== 1 && <span className="text-red-500">(Should be 1)</span>}</li>
                <li><span className="font-semibold">Links:</span> {seoData.linkCount}</li>
                <li><span className="font-semibold">Images:</span> {seoData.imgCount}</li>
                <li>
                  <span className="font-semibold">Images without alt:</span> {seoData.imgWithoutAlt}
                  {seoData.imgWithoutAlt > 0 && <span className="text-red-500"> (Add alt text for better SEO)</span>}
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Performance</h4>
              <ul className="text-sm space-y-2">
                <li><span className="font-semibold">Page Size:</span> {seoData.pageSize}</li>
                <li><span className="font-semibold">Load Time:</span> {seoData.loadTime}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Schema/Structured Data</h4>
              <div className="text-sm">
                {seoData.structuredData.length > 0 ? (
                  seoData.structuredData.map((data, index) => (
                    <details key={index} className="mb-2">
                      <summary className="cursor-pointer text-emerald-600 dark:text-emerald-400">
                        Schema #{index + 1} ({JSON.parse(data)['@type']})
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded overflow-auto max-h-60 text-xs">
                        {JSON.stringify(JSON.parse(data), null, 2)}
                      </pre>
                    </details>
                  ))
                ) : (
                  <p className="text-red-500">No structured data found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOMonitor;
