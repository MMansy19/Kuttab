/**
 * Custom type declarations to fix Next.js App Router route handler type issues
 */

// Override the route handler context types in Next.js
declare module 'next/dist/server/app-render/entry-base' {
  // The fix: RouteContext uses a plain object instead of Promise for params
  type RouteContext = {
    params: Record<string, string | string[]>
  };

  // Fix the ParamCheck to handle both Promise and direct object params
  type ParamCheck<T> = {
    __tag__: string;
    __param_position__: string;
    __param_type__: T extends { params: infer P } 
      ? { params: P extends Promise<infer U> ? U : P }
      : T;
  };
  
  // Fix PageProps and LayoutProps interfaces
  interface PageProps {
    params?: Record<string, string | string[]>;
    searchParams?: Record<string, string | string[]>;
  }
  
  interface LayoutProps {
    children?: React.ReactNode;
    params?: Record<string, string | string[]>;
  }
}

// Fix the route handler typing in next/server
declare module 'next/server' {
  interface RouteHandlerContext {
    params: Record<string, string | string[]>;
  }
}
