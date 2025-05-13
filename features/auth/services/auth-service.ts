import { LoginCredentials, RegisterData, AuthResult } from "../types";
import { signIn, signOut as nextAuthSignOut } from "next-auth/react";

/**
 * Service responsible for authentication related API calls
 */
class AuthService {
  /**
   * Login a user with credentials
   */
  async login(credentials: LoginCredentials, callbackUrl?: string): Promise<AuthResult> {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
        callbackUrl
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          return {
            success: false,
            error: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          };
        }
        
        if (result.error.includes("ECONNREFUSED")) {
          return {
            success: false,
            error: "لا يمكن الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت"
          };
        }
        
        if (result.error.includes("timeout")) {
          return {
            success: false, 
            error: "انتهت مهلة الطلب، يرجى المحاولة مرة أخرى"
          };
        }
        
        return { 
          success: false, 
          error: result.error 
        };
      }

      if (!result?.url && !result?.error) {
        return { 
          success: false, 
          error: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى." 
        };
      }      return {
        success: true,
        message: "تم تسجيل الدخول بنجاح!",
        redirectUrl: result.url || undefined
      };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message || "حدث خطأ أثناء تسجيل الدخول"
      };
    }
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResult> {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "حدث خطأ أثناء التسجيل"
        };
      }

      return {
        success: true,
        message: "تم إنشاء الحساب بنجاح!",
        user: result.user
      };
    } catch (error: any) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.message || "حدث خطأ أثناء التسجيل"
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(callbackUrl?: string): Promise<void> {
    await nextAuthSignOut({ redirect: Boolean(callbackUrl), callbackUrl });
  }

  /**
   * Login with social provider
   */
  async socialLogin(provider: string, callbackUrl?: string): Promise<void> {
    await signIn(provider, { callbackUrl });
  }
}

export const authService = new AuthService();
