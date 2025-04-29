"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiUserPlus, 
  FiLogIn, 
  FiBook, 
  FiAward,
} from "react-icons/fi";
import { FaGoogle, FaFacebook, FaMale, FaFemale } from "react-icons/fa";

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

const registerSchema = z.object({
  name: z.string().min(2, "يجب أن يكون الاسم على الأقل حرفين"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل"),
  role: z.enum(["USER", "TEACHER"]),
  gender: z.enum(["MALE", "FEMALE"]),
});

type UserRole = "USER" | "TEACHER";
type UserGender = "MALE" | "FEMALE";

type AuthFormProps = {
  type: "login" | "signup";
};

// Mock session data for development without database
const mockSession = {
  user: {
    id: "fake-user-id-123",
    name: "Development User",
    email: "dev@example.com",
    role: "ADMIN",
    image: null
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
};

const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" as UserRole,
    gender: "MALE" as UserGender,
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Development mode to bypass authentication
  const isDevelopmentMode = process.env.NODE_ENV === 'development'|| true;

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (password.length === 0) return 0;
    
    let score = 0;
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    return Math.min(score, 5); // Maximum strength is 5
  };

  const getStrengthText = () => {
    const strengthTexts = ["ضعيفة جداً", "ضعيفة", "متوسطة", "جيدة", "قوية", "ممتازة"];
    return strengthTexts[passwordStrength];
  };
  
  const getStrengthColor = () => {
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500", "bg-emerald-600"];
    return colors[passwordStrength];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear specific error when field is being edited
    setFormErrors(prev => ({ ...prev, [name]: "" }));
    
    // Calculate password strength if password field is changed
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateField = (name: string, value: string) => {
    // Skip validation in development mode
    if (isDevelopmentMode) return true;
    
    let errorMessage = "";
    
    switch (name) {
      case "name":
        if (value.length < 2) errorMessage = "يجب أن يكون الاسم على الأقل حرفين";
        break;
      case "email":
        if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errorMessage = "بريد إلكتروني غير صالح";
        break;
      case "password":
        if (value.length < 8) errorMessage = "يجب أن تكون كلمة المرور 8 أحرف على الأقل";
        break;
    }
    
    setFormErrors(prev => ({ ...prev, [name]: errorMessage }));
    return !errorMessage;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // In development mode, bypass actual authentication
      if (isDevelopmentMode) {
        setSuccess("تم تسجيل الدخول بنجاح! جاري التحويل...");
        
        // Store mock session in sessionStorage to persist it
        sessionStorage.setItem('mockSession', JSON.stringify(mockSession));
        
        // Force reload to apply the session
        setTimeout(() => {
          // Redirect to the admin dashboard directly
          router.push('/dashboard/admin');
          router.refresh();
        }, 800);
        
        return;
      }
      
      // Validate all fields before submission for production
      let isValid = true;
      
      if (type === "signup") {
        isValid = validateField("name", formData.name) && isValid;
      }
      isValid = validateField("email", formData.email) && isValid;
      isValid = validateField("password", formData.password) && isValid;
      
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      if (type === "login") {
        // Validate login data
        loginSchema.parse({ email: formData.email, password: formData.password });

        // Sign in with NextAuth
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
          callbackUrl: decodeURIComponent(callbackUrl),
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        // Show success message before redirect
        setSuccess("تم تسجيل الدخول بنجاح! جاري التحويل...");
        
        // Redirect will be handled by middleware based on role
        router.refresh();

        // Short timeout to show success message
        setTimeout(() => {
          if (result?.url) {
            // Use the URL returned by NextAuth if available
            router.push(result.url);
          } else {
            // Fallback to dashboard, middleware will handle proper redirection
            router.push("/dashboard");
          }
        }, 800);
        
      } else {
        // Validate signup data
        registerSchema.parse(formData);

        // Register new user
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        // Check if the response is OK before trying to parse JSON
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.error || `فشل في التسجيل (${response.status})`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setSuccess("تم إنشاء الحساب بنجاح! جاري تسجيل الدخول...");

        // Auto sign in after registration
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
          callbackUrl: decodeURIComponent(callbackUrl),
        });

        if (signInResult?.error) {
          throw new Error(signInResult.error);
        }

        // Redirect will be handled by middleware based on role
        router.refresh();
        
        // Short timeout to show success message
        setTimeout(() => {
          if (signInResult?.url) {
            router.push(signInResult.url);
          } else {
            router.push("/dashboard");
          }
        }, 800);
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ ما");
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle callbackUrl value from query string
  useEffect(() => {
    // Log the callback URL for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.log('Callback URL:', callbackUrl);
    }
  }, [callbackUrl]);

  return (
    <div dir="rtl" className="w-full max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        {type === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
      </h2>

      {isDevelopmentMode && (
        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-3 rounded-md mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          وضع التطوير: انقر فوق "تسجيل الدخول" لتخطي المصادقة
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-md mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-md mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {type === "signup" && !isDevelopmentMode && (
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              الاسم الكامل
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                <FiUser className="h-5 w-5" />
              </div>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="أدخل اسمك الكامل"
                required={!isDevelopmentMode}
                className={`w-full pr-10 ${formErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                disabled={isLoading}
              />
            </div>
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>
        )}

        {!isDevelopmentMode && (
          <>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                  <FiMail className="h-5 w-5" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="your.email@example.com"
                  required={!isDevelopmentMode}
                  className={`w-full pr-10 ${formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  disabled={isLoading}
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
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                  <FiLock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={type === "signup" ? "8 أحرف على الأقل" : "كلمة المرور الخاصة بك"}
                  required={!isDevelopmentMode}
                  className={`w-full pr-10 ${formErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
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
              
              {type === "signup" && formData.password && !isDevelopmentMode && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      قوة كلمة المرور: <span className={`font-semibold ${passwordStrength >= 3 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>{getStrengthText()}</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                    <div 
                      className={`h-full ${getStrengthColor()} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                    <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}`}>
                      <span className="mr-1">•</span> على الأقل 8 أحرف
                    </li>
                    <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                      <span className="mr-1">•</span> حرف كبير واحد على الأقل
                    </li>
                    <li className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                      <span className="mr-1">•</span> رقم واحد على الأقل
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        )}

        {type === "signup" && !isDevelopmentMode && (
          <>
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
                      ? "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-500 dark:text-green-300" 
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
                      ? "bg-pink-50 border-pink-500 text-pink-700 dark:bg-pink-900/30 dark:border-pink-500 dark:text-pink-300" 
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, gender: "FEMALE" as UserGender }))}
                >
                  <FaFemale className="h-5 w-5 ml-2" />
                  <span>أنثى</span>
                </button>
              </div>
            </div>
          </>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 mt-6 font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري التنفيذ...
            </span>
          ) : type === "login" ? (
            <>
              <FiLogIn className="h-5 w-5" /> 
              <span>{isDevelopmentMode ? "دخول كمشرف (وضع التطوير)" : "تسجيل الدخول"}</span>
            </>
          ) : (
            <>
              <FiUserPlus className="h-5 w-5" />
              <span>{isDevelopmentMode ? "دخول كمشرف (وضع التطوير)" : "إنشاء حساب"}</span>
            </>
          )}
        </Button>

        {type === "signup" && !isDevelopmentMode && (
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
        )}

        {type === "signup" && !isDevelopmentMode && (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl })}
              className="w-full flex justify-center items-center gap-2 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <FaGoogle className="h-5 w-5 text-red-500" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => signIn('facebook', { callbackUrl })}
              className="w-full flex justify-center items-center gap-2 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <FaFacebook className="h-5 w-5 text-blue-600" />
              <span>Facebook</span>
            </button>
          </div>
        )}

        {!isDevelopmentMode && (
          <div className="text-center mt-5">
            {type === "login" ? (
              <p className="text-gray-600 dark:text-gray-400">
                ليس لديك حساب؟{" "}
                <a href={`/auth/signup${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} className="text-blue-600 hover:underline font-medium">
                  التسجيل
                </a>
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                لديك حساب بالفعل؟{" "}
                <a href={`/auth/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} className="text-blue-600 hover:underline font-medium">
                  تسجيل الدخول
                </a>
              </p>
            )}
          </div>
        )}

        {type === "signup" && !isDevelopmentMode && (
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-5">
            بالتسجيل، أنت توافق على <a href="/terms" className="text-blue-600 hover:underline">شروط الاستخدام</a> و <a href="/privacy" className="text-blue-600 hover:underline">سياسة الخصوصية</a>
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthForm;