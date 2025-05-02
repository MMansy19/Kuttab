"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const ErrorContent = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorMessage = searchParams.get("error");
    setError(errorMessage);
  }, [searchParams]);

  const getErrorMessage = () => {
    switch (error) {
      case "Signin":
        return "Try signing in with a different account.";
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
      case "Callback":
        return "There was a problem with the sign-in attempt. Please try again.";
      case "OAuthAccountNotLinked":
        return "To confirm your identity, sign in with the same account you used originally.";
      case "CredentialsSignin":
        return "The email or password you entered is incorrect.";
      case "default":
        return "Unable to sign in. Please try again.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <div className="max-w-md w-full space-y-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Authentication Error
          </h2>
          <div className="mt-4 text-center text-red-600 dark:text-red-400">
            <p>{getErrorMessage()}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {error && `Error code: ${error}`}
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
};

const AuthError = () => {
  return (
      <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div><span className="sr-only">جاري التحميل...</span></div>}>
      <ErrorContent />
    </Suspense>
  );
};

export default AuthError;