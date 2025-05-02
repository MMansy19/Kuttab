/**
 * Type definitions to fix Next.js App Router API route parameter type issues
 */

import { NextRequest } from 'next/server'

// Fix the type mismatch between App Router route handler definitions and runtime behavior
declare module 'next/dist/server/app-render/entry-base' {
  // Updated RouteContext that doesn't force params to be a Promise
  type RouteContext = { 
    params: Record<string, string | string[]> 
  }

  // Enhanced ParamCheck to handle both Promise and direct object params
  type ParamCheck<T> = {
    __tag__: string
    __param_position__: string
    __param_type__: T extends { params: infer P } 
      ? { params: P extends Promise<infer U> ? U : P }
      : T
  }

  // Update PageProps and LayoutProps to handle non-Promise params
  interface PageProps {
    params?: Record<string, string | string[]>
    searchParams?: Record<string, string | string[]>
  }

  interface LayoutProps {
    children?: React.ReactNode
    params?: Record<string, string | string[]>
  }
}

// This file extends the Next.js types to fix issues with route handlers
declare module 'next/server' {
  // Override the RouteHandlerContext type to fix TypeScript errors in route handlers
  export interface RouteHandlerContext {
    params: Record<string, string | string[]>
  }

  // Properly define return types for route handlers
  export type RouteHandler<T = any> = (
    request: NextRequest,
    context: RouteHandlerContext
  ) => Response | Promise<Response>
}