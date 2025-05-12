"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Teacher } from '@/types';
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaCalendarAlt, FaClock, FaUserAlt } from 'react-icons/fa';
import { SlotType } from '../AvailabilityCalendar';
import { format, parseISO, addMinutes, differenceInMinutes } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { TeacherProfileCard } from '../teacher/TeacherProfileCard';
import AvailabilityCalendar from '../AvailabilityCalendar';
import DateSelector from './DateSelector';
import SlotSelector from './SlotSelector';
import DetailsSelector from './DetailsSelector';
import ConfirmDialog from './ConfirmDialog';
import BookingSummary from './BookingSummary';

interface TeacherBookingProps {
  teacher: Teacher;
  availabilitySlots: SlotType[];
}

type BookingStep = 'date' | 'time' | 'details' | 'confirm' | 'success';

export default function TeacherBooking({ teacher, availabilitySlots }: TeacherBookingProps) {
  // State
  const [currentStep, setCurrentStep] = useState<BookingStep>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotType | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    participantCount: 1,
    goal: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  
  const router = useRouter();

  // Filter slots based on selected date
  const filteredSlots = selectedDate 
    ? availabilitySlots.filter(slot => {
        const slotDate = parseISO(slot.startTime);
        return (
          slotDate.getDate() === selectedDate.getDate() &&
          slotDate.getMonth() === selectedDate.getMonth() &&
          slotDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];

  // Handle slot selection
  const handleSelectSlot = (slot: SlotType) => {
    setSelectedSlot(slot);
    setCurrentStep('details');
  };

  // Handle date selection
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setCurrentStep('time');
  };

  // Handle details submission
  const handleDetailsSubmit = (details: typeof bookingDetails) => {
    setBookingDetails(details);
    setCurrentStep('confirm');
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    
    setIsSubmitting(true);
    setBookingError(null);
    
    try {
      // Mock API call to book the slot
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock booking ID
      const mockBookingId = `BK-${Date.now().toString().slice(-8)}`;
      setBookingId(mockBookingId);
      
      setBookingConfirmed(true);
      setCurrentStep('success');
    } catch (error) {
      console.error("Booking failed:", error);
      setBookingError("حدث خطأ أثناء تأكيد الحجز. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle navigation to previous step
  const goToPreviousStep = () => {
    switch (currentStep) {
      case 'time':
        setCurrentStep('date');
        break;
      case 'details':
        setCurrentStep('time');
        break;
      case 'confirm':
        setCurrentStep('details');
        break;
      default:
        break;
    }
  };

  // Calculate session duration
  const calculateSessionDuration = () => {
    if (!selectedSlot) return 0;
    
    const startTime = parseISO(selectedSlot.startTime);
    const endTime = parseISO(selectedSlot.endTime);
    
    return differenceInMinutes(endTime, startTime);
  };

  // Format slot time for display
  const formatSlotTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'h:mm a', { locale: ar });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Teacher info */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24">
            <TeacherProfileCard 
              teacher={teacher} 
              variant="default" 
              showBookButton={false}
              showViewProfileButton={true} 
            />
            
            {(currentStep === 'confirm' || currentStep === 'success') && (
              <Card className="mt-4 p-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 text-center">
                  ملخص الحجز
                </h3>
                <BookingSummary 
                  teacherName={teacher.name}
                  date={selectedDate}
                  slot={selectedSlot}
                  details={bookingDetails}
                  duration={calculateSessionDuration()}
                />
              </Card>
            )}
          </div>
        </div>
        
        {/* Right side - Booking flow */}
        <div className="w-full lg:w-2/3">
          {/* Step indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              {['date', 'time', 'details', 'confirm'].map((step, index) => (
                <React.Fragment key={step}>
                  {/* Step dot */}
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep === step
                          ? 'bg-emerald-500 text-white'
                          : currentStep === 'success' || 
                            (index === 0 && currentStep === 'time') ||
                            (index <= 1 && currentStep === 'details') ||
                            (index <= 2 && currentStep === 'confirm')
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                      {step === 'date' && 'التاريخ'}
                      {step === 'time' && 'الوقت'}
                      {step === 'details' && 'التفاصيل'}
                      {step === 'confirm' && 'التأكيد'}
                    </span>
                  </div>
                  
                  {/* Connecting line */}
                  {index < 3 && (
                    <div 
                      className={`flex-1 h-0.5 mx-2 ${
                        (index === 0 && (currentStep === 'time' || currentStep === 'details' || currentStep === 'confirm' || currentStep === 'success')) ||
                        (index === 1 && (currentStep === 'details' || currentStep === 'confirm' || currentStep === 'success')) ||
                        (index === 2 && (currentStep === 'confirm' || currentStep === 'success'))
                          ? 'bg-emerald-500'
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Step content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {/* Date Selection */}
            {currentStep === 'date' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                  اختر تاريخ الجلسة
                </h2>
                <DateSelector 
                  onSelectDate={handleSelectDate}
                  selectedDate={selectedDate}
                  availableDates={availabilitySlots ? availabilitySlots.map(slot => parseISO(slot.startTime)) : []}
                />
              </div>
            )}
            
            {/* Time Selection */}
            {currentStep === 'time' && selectedDate && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">
                  اختر وقت الجلسة
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                  {format(selectedDate, 'eeee d MMMM yyyy', { locale: ar })}
                </p>
                
                {filteredSlots.length === 0 ? (
                  <div className="text-center py-12">
                    <FaClock className="mx-auto text-gray-400 text-4xl mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      لا توجد مواعيد متاحة في هذا التاريخ
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setCurrentStep('date')}
                    >
                      <FaArrowLeft className="ml-2 rtl:rotate-180" />
                      اختر تاريخ آخر
                    </Button>
                  </div>
                ) : (
                  <>
                    <SlotSelector 
                      slots={filteredSlots}
                      onSelectSlot={handleSelectSlot}
                    />
                    
                    <div className="mt-6 flex justify-between">
                      <Button
                        variant="outline"
                        onClick={goToPreviousStep}
                      >
                        <FaArrowLeft className="ml-2 rtl:rotate-180" />
                        العودة للتاريخ
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Details Input */}
            {currentStep === 'details' && selectedSlot && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">
                  أدخل تفاصيل الحجز
                </h2>
                <div className="flex items-center justify-center gap-2 mb-6 text-gray-600 dark:text-gray-400">
                  <FaCalendarAlt className="text-emerald-500" />
                  <span>{format(parseISO(selectedSlot.startTime), 'eeee d MMMM', { locale: ar })}</span>
                  <span className="mx-2">•</span>
                  <FaClock className="text-emerald-500" />
                  <span>
                    {formatSlotTime(selectedSlot.startTime)} - {formatSlotTime(selectedSlot.endTime)}
                  </span>
                </div>
                
                <DetailsSelector
                  initialValues={bookingDetails}
                  onSubmit={handleDetailsSubmit}
                  onBack={goToPreviousStep}
                  isGroupSession={selectedSlot.type === 'group'}
                  maxParticipants={selectedSlot.maxParticipants}
                />
              </div>
            )}
            
            {/* Confirmation */}
            {currentStep === 'confirm' && selectedSlot && (
              <div className="animate-fadeIn">
                <ConfirmDialog 
                  onConfirm={handleConfirmBooking}
                  onCancel={goToPreviousStep}
                  isSubmitting={isSubmitting}
                  error={bookingError}
                  price={teacher.price || 0}
                  duration={calculateSessionDuration()}
                />
              </div>
            )}
            
            {/* Success */}
            {currentStep === 'success' && bookingConfirmed && (
              <div className="animate-fadeIn text-center py-8">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <FaCheckCircle className="text-green-600 dark:text-green-400 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  تم تأكيد الحجز بنجاح
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  رقم الحجز: {bookingId}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  تم إرسال تفاصيل الحجز إلى بريدك الإلكتروني
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/user')}
                  >
                    الذهاب للوحة التحكم
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => router.push('/teachers')}
                  >
                    تصفح المعلمين
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}