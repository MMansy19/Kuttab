"use client";

/**
 * Safely checks if code is running in a browser environment
 * @returns boolean indicating if code is running in browser
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Safely checks if BroadcastChannel API is available
 * @returns boolean indicating if BroadcastChannel is available
 */
export const isBroadcastChannelSupported = (): boolean => {
  return isBrowser() && 'BroadcastChannel' in window;
};

/**
 * Safely adds an event listener to window object
 * @param event Event name
 * @param handler Event handler
 * @returns Function to remove the event listener
 */
export const safeAddWindowListener = (event: string, handler: EventListenerOrEventListenerObject): (() => void) => {
  if (isBrowser()) {
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  }
  return () => {}; // No-op cleanup function for server
};
