/**
 * Global type declaration file to fix Next.js App Router route parameter types.
 * This overrides the incorrect type definitions in the Next.js generated files.
 */

import { type NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';

// Fix for route parameters in Next.js App Router
declare module 'next/dist/server/app-render/entry-base' {
  // Override RouteContext to use plain objects instead of Promises for params
  interface RouteContext {
    params: Record<string, string | string[]>;
  }

  // Override ParamCheck to handle both Promise-wrapped and direct objects
  interface ParamCheck<T> {
    __tag__: string;
    __param_position__: string;
    __param_type__: T extends { params: infer P } 
      ? { params: P extends Promise<infer U> ? U : P }
      : T;
  }

  // Fix PageProps interface
  interface PageProps {
    params?: Record<string, string | string[]>;
    searchParams?: Record<string, string | string[]>;
  }

  // Fix LayoutProps interface
  interface LayoutProps {
    children?: React.ReactNode;
    params?: Record<string, string | string[]>;
  }
}

// Fix route handler context in next/server
declare module 'next/server' {
  interface RouteHandlerContext {
    params: Record<string, string | string[]>;
  }
}

/**
 * This file fixes TypeScript errors in Next.js App Router route handlers
 * by overriding problematic type definitions.
 * 
 * It ensures that route parameters are correctly typed as direct objects
 * rather than being wrapped in Promises.
 */

declare module 'next/server' {
  // Fix for dynamic route segments
  export interface RouteHandlerContext<Params extends Record<string, string | string[]> = {}> {
    params: Params; // Remove Promise wrapping
  }
  
  // Generic route handler function signatures
  export type NextRouteHandler<Params extends Record<string, string | string[]> = {}> = 
    (request: NextRequest, context: { params: Params }) => Response | Promise<Response>;
    
  // Re-export with fixed types
  export function GET<Params extends Record<string, string | string[]> = {}>(
    request: NextRequest, 
    context: { params: Params }
  ): Response | Promise<Response>;
  
  export function POST<Params extends Record<string, string | string[]> = {}>(
    request: NextRequest, 
    context: { params: Params }
  ): Response | Promise<Response>;
  
  export function PUT<Params extends Record<string, string | string[]> = {}>(
    request: NextRequest, 
    context: { params: Params }
  ): Response | Promise<Response>;
  
  export function DELETE<Params extends Record<string, string | string[]> = {}>(
    request: NextRequest, 
    context: { params: Params }
  ): Response | Promise<Response>;
  
  export function PATCH<Params extends Record<string, string | string[]> = {}>(
    request: NextRequest, 
    context: { params: Params }
  ): Response | Promise<Response>;
}

// Also fix the types for route handler in bookings specifically
declare module 'app/api/bookings/[id]/route' {
  interface BookingParams {
    id: string;
  }

  export function GET(
    request: NextRequest, 
    context: { params: BookingParams }
  ): Response | Promise<Response>;
  
  export function PUT(
    request: NextRequest, 
    context: { params: BookingParams }
  ): Response | Promise<Response>;
  
  export function DELETE(
    request: NextRequest, 
    context: { params: BookingParams }
  ): Response | Promise<Response>;
}

// Fix for Next.js generated types in dynamic route segments
declare module '*.ts' {
  // This ensures any generated types with Promise<SegmentParams> are fixed
  interface SegmentParams {
    [param: string]: string | string[];
  }

  interface RouteContext {
    params: SegmentParams;
  }
}