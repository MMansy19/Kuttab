"use client";

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { Button } from '../ui/Button';

interface RatingCompProps {
  initialRating?: number;
  totalStars?: number;
  size?: string;
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
  onSubmit?: (rating: number, comment: string) => Promise<void>;
  showSubmit?: boolean;
}

const RatingComp = ({
  initialRating = 0,
  totalStars = 5,
  size = 'md',
  editable = false,
  onRatingChange,
  onSubmit,
  showSubmit = false,
}: RatingCompProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Size classes based on the size prop
  const sizeClass = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size] || 'text-lg';

  // Handle star click
  const handleClick = (selectedRating: number) => {
    if (!editable) return;
    
    setRating(selectedRating);
    if (onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await onSubmit(rating, comment);
      
      setSuccess('تم إرسال التقييم بنجاح!');
      setComment('');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إرسال التقييم');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-1 flex-row-reverse">
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          return (
            <FaStar
              key={index}
              className={`cursor-${editable ? 'pointer' : 'default'} ${sizeClass} ${
                starValue <= (hoverRating || rating)
                  ? 'text-yellow-500'
                  : 'text-gray-300'
              }`}
              onClick={() => handleClick(starValue)}
              onMouseEnter={editable ? () => setHoverRating(starValue) : undefined}
              onMouseLeave={editable ? () => setHoverRating(0) : undefined}
            />
          );
        })}
        
        {rating > 0 && (
          <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">
            {rating} من {totalStars}
          </span>
        )}
      </div>

      {showSubmit && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-1 text-right">
              تعليقك:
            </label>
            <textarea
              id="comment"
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-right"
              rows={3}
              placeholder="شارك رأيك عن هذا المعلم..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              dir="rtl"
            />
          </div>
          
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm text-right">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-600 dark:text-green-400 text-sm text-right">
              {success}
            </div>
          )}
          
          <div className="flex justify-start">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="px-4 py-2"
            >
              {isSubmitting ? 'جارِ الإرسال...' : 'إرسال التقييم'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RatingComp;
