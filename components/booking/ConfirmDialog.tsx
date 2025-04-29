"use client";

import React from 'react';
import { FaCheckCircle, FaCreditCard, FaPaypal, FaMoneyBillWave, FaLock } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { cn } from '@/utils/cn';

interface ConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
  price: number;
  duration: number;
  discount?: number;
}

type PaymentMethod = 'card' | 'paypal' | 'bank';

export default function ConfirmDialog({ 
  onConfirm, 
  onCancel, 
  isSubmitting, 
  error, 
  price, 
  duration,
  discount = 0
}: ConfirmDialogProps) {
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('card');
  const [agreed, setAgreed] = React.useState(false);
  
  // Calculate session price
  const calculatePrice = () => {
    const basePrice = (price * duration) / 60; // price per hour converted to duration
    const discountAmount = basePrice * (discount / 100);
    return basePrice - discountAmount;
  };
  
  const finalPrice = calculatePrice();

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
        تأكيد الحجز
      </h2>
      
      {/* Pricing Summary */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 dark:text-gray-400">رسوم الجلسة ({duration} دقيقة)</span>
          <span className="font-medium">{price} ريال / ساعة</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-600 dark:text-green-400">خصم</span>
            <span className="font-medium text-green-600 dark:text-green-400">- {discount}%</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900 dark:text-white">الإجمالي</span>
          <span className="font-bold text-lg">{finalPrice.toFixed(2)} ريال</span>
        </div>
      </div>
      
      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-gray-900 dark:text-white text-right">
          اختر طريقة الدفع
        </h3>
        
        <div className="space-y-2">
          {/* Credit Card */}
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
              paymentMethod === 'card'
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            )}
          >
            <div className="flex items-center gap-2">
              <FaCreditCard className={paymentMethod === 'card' ? "text-emerald-500" : "text-gray-400"} />
              <span className="text-gray-900 dark:text-white">بطاقة ائتمان</span>
            </div>
            
            {paymentMethod === 'card' && (
              <FaCheckCircle className="text-emerald-500" />
            )}
          </button>
          
          {/* PayPal */}
          <button
            type="button"
            onClick={() => setPaymentMethod('paypal')}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
              paymentMethod === 'paypal'
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            )}
          >
            <div className="flex items-center gap-2">
              <FaPaypal className={paymentMethod === 'paypal' ? "text-emerald-500" : "text-gray-400"} />
              <span className="text-gray-900 dark:text-white">PayPal</span>
            </div>
            
            {paymentMethod === 'paypal' && (
              <FaCheckCircle className="text-emerald-500" />
            )}
          </button>
          
          {/* Bank Transfer */}
          <button
            type="button"
            onClick={() => setPaymentMethod('bank')}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
              paymentMethod === 'bank'
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            )}
          >
            <div className="flex items-center gap-2">
              <FaMoneyBillWave className={paymentMethod === 'bank' ? "text-emerald-500" : "text-gray-400"} />
              <span className="text-gray-900 dark:text-white">تحويل بنكي</span>
            </div>
            
            {paymentMethod === 'bank' && (
              <FaCheckCircle className="text-emerald-500" />
            )}
          </button>
        </div>
        
        {/* Secure payment badge */}
        <div className="flex items-center justify-center gap-1 mt-4 text-sm text-gray-500">
          <FaLock size={12} />
          <span>معاملات آمنة ومشفرة</span>
        </div>
      </div>
      
      {/* Terms Agreement */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-right">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
            أوافق على <a href="#" className="text-emerald-600 hover:underline">شروط الاستخدام</a> و <a href="#" className="text-emerald-600 hover:underline">سياسة الإلغاء</a>
          </label>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md text-sm text-right">
          {error}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          العودة
        </Button>
        
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={!agreed || isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري التأكيد...
            </>
          ) : (
            'تأكيد الحجز'
          )}
        </Button>
      </div>
    </div>
  );
}
