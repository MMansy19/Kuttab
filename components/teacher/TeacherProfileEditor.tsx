"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { z } from 'zod';
import { Teacher } from '@/types';
import { cn } from '@/utils/cn';
import debounce from '@/utils/debounce'; // Fix: Use default import for debounce
import { FaPlus, FaTrash, FaTimes, FaCheck, FaSave, FaVideo, FaImage, FaUndo } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

// Form validation schema
const teacherSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" }),
  bio: z.string().min(20, { message: "النبذة التعريفية يجب أن تكون 20 حرف على الأقل" }),
  subjects: z.array(z.string()).min(1, { message: "يجب إضافة تخصص واحد على الأقل" }),
  specialization: z.string().min(2, { message: "يجب إضافة التخصص الرئيسي" }),
  experience: z.number().min(0, { message: "يجب إدخال سنوات الخبرة" }),
  education: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  teachingApproach: z.string().optional(),
  languages: z.array(z.string()).min(1, { message: "يجب إضافة لغة واحدة على الأقل" }),
  isPaid: z.boolean(),
  price: z.number().nullable().optional(),
});

type ValidationError = {
  [key: string]: string;
};

interface TeacherProfileEditorProps {
  teacher?: Teacher;
  onSave: (teacher: Teacher) => Promise<void>;
}

