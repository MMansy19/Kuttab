"use client";

import React, { useState } from 'react';
import { z } from 'zod';
import { FaUser, FaEnvelope, FaPhone, FaUserGraduate, FaCommentAlt, FaArrowRight, FaArrowLeft, FaUsers } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { cn } from '@/utils/cn';

interface DetailsSelectorProps {
  initialValues: {
    name: string;
    email: string;
    phone: string;
    message: string;
    participantCount: number;
    goal: string;
    level: 'beginner' | 'intermediate' | 'advanced';
  };
  onSubmit: (values: typeof initialValues) => void;
  onBack: () => void;
  isGroupSession?: boolean;
  maxParticipants?: number;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  phone: z.string().min(8, { message: "رقم الهاتف يجب أن يكون 8 أرقام على الأقل" }),
  message: z.string().optional(),
  participantCount: z.number().min(1, { message: "يجب أن يكون عدد المشاركين 1 على الأقل" }),
  goal: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced'])
});

type ValidationErrors = {
  [key: string]: string;
};

export default function DetailsSelector({ 
  initialValues, 
  onSubmit, 
  onBack,
  isGroupSession = false,
  maxParticipants = 1
}: DetailsSelectorProps) {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [activeSection, setActiveSection] = useState<'personal' | 'learning'>('personal');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    try {
      formSchema.parse(formData);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce((acc, err) => {
          const path = err.path[0] as string;
          acc[path] = err.message;
          return acc;
        }, {} as ValidationErrors);
        return formattedErrors;
      }
      return {};
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeSection === 'personal') {
      // When on personal section, validate only personal fields then move to learning section
      const personalSchema = formSchema.pick({
        name: true,
        email: true,
        phone: true,
        participantCount: isGroupSession ? true : false
      });
      
      try {
        personalSchema.parse(formData);
        setActiveSection('learning');
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formattedErrors = error.errors.reduce((acc, err) => {
            const path = err.path[0] as string;
            acc[path] = err.message;
            return acc;
          }, {} as ValidationErrors);
          setErrors(formattedErrors);
        }
      }
    } else {
      // When on learning section, validate the entire form then submit
      const validationErrors = validateForm();
      
      if (Object.keys(validationErrors).length === 0) {
        onSubmit(formData);
      } else {
        setErrors(validationErrors);
        
        // If there are errors in the personal section, switch back to it
        const hasPersonalErrors = ['name', 'email', 'phone', 'participantCount'].some(field => validationErrors[field]);
        if (hasPersonalErrors) {
          setActiveSection('personal');
        }
      }
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section tabs */}
        <div className="flex mb-6">
          <button
            type="button"
            onClick={() => setActiveSection('personal')}
            className={cn(
              "flex-1 text-center py-2 border-b-2 transition-colors",
              activeSection === 'personal'
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <FaUser />
              <span>البيانات الشخصية</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              // Only allow switching if personal info is validated
              const personalSchema = formSchema.pick({
                name: true,
                email: true,
                phone: true,
                participantCount: isGroupSession ? true : false
              });
              
              try {
                personalSchema.parse(formData);
                setActiveSection('learning');
              } catch (error) {
                // Show errors if validation fails when trying to switch tabs
                if (error instanceof z.ZodError) {
                  const formattedErrors = error.errors.reduce((acc, err) => {
                    const path = err.path[0] as string;
                    acc[path] = err.message;
                    return acc;
                  }, {} as ValidationErrors);
                  setErrors(formattedErrors);
                }
              }
            }}
            className={cn(
              "flex-1 text-center py-2 border-b-2 transition-colors",
              activeSection === 'learning'
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <FaUserGraduate />
              <span>أهداف التعلم</span>
            </div>
          </button>
        </div>
        
        {/* Personal Details Section */}
        {activeSection === 'personal' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-right font-medium text-gray-700 dark:text-gray-300 mb-1">
                الاسم الكامل
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={cn(
                    "block w-full pr-10 py-2 px-4 rounded-md bg-white dark:bg-gray-900 text-right border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
                    errors.name ? "border-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-700"
                  )}
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500 text-right">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-right font-medium text-gray-700 dark:text-gray-300 mb-1">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "block w-full pr-10 py-2 px-4 rounded-md bg-white dark:bg-gray-900 text-right border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
                    errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-700"
                  )}
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 text-right">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-right font-medium text-gray-700 dark:text-gray-300 mb-1">
                رقم الهاتف
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={cn(
                    "block w-full pr-10 py-2 px-4 rounded-md bg-white dark:bg-gray-900 text-right border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
                    errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-700"
                  )}
                  placeholder="+966-xx-xxx-xxxx"
                  dir="ltr"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500 text-right">{errors.phone}</p>
              )}
            </div>
            
            {isGroupSession && (
              <div>
                <label className="block text-sm text-right font-medium text-gray-700 dark:text-gray-300 mb-1">
                  عدد المشاركين
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FaUsers className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="participantCount"
                    value={formData.participantCount}
                    onChange={handleChange}
                    min={1}
                    max={maxParticipants}
                    className={cn(
                      "block w-full pr-10 py-2 px-4 rounded-md bg-white dark:bg-gray-900 text-right border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
                      errors.participantCount ? "border-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-700"
                    )}
                  />
                </div>
                {errors.participantCount ? (
                  <p className="mt-1 text-sm text-red-500 text-right">{errors.participantCount}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                    الحد الأقصى للمشاركين: {maxParticipants}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Learning Goals Section */}
        {activeSection === 'learning' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-right font-medium text-gray-700 dark:text-gray-300 mb-1">
                هدفك من الجلسة
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="block w-full py-2 px-4 rounded-md bg-white dark:bg-gray-900 text-right border border-gray-300 dark:border-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">اختر هدفك من الجلسة</option>
                <option value="recitation">تحسين التلاوة</option>
                <option value="memorization">حفظ القرآن</option>
                <option value="tajweed">تعلم التجويد</option>
                <option value="tafsir">تفسير القرآن</option>
                <option value="general">التعليم العام للقرآن</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-right font-medium text-gray-700 dark:text-gray-300 mb-1">
                المستوى الحالي
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'beginner', label: 'مبتدئ', desc: 'أساسيات التجويد والتلاوة' },
                  { value: 'intermediate', label: 'متوسط', desc: 'تجويد وحفظ أجزاء من القرآن' },
                  { value: 'advanced', label: 'متقدم', desc: 'قراءات وحفظ متقدم' }
                ].map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => setFormData({ ...formData, level: option.value as any })}
                    className={cn(
                      "flex flex-col border rounded-md p-3 transition-colors relative text-right",
                      formData.level === option.value
                        ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500"
                        : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:border-emerald-300"
                    )}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.desc}</div>
                    
                    {formData.level === option.value && (
                      <div className="absolute top-2 left-2 h-3 w-3 bg-emerald-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-right font-medium text-gray-700 dark:text-gray-300 mb-1">
                رسالة إضافية (اختياري)
              </label>
              <div className="relative">
                <div className="absolute top-3 right-3 pointer-events-none">
                  <FaCommentAlt className="text-gray-400" />
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full pr-10 py-2 px-4 rounded-md bg-white dark:bg-gray-900 text-right border border-gray-300 dark:border-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="أي معلومات إضافية ترغب في إضافتها"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Form Controls */}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={activeSection === 'personal' ? onBack : () => setActiveSection('personal')}
            className="flex items-center gap-1"
          >
            <FaArrowRight className="rtl:rotate-180" />
            {activeSection === 'personal' ? 'العودة' : 'السابق'}
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            className="flex items-center gap-1"
          >
            {activeSection === 'personal' ? 'التالي' : 'تأكيد التفاصيل'}
            {activeSection === 'personal' ? (
              <FaArrowLeft className="rtl:rotate-180" />
            ) : null}
          </Button>
        </div>
      </form>
    </div>
  );
}
