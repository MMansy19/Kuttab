/**
 * Global type declarations for modules missing type definitions
 */

// If @types/bcryptjs was not installed or has issues, this provides a fallback
declare module 'bcryptjs' {
  export function genSalt(rounds?: number): Promise<string>;
  export function hash(s: string, salt: string | number): Promise<string>;
  export function compare(s: string, hash: string): Promise<boolean>;
  
  export namespace genSalt {
    export function sync(rounds?: number): string;
  }
  
  export namespace hash {
    export function sync(s: string, salt: string | number): string;
  }
  
  export namespace compare {
    export function sync(s: string, hash: string): boolean;
  }
}

// Fix for Next.js App Router route handler type issues
declare module 'next/dist/server/app-render/entry-base' {
  // Fix RouteContext to use plain object instead of Promise
  type RouteContext = {
    params: Record<string, string | string[]>
  };

  // Fix ParamCheck to handle both Promise and direct object params
  type ParamCheck<T> = {
    __tag__: string;
    __param_position__: string;
    __param_type__: T extends { params: infer P } 
      ? { params: P extends Promise<infer U> ? U : P }
      : T;
  };
}

// Fix route handler context typing in next/server
declare module 'next/server' {
  interface RouteHandlerContext {
    params: Record<string, string | string[]>;
  }
}

// Add other missing module declarations as needed