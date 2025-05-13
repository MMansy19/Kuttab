"use client";

import React, { useEffect, useState } from 'react';
import { 
  validatePassword, 
  getPasswordStrengthText, 
  getPasswordStrengthClass, 
  getPasswordStrengthTextClass,
  PasswordStrengthLevel
} from '../utils/password-validation';

interface PasswordStrengthIndicatorProps {
  /**
   * The password to evaluate
   */
  password: string;
  
  /**
   * Whether to show strength text
   * @default true
   */
  showText?: boolean;
  
  /**
   * Whether to show suggestions
   * @default false
   */
  showSuggestions?: boolean;
  
  /**
   * CSS class for the container
   */
  className?: string;
}

/**
 * Component that displays password strength and feedback
 */
export function PasswordStrengthIndicator({
  password,
  showText = true,
  showSuggestions = false,
  className = "",
}: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState<PasswordStrengthLevel>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    if (!password) {
      setStrength(0);
      setFeedback(null);
      setSuggestions([]);
      return;
    }
    
    const result = validatePassword(password);
    setStrength(result.score);
    setFeedback(result.feedback.warning);
    setSuggestions(result.feedback.suggestions);
  }, [password]);
  
  return (
    <div className={`space-y-2 ${className}`}>
      {showText && password && (
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            قوة كلمة المرور: 
            <span className={`mr-1 font-semibold ${getPasswordStrengthTextClass(strength)}`}>
              {getPasswordStrengthText(strength)}
            </span>
          </span>
        </div>
      )}
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getPasswordStrengthClass(strength)}`}
          style={{ width: `${Math.min(100, (strength / 5) * 100)}%` }}
        ></div>
      </div>
      
      {showSuggestions && feedback && (
        <div className="mt-1 text-xs text-orange-600 dark:text-orange-400">
          {feedback}
        </div>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="mt-1 space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">اقتراحات لتقوية كلمة المرور:</p>
          <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside">
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
