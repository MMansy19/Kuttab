/**
 * Password strength levels
 * 0: No password or empty
 * 1: Very weak - just meets minimum length
 * 2: Weak - has lowercase and numbers
 * 3: Medium - has lowercase, uppercase, and numbers
 * 4: Strong - has lowercase, uppercase, numbers, and special characters
 * 5: Very strong - has all character types and good length
 */
export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface PasswordValidationResult {
  isValid: boolean;
  score: PasswordStrengthLevel;
  feedback: {
    warning: string | null;
    suggestions: string[];
  };
}

/**
 * Validates password strength
 * @param password The password to validate
 * @returns Object containing validation results
 */
export function validatePassword(password: string): PasswordValidationResult {
  // Empty password
  if (!password) {
    return {
      isValid: false,
      score: 0,
      feedback: {
        warning: "كلمة المرور مطلوبة",
        suggestions: ["يجب إدخال كلمة مرور"]
      }
    };
  }

  // Check minimum length
  const hasMinLength = password.length >= 8;
  if (!hasMinLength) {
    return {
      isValid: false,
      score: 1,
      feedback: {
        warning: "كلمة المرور قصيرة جدًا",
        suggestions: ["يجب أن تكون كلمة المرور 8 أحرف على الأقل"]
      }
    };
  }

  // Check character types
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  // Calculate score based on criteria
  let score = 1; // Start with 1 for meeting minimum length

  if (hasLowerCase) score++;
  if (hasUpperCase) score++;
  if (hasDigit) score++;
  if (hasSpecialChar) score++;

  // Cap score at 5
  const finalScore = Math.min(5, score) as PasswordStrengthLevel;

  // Generate feedback
  const suggestions = [];
  const warnings = [];

  if (!hasLowerCase) {
    suggestions.push("إضافة حروف صغيرة");
  }

  if (!hasUpperCase) {
    suggestions.push("إضافة حروف كبيرة");
  }

  if (!hasDigit) {
    suggestions.push("إضافة أرقام");
  }

  if (!hasSpecialChar) {
    suggestions.push("إضافة رموز خاصة (مثل !@#$%)");
  }

  if (password.length < 10) {
    suggestions.push("زيادة طول كلمة المرور إلى 10 أحرف أو أكثر");
  }

  let warning = null;
  if (score < 3) {
    warning = "كلمة المرور ضعيفة";
  }

  return {
    isValid: finalScore >= 2, // Consider valid if at least weak
    score: finalScore,
    feedback: {
      warning,
      suggestions
    }
  };
}

/**
 * Get text representation of password strength
 * @param score Password strength score
 * @returns Localized text representation
 */
export function getPasswordStrengthText(score: PasswordStrengthLevel): string {
  switch (score) {
    case 0: return "";
    case 1: return "ضعيفة جدًا";
    case 2: return "ضعيفة";
    case 3: return "متوسطة";
    case 4: return "قوية";
    case 5: return "قوية جدًا";
    default: return "";
  }
}

/**
 * Get CSS class for password strength indicator
 * @param score Password strength score
 * @returns CSS class name
 */
export function getPasswordStrengthClass(score: PasswordStrengthLevel): string {
  switch (score) {
    case 0: return "bg-gray-200 dark:bg-gray-700";
    case 1: return "bg-red-500";
    case 2: return "bg-orange-500";
    case 3: return "bg-yellow-500";
    case 4: return "bg-green-500";
    case 5: return "bg-green-500";
    default: return "bg-gray-200 dark:bg-gray-700";
  }
}

/**
 * Get the appropriate color class for the password strength text
 * @param score Password strength score
 * @returns CSS class for text color
 */
export function getPasswordStrengthTextClass(score: PasswordStrengthLevel): string {
  switch (score) {
    case 0: return "text-gray-500 dark:text-gray-400";
    case 1: return "text-red-600 dark:text-red-400";
    case 2: return "text-orange-600 dark:text-orange-400";
    case 3: return "text-yellow-600 dark:text-yellow-400";
    case 4: return "text-green-600 dark:text-green-400";
    case 5: return "text-green-600 dark:text-green-400";
    default: return "text-gray-500 dark:text-gray-400";
  }
}
