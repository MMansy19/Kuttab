"use client";

import React, { useState, useRef, useCallback } from 'react';
import { z } from 'zod';
import { FaGoogle, FaFacebook, FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';
import debounce from '../utils/debounce';
import { cn } from '../utils/cn';
import Image from 'next/image';
import Link from 'next/link';

// Form validation schemas
const emailSchema = z.string().email({ message: "البريد الإلكتروني غير صالح" });
const passwordSchema = z
  .string()
  .min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" })
  .refine(value => /[A-Z]/.test(value), { message: "يجب أن تحتوي على حرف كبير واحد على الأقل" })
  .refine(value => /[0-9]/.test(value), { message: "يجب أن تحتوي على رقم واحد على الأقل" })
  .refine(value => /[^A-Za-z0-9]/.test(value), { message: "يجب أن تحتوي على رمز خاص واحد على الأقل" });
const nameSchema = z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" });

type ValidationError = {
  email?: string;
  password?: string;
  name?: string;
  bio?: string;
};

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState<'USER' | 'TEACHER' | 'ADMIN'>('USER');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [step, setStep] = useState(1);

  // Refs for files
  const avatarRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  // UI states
  const [errors, setErrors] = useState<ValidationError>({});
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = useCallback((password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, []);

  // Debounced validation
  const validateEmailDebounced = useCallback(
    debounce((email: string) => {
      try {
        emailSchema.parse(email);
        setErrors(prev => ({ ...prev, email: undefined }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors(prev => ({ ...prev, email: error.errors[0].message }));
        }
      }
    }, 500),
    []
  );

  const validatePasswordDebounced = useCallback(
    debounce((password: string) => {
      try {
        passwordSchema.parse(password);
        setErrors(prev => ({ ...prev, password: undefined }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors(prev => ({ ...prev, password: error.errors[0].message }));
        }
      }
      calculatePasswordStrength(password);
    }, 500),
    [calculatePasswordStrength]
  );

  // Handle input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmailDebounced(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePasswordDebounced(value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    try {
      nameSchema.parse(value);
      setErrors(prev => ({ ...prev, name: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, name: error.errors[0].message }));
      }
    }
  };

  // File handling
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handling
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'avatar' | 'video') => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      if (type === 'avatar' && file.type.startsWith('image/')) {
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (type === 'video' && file.type.startsWith('video/')) {
        setVideoFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setVideoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const validationErrors: ValidationError = {};
      
      // Validate email
      try {
        emailSchema.parse(email);
      } catch (error) {
        if (error instanceof z.ZodError) {
          validationErrors.email = error.errors[0].message;
        }
      }
      
      // Validate password
      try {
        passwordSchema.parse(password);
      } catch (error) {
        if (error instanceof z.ZodError) {
          validationErrors.password = error.errors[0].message;
        }
      }
      
      // Validate name if signup
      if (mode === 'signup') {
        try {
          nameSchema.parse(name);
        } catch (error) {
          if (error instanceof z.ZodError) {
            validationErrors.name = error.errors[0].message;
          }
        }
        
        // Validate teacher bio if applicable
        if (role === 'TEACHER' && !bio) {
          validationErrors.bio = "يرجى إدخال نبذة تعريفية";
        }
      }
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        throw new Error("Validation failed");
      }
      
      // Mock authentication process with timeout to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      setSuccess(mode === 'login' ? 'تم تسجيل الدخول بنجاح' : 'تم إنشاء الحساب بنجاح');
      
      // Reset form if signup
      if (mode === 'signup') {
        if (step === 2) {
          // Reset form or redirect
          window.location.href = role === 'TEACHER' ? '/dashboard/teacher' : 
                                role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/user';
        } else {
          setStep(2); // Move to next step in signup form
        }
      } else {
        // Redirect based on role for login
        window.location.href = role === 'TEACHER' ? '/dashboard/teacher' : 
                              role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/user';
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social login handlers
  const handleGoogleLogin = () => {
    window.alert('سيتم تفعيل تسجيل الدخول عبر Google قريباً');
  };

  const handleFacebookLogin = () => {
    window.alert('سيتم تفعيل تسجيل الدخول عبر Facebook قريباً');
  };

  const handleAppleLogin = () => {
    window.alert('سيتم تفعيل تسجيل الدخول عبر Apple قريباً');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="dark:bg-gray-800 bg-white rounded-xl shadow-xl p-8 w-full transition-all duration-300">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            {mode === 'login' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            )}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          {mode === 'login' ? 'تسجيل الدخول' : step === 1 ? 'إنشاء حساب' : 'استكمال معلومات الحساب'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {mode === 'login' 
            ? 'أدخل بياناتك للوصول إلى حسابك' 
            : step === 1 
              ? 'قم بإنشاء حساب جديد للاستفادة من خدماتنا' 
              : 'أضف المزيد من التفاصيل إلى ملفك الشخصي'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && step === 1 && (
            <>
              <div>
                <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">الاسم الكامل</label>
                <input
                  type="text"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
                    errors.name ? "border-red-500 focus:border-red-500" : "border-emerald-300 dark:border-gray-700"
                  )}
                  value={name}
                  onChange={handleNameChange}
                  placeholder="أدخل اسمك الكامل"
                  dir="rtl"
                />
                {errors.name && <p className="mt-1 text-red-500 text-sm text-right">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">الجنس</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setGender('male')}
                    className={cn(
                      "px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2",
                      gender === 'male' 
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" 
                        : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>ذكر</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setGender('female')}
                    className={cn(
                      "px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2",
                      gender === 'female' 
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" 
                        : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>أنثى</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">نوع الحساب</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('USER')}
                    className={cn(
                      "px-3 py-2 rounded-lg border-2 transition-all text-sm",
                      role === 'USER' 
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" 
                        : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    طالب
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('TEACHER')}
                    className={cn(
                      "px-3 py-2 rounded-lg border-2 transition-all text-sm",
                      role === 'TEACHER' 
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" 
                        : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    معلم
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('ADMIN')}
                    className={cn(
                      "px-3 py-2 rounded-lg border-2 transition-all text-sm",
                      role === 'ADMIN' 
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" 
                        : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    مسؤول
                  </button>
                </div>
              </div>
            </>
          )}
          
          {mode === 'signup' && step === 2 && (
            <>
              {role === 'TEACHER' && (
                <>
                  <div>
                    <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">نبذة تعريفية</label>
                    <textarea
                      className={cn(
                        "w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
                        errors.bio ? "border-red-500 focus:border-red-500" : "border-emerald-300 dark:border-gray-700"
                      )}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="اكتب نبذة مختصرة عنك ومؤهلاتك في تعليم القرآن والعلوم الإسلامية"
                      dir="rtl"
                      rows={4}
                    />
                    {errors.bio && <p className="mt-1 text-red-500 text-sm text-right">{errors.bio}</p>}
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                      {bio.length}/500 حرف
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {gender === 'male' && (
                      <div>
                        <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">صورة شخصية</label>
                        <div 
                          className={cn(
                            "border-2 border-dashed rounded-lg p-4 text-center transition-all",
                            isDragOver ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "border-gray-300 dark:border-gray-700"
                          )}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, 'avatar')}
                        >
                          {avatarPreview ? (
                            <div className="relative w-40 h-40 mx-auto">
                              <Image 
                                src={avatarPreview} 
                                alt="Avatar preview" 
                                fill
                                className="object-cover rounded-lg"
                              />
                              <button 
                                type="button"
                                onClick={() => setAvatarPreview(null)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">اسحب وأفلت الصورة هنا أو</p>
                              <button 
                                type="button"
                                onClick={() => avatarRef.current?.click()}
                                className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                              >
                                اختر صورة
                              </button>
                            </>
                          )}
                          <input 
                            ref={avatarRef}
                            type="file" 
                            accept="image/*" 
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">فيديو تعريفي (اختياري)</label>
                      <div 
                        className={cn(
                          "border-2 border-dashed rounded-lg p-4 text-center transition-all",
                          isDragOver ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "border-gray-300 dark:border-gray-700"
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'video')}
                      >
                        {videoPreview ? (
                          <div className="relative w-full mx-auto">
                            <video 
                              src={videoPreview}
                              controls
                              className="w-full h-auto rounded-lg"
                            />
                            <button 
                              type="button"
                              onClick={() => setVideoPreview(null)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">اسحب وأفلت الفيديو هنا أو</p>
                            <button 
                              type="button"
                              onClick={() => videoRef.current?.click()}
                              className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              اختر فيديو
                            </button>
                          </>
                        )}
                        <input 
                          ref={videoRef}
                          type="file" 
                          accept="video/*" 
                          onChange={handleVideoChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Always visible fields */}
          {(mode === 'login' || step === 1) && (
            <>
              <div>
                <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
                <input
                  type="email"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
                    errors.email ? "border-red-500 focus:border-red-500" : "border-emerald-300 dark:border-gray-700"
                  )}
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="example@email.com"
                  dir="rtl"
                />
                {errors.email && <p className="mt-1 text-red-500 text-sm text-right">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
                      errors.password ? "border-red-500 focus:border-red-500" : "border-emerald-300 dark:border-gray-700"
                    )}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    dir="rtl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 px-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-red-500 text-sm text-right">{errors.password}</p>}
                
                {/* Password strength meter for signup */}
                {mode === 'signup' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className={cn(
                        passwordStrength >= 75 ? "text-green-500" :
                        passwordStrength >= 50 ? "text-yellow-500" :
                        passwordStrength >= 25 ? "text-orange-500" : "text-red-500"
                      )}>
                        {passwordStrength === 0 ? "ضعيفة جداً" :
                         passwordStrength <= 25 ? "ضعيفة" :
                         passwordStrength <= 50 ? "متوسطة" :
                         passwordStrength <= 75 ? "جيدة" : "قوية"}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-300",
                          passwordStrength >= 75 ? "bg-green-500" :
                          passwordStrength >= 50 ? "bg-yellow-500" :
                          passwordStrength >= 25 ? "bg-orange-500" : "bg-red-500"
                        )}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          
          {mode === 'login' && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="remember" className="text-gray-600 dark:text-gray-400">تذكرني</label>
              </div>
              <Link href="/auth/forgot-password" className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300">
                نسيت كلمة المرور؟
              </Link>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 rounded-lg p-3 text-center">
              {success}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-[1.02] duration-200",
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري التحميل...
              </div>
            ) : (
              mode === 'login' ? 'تسجيل الدخول' : step === 1 ? 'متابعة' : 'إنشاء الحساب'
            )}
          </button>

          {/* Social logins */}
          {(mode === 'login' || step === 1) && (
            <>
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-gray-800 px-4 text-sm text-gray-500 dark:text-gray-400">
                    أو
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaGoogle className="h-5 w-5 text-red-500" />
                </button>
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaFacebook className="h-5 w-5 text-blue-600" />
                </button>
                <button
                  type="button"
                  onClick={handleAppleLogin}
                  className="flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaApple className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
        </form>
      </div>
      
      <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
        {mode === 'login' ? (
          <>
            ليس لديك حساب؟{' '}
            <Link href="/auth/signup" className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold">
              إنشاء حساب جديد
            </Link>
          </>
        ) : (
          <>
            لديك حساب بالفعل؟{' '}
            <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold">
              تسجيل الدخول
            </Link>
          </>
        )}
      </p>
    </div>
  );
}