export default function TeacherProfileEditor({ teacher, onSave }: TeacherProfileEditorProps) {
  // State for form data
  const [formData, setFormData] = useState<Partial<Teacher>>(
    teacher || {
      name: "",
      bio: "",
      subjects: [],
      specialization: "",
      experience: 0,
      rating: 0,
      avatarUrl: "",
      availableSlots: [],
      isPaid: false,
      price: undefined,
      videoUrl: "",
      gender: "male",
      certifications: [],
      languages: ["العربية"],
      achievements: [],
    }
  );
  
  // UI states
  const [errors, setErrors] = useState<ValidationError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("basic"); // basic, qualifications, media
  const [newSubject, setNewSubject] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(teacher?.avatarUrl || null);
  const [videoPreview, setVideoPreview] = useState<string | null>(teacher?.videoUrl || null);
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showAutoSaveMessage, setShowAutoSaveMessage] = useState(false);

  // Refs
  const avatarRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Track if form is dirty (modified)
  useEffect(() => {
    setIsDirty(true);
  }, [formData]);

  // Auto-save feature
  const autoSave = useCallback(
    debounce(async () => {
      if (isDirty) {
        try {
          // Validate form before auto-saving
          const validationResult = validateForm();
          if (Object.keys(validationResult).length === 0) {
            setSavingStatus('saving');
            setShowAutoSaveMessage(true);
            await onSave(formData as Teacher);
            setSavingStatus('saved');
            setIsDirty(false);
            
            // Hide the saved message after 3 seconds
            setTimeout(() => {
              setShowAutoSaveMessage(false);
              setSavingStatus('idle');
            }, 3000);
          }
        } catch (error) {
          console.error('Auto-save failed', error);
          setSavingStatus('error');
        }
      }
    }, 5000),
    [formData, isDirty, onSave]
  );

  // Trigger auto-save when form is dirty
  useEffect(() => {
    if (isDirty) {
      autoSave();
    }
    
    // No need for cleanup as our debounce implementation doesn't have a cancel method
    return () => {
      // Nothing to clean up
    };
  }, [isDirty, autoSave]);

  // Validate form data
  const validateForm = (): ValidationError => {
    try {
      // Only validate required fields based on active tab
      let validationSchema;
      
      if (activeTab === 'basic') {
        validationSchema = teacherSchema.pick({
          name: true,
          bio: true,
          subjects: true,
          specialization: true,
          experience: true,
          isPaid: true,
        });
      } else if (activeTab === 'qualifications') {
        validationSchema = teacherSchema.pick({
          education: true,
          certifications: true,
          languages: true,
        });
      }
      
      if (validationSchema) {
        validationSchema.parse(formData);
      }
      
      // Handle price validation separately
      if (formData.isPaid && (!formData.price || formData.price <= 0)) {
        return { price: "يجب إدخال سعر صحيح للجلسات المدفوعة" };
      }
      
      setErrors({});
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce((acc, err) => {
          const path = err.path[0] as string;
          acc[path] = err.message;
          return acc;
        }, {} as ValidationError);
        
        setErrors(formattedErrors);
        return formattedErrors;
      }
      return {};
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
      
      // If isPaid is set to false, reset price to null
      if (name === 'isPaid' && !checked) {
        setFormData(prev => ({ ...prev, [name]: checked, price: null }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle list item additions
  const handleAddItem = (field: keyof Teacher, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (!value.trim()) return;
    
    // Make sure the field exists and is an array
    if (!formData[field] || !Array.isArray(formData[field])) {
      setFormData({ ...formData, [field]: [value] });
    } else {
      // Check for duplicates
      const currentArray = formData[field] as string[];
      if (!currentArray.includes(value)) {
        setFormData({ ...formData, [field]: [...currentArray, value] });
      }
    }
    
    // Reset the input field
    setter("");
  };

  // Handle list item removals
  const handleRemoveItem = (field: keyof Teacher, index: number) => {
    if (formData[field] && Array.isArray(formData[field])) {
      const newArray = [...(formData[field] as string[])];
      newArray.splice(index, 1);
      setFormData({ ...formData, [field]: newArray });
    }
  };

  // File handling for avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("حجم الملف كبير جدًا. الحد الأقصى هو 5 ميجابايت.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("يُرجى اختيار ملف صورة صالح.");
        return;
      }

      // Process image file
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
        setFormData({ ...formData, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // File handling for video
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        alert("حجم الفيديو كبير جدًا. الحد الأقصى هو 50 ميجابايت.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert("يُرجى اختيار ملف فيديو صالح.");
        return;
      }

      // Process video file
      const reader = new FileReader();
      reader.onload = () => {
        setVideoPreview(reader.result as string);
        setFormData({ ...formData, videoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handling
  const handleDragOver = (e: React.DragEvent, type: 'avatar' | 'video') => {
    e.preventDefault();
    if (type === 'avatar') {
      setIsDraggingAvatar(true);
    } else {
      setIsDraggingVideo(true);
    }
  };

  const handleDragLeave = (type: 'avatar' | 'video') => {
    if (type === 'avatar') {
      setIsDraggingAvatar(false);
    } else {
      setIsDraggingVideo(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'avatar' | 'video') => {
    e.preventDefault();
    
    if (type === 'avatar') {
      setIsDraggingAvatar(false);
    } else {
      setIsDraggingVideo(false);
    }
    
    const file = e.dataTransfer.files[0];
    if (file) {
      if (type === 'avatar' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setAvatarPreview(reader.result as string);
          setFormData({ ...formData, avatarUrl: reader.result as string });
        };
        reader.readAsDataURL(file);
      } else if (type === 'video' && file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setVideoPreview(reader.result as string);
          setFormData({ ...formData, videoUrl: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      // Scroll to the first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSavingStatus('saving');
      
      // Submit form data
      await onSave(formData as Teacher);
      
      setIsDirty(false);
      setSavingStatus('saved');
      
      // Show saved message
      setShowAutoSaveMessage(true);
      setTimeout(() => {
        setShowAutoSaveMessage(false);
        setSavingStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Failed to save profile', error);
      setSavingStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Auto-save notification */}
      {showAutoSaveMessage && (
        <div 
          className={cn(
            "fixed top-4 right-4 z-50 py-2 px-4 rounded-md text-white transition-all duration-300 shadow-lg",
            savingStatus === 'saving' ? "bg-blue-500" : 
            savingStatus === 'saved' ? "bg-green-500" :
            savingStatus === 'error' ? "bg-red-500" : ""
          )}
        >
          {savingStatus === 'saving' && (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري الحفظ التلقائي...
            </span>
          )}
          {savingStatus === 'saved' && (
            <span className="flex items-center gap-2">
              <FaCheck className="text-white" />
              تم حفظ التغييرات
            </span>
          )}
          {savingStatus === 'error' && (
            <span className="flex items-center gap-2">
              <FaTimes className="text-white" />
              فشل الحفظ التلقائي
            </span>
          )}
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-right text-gray-900 dark:text-white">
            تعديل الملف الشخصي
          </h2>
          
          {/* Tabs */}
          <div className="flex mb-6 justify-end border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={cn(
                "py-2 px-4 text-sm font-medium",
                activeTab === "basic"
                  ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              البيانات الأساسية
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("qualifications")}
              className={cn(
                "py-2 px-4 text-sm font-medium",
                activeTab === "qualifications"
                  ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              المؤهلات والمهارات
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className={cn(
                "py-2 px-4 text-sm font-medium",
                activeTab === "media"
                  ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              الصور والوسائط
            </button>
          </div>
          
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div>
                  <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">الاسم الكامل</label>
                  <input
                    type="text"
                    name="name"
                    className={cn(
                      "w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
                      errors.name ? "border-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-700"
                    )}
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك الكامل"
                    dir="rtl"
                  />
                  {errors.name && <p className="mt-1 text-red-500 text-sm text-right">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">نبذة تعريفية</label>
                  <textarea
                    name="bio"
                    className={cn(
                      "w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
                      errors.bio ? "border-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-700"
                    )}
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    placeholder="اكتب نبذة مختصرة عنك ومؤهلاتك في تعليم القرآن والعلوم الإسلامية"
                    rows={4}
                    dir="rtl"
                  />
                  {errors.bio && <p className="mt-1 text-red-500 text-sm text-right">{errors.bio}</p>}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                    {formData.bio?.length || 0}/500 حرف
                  </p>
                </div>
                
                <div>
                  <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">التخصص الرئيسي</label>
                  <input
                    type="text"
                    name="specialization"
                    className={cn(
                      "w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
                      errors.specialization ? "border-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-700"
                    )}
                    value={formData.specialization || ''}
                    onChange={handleInputChange}
                    placeholder="مثال: القراءات العشر، حفص عن عاصم، تحفيظ الأطفال"
                    dir="rtl"
                  />
                  {errors.specialization && (
                    <p className="mt-1 text-red-500 text-sm text-right">{errors.specialization}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">المواد التي تعلمها</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="أدخل المادة التي تعلمها"
                      dir="rtl"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddItem('subjects', newSubject, setNewSubject);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem('subjects', newSubject, setNewSubject)}
                      className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  
                  {errors.subjects && <p className="mt-1 text-red-500 text-sm text-right">{errors.subjects}</p>}
                  
                  <div className="flex flex-wrap gap-2 mt-3 justify-end">
                    {formData.subjects?.map((subject, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1 py-1.5">
                        {subject}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem('subjects', index)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <FaTimes size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">منهجية التدريس</label>
                  <textarea
                    name="teachingApproach"
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.teachingApproach || ''}
                    onChange={handleInputChange}
                    placeholder="صف منهجيتك في التدريس وطريقة تعاملك مع الطلاب"
                    rows={3}
                    dir="rtl"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">سنوات الخبرة</label>
                    <input
                      type="number"
                      name="experience"
                      min="0"
                      className={cn(
                        "w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
                        errors.experience ? "border-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-700"
                      )}
                      value={formData.experience || 0}
                      onChange={handleInputChange}
                      dir="rtl"
                    />
                    {errors.experience && <p className="mt-1 text-red-500 text-sm text-right">{errors.experience}</p>}
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">الجنس</label>
                    <div className="flex justify-end gap-4 mt-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">ذكر</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">أنثى</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-end gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="isPaid"
                      name="isPaid"
                      checked={formData.isPaid || false}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="isPaid" className="text-gray-700 dark:text-gray-300">خدمة مدفوعة</label>
                  </div>
                    
                  {formData.isPaid && (
                    <div>
                      <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">سعر الجلسة (بالريال)</label>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        className={cn(
                          "w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
                          errors.price ? "border-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-700"
                        )}
                        value={formData.price || ''}
                        onChange={handleInputChange}
                        dir="rtl"
                      />
                      {errors.price && <p className="mt-1 text-red-500 text-sm text-right">{errors.price}</p>}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Qualifications Tab */}
            {activeTab === "qualifications" && (
              <div className="space-y-6">
                <div>
                  <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">المؤهل التعليمي</label>
                  <input
                    type="text"
                    name="education"
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.education || ''}
                    onChange={handleInputChange}
                    placeholder="مثال: بكالوريوس في الدراسات الإسلامية، دكتوراه في التفسير وعلوم القرآن"
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">الشهادات والإجازات</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="أدخل شهادة أو إجازة حصلت عليها"
                      dir="rtl"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddItem('certifications', newCertification, setNewCertification);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem('certifications', newCertification, setNewCertification)}
                      className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    {formData.certifications?.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem('certifications', index)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <FaTrash size={14} />
                        </button>
                        <span className="text-gray-900 dark:text-gray-200">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">اللغات</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="أدخل لغة تتحدث بها"
                      dir="rtl"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddItem('languages', newLanguage, setNewLanguage);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem('languages', newLanguage, setNewLanguage)}
                      className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  
                  {errors.languages && <p className="mt-1 text-red-500 text-sm text-right">{errors.languages}</p>}
                  
                  <div className="flex flex-wrap gap-2 mt-3 justify-end">
                    {formData.languages?.map((language, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1 py-1.5">
                        {language}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem('languages', index)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <FaTimes size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">الإنجازات</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="أدخل إنجاز حققته في مجال التدريس"
                      dir="rtl"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddItem('achievements', newAchievement, setNewAchievement);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem('achievements', newAchievement, setNewAchievement)}
                      className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    {formData.achievements?.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem('achievements', index)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <FaTrash size={14} />
                        </button>
                        <span className="text-gray-900 dark:text-gray-200">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-right text-gray-700 dark:text-gray-300">معلومات التواصل</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-right text-gray-600 dark:text-gray-400 text-sm">البريد الإلكتروني</label>
                      <input
                        type="email"
                        name="contactInfo.email"
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={formData.contactInfo?.email || ''}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            contactInfo: {
                              ...formData.contactInfo,
                              email: e.target.value
                            }
                          });
                        }}
                        placeholder="example@email.com"
                        dir="rtl"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-right text-gray-600 dark:text-gray-400 text-sm">رقم الهاتف</label>
                      <input
                        type="tel"
                        name="contactInfo.phone"
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={formData.contactInfo?.phone || ''}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            contactInfo: {
                              ...formData.contactInfo,
                              phone: e.target.value
                            }
                          });
                        }}
                        placeholder="+966-xx-xxx-xxxx"
                        dir="ltr"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-right text-gray-600 dark:text-gray-400 text-sm">واتساب</label>
                      <input
                        type="tel"
                        name="contactInfo.whatsapp"
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={formData.contactInfo?.whatsapp || ''}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            contactInfo: {
                              ...formData.contactInfo,
                              whatsapp: e.target.value
                            }
                          });
                        }}
                        placeholder="+966-xx-xxx-xxxx"
                        dir="ltr"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-right text-gray-600 dark:text-gray-400 text-sm">تيليجرام</label>
                      <input
                        type="text"
                        name="contactInfo.telegram"
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={formData.contactInfo?.telegram || ''}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            contactInfo: {
                              ...formData.contactInfo,
                              telegram: e.target.value
                            }
                          });
                        }}
                        placeholder="@username"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Media Tab */}
            {activeTab === "media" && (
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-right text-gray-700 dark:text-gray-300">صورة الملف الشخصي</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Avatar Upload */}
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-4 text-center transition-all",
                        isDraggingAvatar
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-gray-300 dark:border-gray-700"
                      )}
                      onDragOver={(e) => handleDragOver(e, 'avatar')}
                      onDragLeave={() => handleDragLeave('avatar')}
                      onDrop={(e) => handleDrop(e, 'avatar')}
                    >
                      {avatarPreview ? (
                        <div className="relative mx-auto">
                          <Image
                            src={avatarPreview}
                            alt="Avatar preview"
                            width={150}
                            height={150}
                            className="h-40 w-40 object-cover rounded-lg mx-auto"
                          />
                          <div className="flex justify-center gap-2 mt-4">
                            <button
                              type="button"
                              onClick={() => {
                                setAvatarPreview(null);
                                setFormData({ ...formData, avatarUrl: "" });
                              }}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center gap-1"
                            >
                              <FaTimes size={12} /> إزالة
                            </button>
                            <button
                              type="button"
                              onClick={() => avatarRef.current?.click()}
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-1"
                            >
                              <FaImage size={12} /> تغيير
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <FaImage className="h-12 w-12 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            اسحب وأفلت الصورة هنا أو
                          </p>
                          <button
                            type="button"
                            onClick={() => avatarRef.current?.click()}
                            className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            اختر صورة
                          </button>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            مسموح بصيغ JPG، PNG أو GIF. الحد الأقصى 5 ميجابايت.
                          </p>
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
                    
                    {/* Preview */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-center mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">معاينة الصورة الشخصية</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ستظهر صورتك بالشكل التالي في الملف الشخصي
                        </p>
                      </div>
                      
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {avatarPreview ? (
                          <Image
                            src={avatarPreview}
                            alt="Avatar preview"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-emerald-600 text-white text-2xl font-bold">
                            {formData.name?.charAt(0) || "؟"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 text-right text-gray-700 dark:text-gray-300">فيديو تعريفي (اختياري)</label>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-4 text-center transition-all",
                      isDraggingVideo
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-gray-300 dark:border-gray-700"
                    )}
                    onDragOver={(e) => handleDragOver(e, 'video')}
                    onDragLeave={() => handleDragLeave('video')}
                    onDrop={(e) => handleDrop(e, 'video')}
                  >
                    {videoPreview ? (
                      <div className="relative">
                        <video
                          src={videoPreview}
                          controls
                          className="w-full max-h-80 rounded-lg"
                        />
                        <div className="flex justify-center gap-2 mt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setVideoPreview(null);
                              setFormData({ ...formData, videoUrl: "" });
                            }}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center gap-1"
                          >
                            <FaTimes size={12} /> إزالة
                          </button>
                          <button
                            type="button"
                            onClick={() => videoRef.current?.click()}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-1"
                          >
                            <FaVideo size={12} /> تغيير
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <FaVideo className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          اسحب وأفلت الفيديو هنا أو
                        </p>
                        <button
                          type="button"
                          onClick={() => videoRef.current?.click()}
                          className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          اختر فيديو
                        </button>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          مسموح بصيغ MP4، WebM. الحد الأقصى 50 ميجابايت.
                          <br />
                          يُفضل تسجيل فيديو تعريفي قصير عن منهجك في التدريس.
                        </p>
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
            )}
            
            {/* Bottom buttons */}
            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  if (window.confirm("هل أنت متأكد من رغبتك في إلغاء التغييرات؟")) {
                    setFormData(teacher || {
                      name: "",
                      bio: "",
                      subjects: [],
                      specialization: "",
                      experience: 0,
                      rating: 0,
                      avatarUrl: "",
                      availableSlots: [],
                      isPaid: false,
                      price: null,
                      videoUrl: "",
                      gender: "male",
                      certifications: [],
                      languages: ["العربية"],
                      achievements: [],
                    });
                    setAvatarPreview(teacher?.avatarUrl || null);
                    setVideoPreview(teacher?.videoUrl || null);
                  }
                }}
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                <FaUndo />
                إلغاء التغييرات
              </Button>
              
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <FaSave />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}