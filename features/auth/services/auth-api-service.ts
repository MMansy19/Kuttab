import { RegisterData, AuthUser } from '../types';
import { http } from '@/utils/fetcher';

/**
 * API Service for auth-related server requests
 * Handles operations that need direct API access beyond NextAuth.js functionality
 */
class AuthApiService {
  /**
   * Get the current user's profile data with additional details
   */  async getCurrentUserProfile(): Promise<AuthUser | null> {
    try {
      const response = await http.get('/api/users/me', { requireAuth: true });
      
      if (!response.ok) {
        console.error('Failed to fetch user profile:', response.error);
        return null;
      }
      
      return response.data?.user || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }
  
  /**
   * Register a new user
   */  async register(data: RegisterData): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: responseData.error || 'Registration failed',
        };
      }
      
      return {
        success: true,
        user: responseData.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during registration',
      };
    }
  }
  
  /**
   * Update user password
   */  async updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await http.put('/api/users/password', {
        currentPassword,
        newPassword,
      }, { requireAuth: true });
        if (!response.ok) {
        return {
          success: false,
          error: response.error || 'Failed to update password',
        };
      }
      
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error updating password',
      };
    }
  }
  
  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to request password reset',
        };
      }
      
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error requesting password reset',
      };
    }
  }
  
  /**
   * Check if email exists (used for registration)
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }
}

export const authApiService = new AuthApiService();
