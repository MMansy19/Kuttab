'use client';

import Script from 'next/script';
import React from 'react';

/**
 * This component optimizes script loading using Next.js Script component
 * It defers non-critical scripts to improve page load performance
 */
export default function OptimizedScripts() {
  return (
    <>
      {/* Analytics - load after the page becomes interactive */}
      <Script
        src="/scripts/analytics.js"
        strategy="lazyOnload"
        onLoad={() => console.log('Analytics script loaded')}
      />
      
      {/* External widgets that aren't critical for initial render */}
      <Script
        src="/scripts/widgets.js"
        strategy="afterInteractive"
        onLoad={() => console.log('Widgets script loaded')}
      />
    </>
  );
}
