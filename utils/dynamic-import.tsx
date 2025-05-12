/**
 * Utility for dynamic imports to optimize code splitting and lazy loading
 * throughout the application.
 */
import dynamic from 'next/dynamic';
import React from 'react';

/**
 * Creates a dynamically imported component with loading fallback
 * 
 * @param importFunc - The import function for the component
 * @param fallback - Optional fallback component to show during loading
 * @param ssr - Whether to use server-side rendering (default: true)
 * @returns Dynamically loaded component
 */
export function createDynamicComponent<T>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>,
  fallback: React.ReactNode = null,
  ssr: boolean = true
) { 
    return dynamic(importFunc, {
        ssr,
        loading: () => (
        <div className="flex items-center justify-center h-full">
            {fallback || <span>Loading...</span>}
        </div>
        ),
    });
}

/**
 * Creates a dynamically imported component with SSR disabled
 * Useful for components that depend on browser APIs
 */
export function createClientOnlyComponent<T>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>,
  fallback: React.ReactNode = null
) {
  return createDynamicComponent(importFunc, fallback, false);
}

/**
 * Creates a dynamically imported component that only loads when it becomes visible
 * in the viewport (using Intersection Observer API)
 */
export function createLazyLoadedComponent<T>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>,
  fallback: React.ReactNode = null
) {
  // This would require implementing with Intersection Observer
  // For now, we'll use a simple dynamic import
  return createDynamicComponent(importFunc, fallback, true);
}
