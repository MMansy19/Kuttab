import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { LoginCredentials, RegisterData, AuthResult } from "../types";
import { authService } from "../services/auth-service";
import { clearSessionCache } from "@/lib/session";
import { addToast } from "@/utils/toast";

/**
 * Hook to provide auth functionality to components
 */
export const useAuth = () => {
  const { data: session, status, update } = useSession();

  /**
   * Login with credentials
   */
  const login = useCallback(async (
    credentials: LoginCredentials, 
    callbackUrl?: string
  ): Promise<AuthResult> => {
    const loadingToastId = addToast("جاري تسجيل الدخول...", 'info');
    
    try {
      const result = await authService.login(credentials, callbackUrl);
      
      if (result.success) {
        addToast("تم تسجيل الدخول بنجاح", 'success');
      } else {
        addToast(result.error || "فشل تسجيل الدخول", 'error');
      }
      
      return result;
    } catch (error) {
      console.error("Login error:", error);
      addToast("حدث خطأ أثناء تسجيل الدخول", 'error');
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "حدث خطأ أثناء تسجيل الدخول" 
      };
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (
    data: RegisterData
  ): Promise<AuthResult> => {
    const loadingToastId = addToast("جاري إنشاء الحساب...", 'info');
    
    try {
      const result = await authService.register(data);
      
      if (result.success) {
        addToast("تم إنشاء الحساب بنجاح", 'success');

        // In frontend-only mode, store credentials to help with login
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            localStorage.setItem('recently_registered_user', data.email);
            localStorage.setItem('recently_registered_password', data.password);
          } catch (e) {
            console.error("Could not store registration info:", e);
          }
        }
      } else {
        addToast(result.error || "فشل إنشاء الحساب", 'error');
      }
      
      return result;
    } catch (error) {
      console.error("Registration error:", error);
      addToast("حدث خطأ أثناء التسجيل", 'error');
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "حدث خطأ أثناء التسجيل" 
      };
    }
  }, []);

  /**
   * Sign out the current user
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Clear any cached session data
      clearSessionCache();
      await authService.signOut("/auth/login");
      addToast("تم تسجيل الخروج بنجاح", 'success');
    } catch (error) {
      console.error("Logout error:", error);
      addToast("حدث خطأ أثناء تسجيل الخروج", 'error');
    }
  }, []);

  /**
   * Login with a social provider
   */
  const socialLogin = useCallback(async (provider: string, callbackUrl?: string): Promise<void> => {
    await authService.socialLogin(provider, callbackUrl);
  }, []);

  return {
    user: session?.user,
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    login,
    register,
    logout,
    socialLogin,
    updateSession: update
  };
};
