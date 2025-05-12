'use client';

import { useEffect } from 'react';

// Viewport helper for determining if element is in viewport
const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Custom hook to optimize Core Web Vitals
 * - Handles lazy loading images that enter viewport
 * - Preloads critical resources
 * - Implements link prefetching for faster navigation
 */
export function useWebVitalsOptimizer() {
  useEffect(() => {
    // Helper to mark visible images as important
    const optimizeImages = () => {
      // Find all images with loading="lazy"
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      
      lazyImages.forEach((img) => {
        const imgElement = img as HTMLImageElement;
        
        // If image is in viewport and still lazy loading, change its importance
        if (isInViewport(imgElement) && !imgElement.hasAttribute('data-loaded')) {
          imgElement.setAttribute('fetchpriority', 'high');
          imgElement.setAttribute('data-loaded', 'true');
        }
      });
    };

    // Handle link prefetching
    const handleLinkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      
      if (link && link.href && !link.hasAttribute('data-prefetched') && link.href.startsWith(window.location.origin)) {
        // Create a prefetch link for internal links
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = link.href;
        document.head.appendChild(prefetchLink);
        
        // Mark as prefetched
        link.setAttribute('data-prefetched', 'true');
      }
    };

    // Add event listeners
    document.addEventListener('mouseover', handleLinkHover);
    window.addEventListener('scroll', optimizeImages, { passive: true });
    
    // Run initial optimization
    optimizeImages();

    // Cleanup function
    return () => {
      document.removeEventListener('mouseover', handleLinkHover);
      window.removeEventListener('scroll', optimizeImages);
    };
  }, []);
}

/**
 * Component that implements web vitals optimization
 */
export default function WebVitalsOptimizer(): null {
  useWebVitalsOptimizer();
  return null;
}
