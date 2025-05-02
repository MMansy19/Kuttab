/**
 * Route handler type fixes for Next.js App Router
 * This file corrects the type mismatch between Next.js type expectations and runtime behavior
 */

// Fix the types for the generated route files in the .next directory
declare module "*.route.ts" {
  import type { NextRequest } from 'next/server'
  
  export type SegmentParams<T extends Object = any> = T extends Record<string, any>
    ? { [K in keyof T]: T[K] extends string ? string | string[] | undefined : never }
    : T

  // This is the key fix - making RouteContext use a plain object instead of a Promise
  export type RouteContext = { params: SegmentParams }
  
  // Enhanced ParamCheck type that accepts both Promise-wrapped and direct object params
  export type ParamCheck<T> = {
    __tag__: string
    __param_position__: string
    __param_type__: T extends { params: infer P } 
      ? { params: P extends Promise<infer U> ? U : P }
      : T
  }

  // Fix PageProps and LayoutProps interfaces
  export interface PageProps {
    params?: SegmentParams
    searchParams?: any
  }
  
  export interface LayoutProps {
    children?: React.ReactNode
    params?: SegmentParams
  }
}