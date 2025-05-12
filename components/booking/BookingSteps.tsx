"use client";

import React from 'react';
import { FaCalendarAlt, FaClock, FaUserAlt, FaCheckCircle } from 'react-icons/fa';

export type BookingStep = 'date' | 'time' | 'details' | 'confirm' | 'success';

interface BookingStepsProps {
  currentStep: BookingStep;
}

/**
 * Component for displaying booking process steps with active step highlighted
 */
const BookingSteps: React.FC<BookingStepsProps> = ({ currentStep }) => {
  const steps = [
    { id: 'date', icon: FaCalendarAlt, label: 'التاريخ' },
    { id: 'time', icon: FaClock, label: 'الوقت' },
    { id: 'details', icon: FaUserAlt, label: 'التفاصيل' },
    { id: 'confirm', icon: FaCheckCircle, label: 'التأكيد' },
  ];
  
  // Find current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="flex justify-between mb-8 px-4">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep || step.id === 'success';
        const isPast = index < currentStepIndex;
        const Icon = step.icon;
        
        return (
          <div key={step.id} className="flex flex-col items-center relative">
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div 
                className={`absolute top-4 w-full h-0.5 right-1/2 ${
                  isPast ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'
                }`}
                style={{ width: 'calc(100% - 2rem)' }}
              />
            )}
            
            {/* Step circle */}
            <div 
              className={`w-8 h-8 flex items-center justify-center rounded-full z-10 ${
                isActive ? 'bg-emerald-500 text-white' : 
                  isPast ? 'bg-emerald-500 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            
            {/* Step label */}
            <div className={`mt-2 text-xs text-center ${
              isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 
                isPast ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingSteps;
