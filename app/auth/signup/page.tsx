"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AuthCard, RegisterForm } from "@/features/auth";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [urlError, setUrlError] = useState<string | null>(null);
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  
  useEffect(() => {
    // Get error message from URL if it exists
    const errorParam = searchParams?.get("error");
    if (errorParam) {
      setUrlError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  return (
    <AuthCard 
      title="إنشاء حساب جديد" 
      error={urlError}
    >
      <RegisterForm callbackUrl={callbackUrl} />
    </AuthCard>
  );
}
