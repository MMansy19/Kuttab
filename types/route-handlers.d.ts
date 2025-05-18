/**
 * Type definitions for Next.js App Router route handlers
 * This file helps fix TypeScript errors related to Next.js 15's route handler parameter types
 */

import { NextRequest, NextResponse } from 'next/server';

// Declare module augmentation for Next.js route handlers
declare module 'next/server' {
  // Fix for route parameters in Next.js App Router
  export interface RouteHandlerContext<Params extends Record<string, string | string[]> = {}> {
    params: Params; // Ensure params is a direct object, not a Promise
  }
}

// Explicitly declare parameter types for dynamic route segments
export type RouteParams<T extends string = string> = {
  [key in T]: string;
};

// Helper type for booking ID route parameters
export type BookingIdParams = RouteParams<'id'>;

// Helper type for teacher ID route parameters
export type TeacherIdParams = RouteParams<'id'>;

// Helper type for user ID route parameters 
export type UserIdParams = RouteParams<'id'>;

// Helper type for notification ID route parameters
export type NotificationIdParams = RouteParams<'id'>;
