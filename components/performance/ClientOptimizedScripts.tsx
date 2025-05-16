'use client';

import dynamic from 'next/dynamic';

// Dynamically load heavy components with ssr:false in this client component
const OptimizedScripts = dynamic(() => import('./OptimizedScripts'), {
  ssr: false
});

export default function ClientOptimizedScripts() {
  return <OptimizedScripts />;
}
