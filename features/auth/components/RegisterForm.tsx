"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus, FiBook, FiAward, FiAlertCircle } from "react-icons/fi";
import { FaGoogle, FaFacebook, FaMale, FaFemale } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Role, Gender } from "../types";

// Form validation schema
const registerSchema = z.object({
  name: z.string().min(2, "يجب أن يكون الاسم على الأقل حرفين"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل"),
  role: z.enum([Role.USER, Role.TEACHER] as const),
  gender: z.enum([Gender.MALE, Gender.FEMALE] as const),
});

type UserRole = Role.USER | Role.TEACHER;
type UserGender = Gender.MALE | Gender.FEMALE;

interface RegisterFormProps {
  callbackUrl?: string;
}

export const RegisterForm = ({ callbackUrl = "/dashboard" }: RegisterFormProps) => {
  const router = useRouter();
  const { register, socialLogin, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
    const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: Role.USER as UserRole,
    gender: Gender.MALE as UserGender,
  });
  
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle redirect for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(callbackUrl || "/dashboard");
    }
  }, [isAuthenticated, router, callbackUrl]);

  // Evaluate password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }
    
    const hasLength = formData.password.length >= 8;
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasDigit = /\d/.test(formData.password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(formData.password);
    
    const strength = 
      (hasLength ? 1 : 0) +
      (hasLowerCase ? 1 : 0) +
      (hasUpperCase ? 1 : 0) +
      (hasDigit ? 1 : 0) +
      (hasSpecialChar ? 1 : 0);
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const getStrengthText = () => {
    if (!formData.password) return "";
    if (passwordStrength <= 2) return "ضعيفة";
    if (passwordStrength <= 3) return "متوسطة";
    if (passwordStrength <= 4) return "جيدة";
    return "ممتازة";
  };

  const validateField = (field: keyof typeof formErrors, value: string): boolean => {
    try {
      if (field === "name") {
        z.string().min(2, "يجب أن يكون الاسم على الأقل حرفين").parse(value);
      } else if (field === "email") {
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
    
    if (name in formErrors) {
      validateField(name as keyof typeof formErrors, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    // Validate all fields
    let isValid = true;
    isValid = validateField("name", formData.name) && isValid;
    isValid = validateField("email", formData.email) && isValid;
    isValid = validateField("password", formData.password) && isValid;
    
    if (!isValid) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Validate with schema
      registerSchema.parse(formData);
      
      // Attempt registration
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as Role,
        gender: formData.gender as Gender
      });
      
      if (result.success) {
        setSuccess("تم إنشاء الحساب بنجاح! جاري التحويل إلى صفحة تسجيل الدخول...");
        
        // Redirect to the login page with the email pre-filled
        setTimeout(() => {
          // Create a URL to the login page with the email as a parameter
          const loginUrl = `/auth/login?email=${encodeURIComponent(formData.email)}${
            callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ''
          }`;

          // Using window.location.href for a hard navigation
          window.location.href = loginUrl;
        }, 2000);
      } else {
        setError(result.error || "فشل إنشاء الحساب");
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            الإسم
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="الإسم الكامل"
              className="pr-10 w-full"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
          )}
        </div>

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
          {formData.password && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  قوة كلمة المرور: <span className={`font-semibold ${passwordStrength >= 3 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>{getStrengthText()}</span>
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    passwordStrength <= 2
                      ? 'bg-red-500'
                      : passwordStrength <= 3
                      ? 'bg-orange-500'
                      : passwordStrength <= 4
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, (passwordStrength / 5) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            أنا:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg border ${
                formData.role === "USER" 
                  ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300" 
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
              onClick={() => setFormData(prev => ({ ...prev, role: "USER" as UserRole }))}
            >
              <FiBook className="h-5 w-5 ml-2" />
              <span>طالب</span>
            </button>
            
            <button
              type="button"
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg border ${
                formData.role === "TEACHER"
                  ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
              onClick={() => setFormData(prev => ({ ...prev, role: "TEACHER" as UserRole }))}
            >
              <FiAward className="h-5 w-5 ml-2" />
              <span>معلم</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            الجنس:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg border ${
                formData.gender === "MALE" 
                  ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300" 
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
              onClick={() => setFormData(prev => ({ ...prev, gender: "MALE" as UserGender }))}
            >
              <FaMale className="h-5 w-5 ml-2" />
              <span>ذكر</span>
            </button>
            
            <button
              type="button"
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg border ${
                formData.gender === "FEMALE"
                  ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
              onClick={() => setFormData(prev => ({ ...prev, gender: "FEMALE" as UserGender }))}
            >
              <FaFemale className="h-5 w-5 ml-2" />
              <span>أنثى</span>
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          <FiUserPlus className="h-5 w-5" />
          <span>إنشاء حساب</span>
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              أو سجل مباشرة باستخدام
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
            لديك حساب بالفعل؟{" "}
            <a href={`/auth/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} className="text-blue-600 hover:underline font-medium">
              تسجيل الدخول
            </a>
          </p>
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-5">
          بالتسجيل، أنت توافق على <a href="/terms" className="text-blue-600 hover:underline">شروط الاستخدام</a> و <a href="/privacy" className="text-blue-600 hover:underline">سياسة الخصوصية</a> الخاصة بنا.
        </div>
      </form>
    </div>
  );
};
