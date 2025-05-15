'use client';

import { useState, useEffect } from 'react';

/**
 * A hook that ensures code only runs on the client side
 * to prevent hydration mismatches
 */
export function useClientOnly<T>(clientFn: () => T, initialValue: T): T {
  const [value, setValue] = useState<T>(initialValue);
  
  useEffect(() => {
    setValue(clientFn());
  }, [clientFn]);
  
  return value;
}

/**
 * A version of useClientOnly that runs on mount and whenever dependencies change
 */
export function useClientEffect<T>(
  clientFn: () => T, 
  initialValue: T,
  deps: React.DependencyList = []
): T {
  const [value, setValue] = useState<T>(initialValue);
  
  useEffect(() => {
    setValue(clientFn());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  
  return value;
}

/**
 * A hook that safely handles window/document checks for SSR
 */
export function useIsBrowser(): boolean {
  return useClientOnly(() => true, false);
}

/**
 * Gets the window object safely (only on client)
 */
export function useSafeWindow<T = undefined>(
  windowFn: (win: Window) => T,
  fallback: T
): T {
  return useClientOnly(() => {
    if (typeof window !== 'undefined') {
      return windowFn(window);
    }
    return fallback;
  }, fallback);
}

/**
 * Gets the document object safely (only on client)
 */
export function useSafeDocument<T = undefined>(
  documentFn: (doc: Document) => T,
  fallback: T
): T {
  return useClientOnly(() => {
    if (typeof document !== 'undefined') {
      return documentFn(document);
    }
    return fallback;
  }, fallback);
}
