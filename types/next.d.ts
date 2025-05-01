// This file extends the Next.js types to fix issues with route handlers
import { NextRequest } from 'next/server'

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