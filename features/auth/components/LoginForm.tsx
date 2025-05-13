"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiAlertCircle } from "react-icons/fi";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل"),
});

interface LoginFormProps {
  callbackUrl?: string;
}

export const LoginForm = ({ callbackUrl = "/dashboard" }: LoginFormProps) => {
  const router = useRouter();
  const { login, socialLogin, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  // Handle redirect for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(callbackUrl || "/dashboard");
    }
  }, [isAuthenticated, router, callbackUrl]);

  // Check for email parameter (used when redirecting from signup)
  useEffect(() => {
    const emailParam = searchParams?.get("email");
    if (emailParam) {
      setFormData((prev) => ({ ...prev, email: emailParam }));
      setSuccess("تم إنشاء الحساب بنجاح! الرجاء إكمال تسجيل الدخول.");
    }
  }, [searchParams]);

  const validateField = (field: keyof typeof formData, value: string): boolean => {
    try {
      if (field === "email") {
        z.string().email("بريد إلكتروني غير صالح").parse(value);
      } else if (field === "password") {
        z.string().min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل").parse(value);
      }
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessage = err.errors[0].message;
        setFormErrors((prev) => ({ ...prev, [field]: errorMessage }));
      }
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof typeof formData, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    // Validate all fields
    let isValid = true;
    isValid = validateField("email", formData.email) && isValid;
    isValid = validateField("password", formData.password) && isValid;
    
    if (!isValid) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Validate with schema
      loginSchema.parse(formData);
      
      // Attempt login
      const result = await login({
        email: formData.email,
        password: formData.password
      }, callbackUrl);
      
      if (result.success) {
        setSuccess("تم تسجيل الدخول بنجاح! جاري التحويل...");
        
        // Use a direct window location approach for more reliable redirection
        setTimeout(() => {
          window.location.replace(result.redirectUrl || callbackUrl || "/dashboard");
        }, 800);
      } else {
        setError(result.error || "فشل تسجيل الدخول");
      }
    } catch (err: any) {
      const errorMessage = err.message || "حدث خطأ ما";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    socialLogin(provider, callbackUrl);
  };

  return (
    <div dir="rtl" className="w-full max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        تسجيل الدخول
      </h2>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-md mb-4 flex items-center animate-fadeIn">
          <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-md mb-4 flex items-center animate-fadeIn">
          <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span className="text-sm">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            البريد الإلكتروني
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              className="pr-10 w-full"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="email"
              dir="ltr"
            />
          </div>
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            كلمة المرور
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pr-10 w-full"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              dir="ltr"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          <FiLogIn className="h-5 w-5" />
          <span>تسجيل الدخول</span>
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              أو سجل الدخول باستخدام
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="w-full flex justify-center items-center gap-2 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <FaGoogle className="h-5 w-5 text-red-500" />
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('facebook')}
            className="w-full flex justify-center items-center gap-2 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <FaFacebook className="h-5 w-5 text-blue-600" />
            <span>Facebook</span>
          </button>
        </div>

        <div className="text-center mt-5">
          <p className="text-gray-600 dark:text-gray-400">
            ليس لديك حساب؟{" "}
            <a href={`/auth/signup${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} className="text-blue-600 hover:underline font-medium">
              التسجيل
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};
