"use client"

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard, RegisterForm } from "@/features/auth";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [urlError, setUrlError] = useState<string | null>(null);
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  
  // Safe access to session data
  const { session, status, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Get error message from URL if it exists
    const errorParam = searchParams?.get("error");
    if (errorParam) {
      setUrlError(decodeURIComponent(errorParam));
    }
    // Redirect authenticated users
    if (status === 'authenticated' && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [searchParams, status, isAuthenticated, router]);
  // Show minimal loading state until hydration completes
  if (status === 'loading') {
    return (
      <AuthCard title="إنشاء حساب جديد">
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin" />
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard 
      title="إنشاء حساب جديد" 
      error={urlError}
    >
      <RegisterForm callbackUrl={callbackUrl} />
    </AuthCard>
  );
}
