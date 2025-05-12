// Centralized fetch utility for handling API requests
// Includes error handling, authentication token management, and request/response interceptors

const TOKEN_STORAGE_KEY = 'auth_token';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  broadcastAuthStateChange('token_updated');
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  broadcastAuthStateChange('logged_out');
};

let authChannel: BroadcastChannel | null = null;
export const broadcastAuthStateChange = (eventType: string): void => {
  if (typeof window === 'undefined') return;
  try {
    if ('BroadcastChannel' in window) {
      if (!authChannel) {
        authChannel = new BroadcastChannel('auth_state_channel');
      }
      authChannel.postMessage({ type: eventType, timestamp: Date.now() });
    } else {
      localStorage.setItem('auth_state_event', JSON.stringify({
        type: eventType,
        timestamp: Date.now()
      }));
      localStorage.removeItem('auth_state_event');
    }
  } catch (error) {
    console.error('Failed to broadcast authentication state change:', error);
  }
};

export const initAuthStateListener = (handleStateChange: (eventType: string) => void): () => void => {
  if (typeof window === 'undefined') return () => {};

  const handleBroadcastMessage = (event: MessageEvent) => {
    if (event.data && event.data.type) {
      handleStateChange(event.data.type);
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === 'auth_state_event') {
      try {
        const data = event.newValue ? JSON.parse(event.newValue) : null;
        if (data && data.type) {
          handleStateChange(data.type);
        }
      } catch (error) {
        console.error('Failed to parse auth state event:', error);
      }
    }
  };

  let localChannel: BroadcastChannel | null = null;
  if ('BroadcastChannel' in window) {
    localChannel = new BroadcastChannel('auth_state_channel');
    authChannel = localChannel;
    localChannel.onmessage = handleBroadcastMessage;
  } else {
    (window as Window).addEventListener('storage', handleStorageEvent);
  }

  return () => {    if (localChannel) {
      localChannel.onmessage = null;
      localChannel.close();
    } else {
      (window as Window).removeEventListener('storage', handleStorageEvent);
    }
  };
};

const refreshToken = async (): Promise<{ success: boolean; token?: string }> => {
  const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  if (!refreshTokenValue) return { success: false };

  try {
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshTokenValue })
    });

    if (response.ok) {
      const data = await response.json();
      setAuthToken(data.token);
      return { success: true, token: data.token };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return { success: false };
  }
};

interface FetcherOptions extends RequestInit {
  requireAuth?: boolean;
  skipErrorHandling?: boolean;
}

interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
  ok: boolean;
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

function getErrorMessage(response: Response, data: any): string {
  if (data && typeof data === 'object' && 'message' in data) {
    return data.message;
  }
  if (typeof data === 'string' && data.length < 200) {
    return data;
  }
  return `Request failed with status: ${response.status} ${response.statusText}`;
}

export async function fetcher<T = any>(url: string, options: FetcherOptions = {}): Promise<ApiResponse<T>> {
  const { requireAuth = false, skipErrorHandling = false, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers
  };

  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    } else {
      if (!skipErrorHandling) {
        return {
          data: null,
          error: 'Authentication required',
          status: 401,
          ok: false
        };
      }
    }
  }

  try {
    let response = await fetch(url, { ...fetchOptions, headers });

    if (response.status === 401 && requireAuth) {
      const refreshResult = await refreshToken();
      if (refreshResult.success) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${refreshResult.token}`;
        response = await fetch(url, { ...fetchOptions, headers });
      } else {
        removeAuthToken();
        return {
          data: null,
          error: 'Session expired. Please login again.',
          status: 401,
          ok: false
        };
      }
    }

    const data = await parseResponse(response);
    return {
      data: response.ok ? data : null,
      error: response.ok ? null : getErrorMessage(response, data),
      status: response.status,
      ok: response.ok
    };
  } catch (error) {
    if (!skipErrorHandling) {
      console.error('Fetch error:', error);
    }
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Network error occurred',
      status: 0,
      ok: false
    };
  }
}

export const http = {
  get: <T = any>(url: string, options?: FetcherOptions) => fetcher<T>(url, { ...options, method: 'GET' }),
  post: <T = any>(url: string, body: any, options?: FetcherOptions) => fetcher<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T = any>(url: string, body: any, options?: FetcherOptions) => fetcher<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T = any>(url: string, body: any, options?: FetcherOptions) => fetcher<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T = any>(url: string, options?: FetcherOptions) => fetcher<T>(url, { ...options, method: 'DELETE' }),
};

export default fetcher;
