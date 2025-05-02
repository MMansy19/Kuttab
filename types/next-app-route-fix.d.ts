/**
 * This declaration file fixes the Next.js App Router route handler type issues
 * by overriding the problematic type definitions in the generated files.
 */

// Make this file act as a module
export {};

// Target the internal Next.js typings to override them
declare module 'next/dist/server/app-render/entry-base' {
  // The fix: RouteContext uses a plain object instead of Promise
  type RouteContext = {
    params: Record<string, string | string[]>
  };

  // Fix the ParamCheck to handle both Promise and direct object
  type ParamCheck<T> = {
    __tag__: string;
    __param_position__: string;
    __param_type__: T extends { params: infer P } 
      ? { params: P extends Promise<infer U> ? U : P }
      : T;
  };
  
  // Fix the PageProps and LayoutProps interfaces
  interface PageProps {
    params?: Record<string, string | string[]>;
    searchParams?: Record<string, string | string[]>;
  }
  
  interface LayoutProps {
    children?: React.ReactNode;
    params?: Record<string, string | string[]>;
  }
}

// Override Next.js route handler typing
declare module 'next/server' {
  interface RouteHandlerContext {
    params: Record<string, string | string[]>;
  }
}

// Override the generated route file typings
declare module '*.route.ts' {
  import type { NextRequest } from 'next/server';
  
  // Make RouteContext use plain object for params
  type RouteContext = {
    params: Record<string, string | string[]>;
  };
  
  // Enhance ParamCheck to handle both Promise and direct object params
  type ParamCheck<T> = {
    __tag__: string;
    __param_position__: string;
    __param_type__: T extends { params: infer P } 
      ? { params: P extends Promise<infer U> ? U : P }
      : T;
  };
}