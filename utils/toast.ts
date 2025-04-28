type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// For SSR compatibility
const isClient = typeof window !== 'undefined';

// Store our toast notifications
let listeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

// Generate a unique ID for each toast
const generateId = () => Math.random().toString(36).substring(2, 9);

// Add a new toast
export const addToast = (message: string, type: ToastType = 'info', duration = 5000) => {
  if (!isClient) return;

  const id = generateId();
  const newToast = { id, message, type, duration };
  
  toasts = [...toasts, newToast];
  notifyListeners();
  
  // Auto-remove toast after duration
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }
  
  return id;
};

// Remove a toast by ID
export const removeToast = (id: string) => {
  if (!isClient) return;
  
  toasts = toasts.filter(toast => toast.id !== id);
  notifyListeners();
};

// Subscribe to toast changes
export const subscribeToToasts = (callback: (toasts: Toast[]) => void) => {
  if (!isClient) return () => {};
  
  listeners.push(callback);
  callback(toasts); // Call immediately with current state
  
  // Return unsubscribe function
  return () => {
    listeners = listeners.filter(listener => listener !== callback);
  };
};

// Notify all listeners of changes
const notifyListeners = () => {
  listeners.forEach(listener => {
    listener(toasts);
  });
};

// Helper functions for different toast types
export const showSuccess = (message: string, duration = 5000) => 
  addToast(message, 'success', duration);

export const showError = (message: string, duration = 5000) => 
  addToast(message, 'error', duration);

export const showInfo = (message: string, duration = 5000) => 
  addToast(message, 'info', duration);

export const showWarning = (message: string, duration = 5000) => 
  addToast(message, 'warning', duration);