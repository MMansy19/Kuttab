"use client"

// Force dynamic rendering for authentication pages
export const dynamic = 'force-dynamic';


import { AuthCard } from "@/features/auth/components/AuthCard";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  const success = searchParams?.get("success");
  const [urlError, setUrlError] = useState<string | null>(null);
  
  // Safe access to session data
  const { session, status, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Get error message from URL if it exists
    const errorParam = searchParams?.get("error");
    if (errorParam) {
      setUrlError(decodeURIComponent(errorParam));
    }
    // Redirect authenticated users
  }, [searchParams, status, isAuthenticated]);
  // Show minimal loading state until hydration completes
  if (status === 'loading') {
    return (
      <AuthCard title="مرحبًا بعودتك">
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin" />
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="مرحبًا بعودتك"
      error={urlError}
      success={success ? decodeURIComponent(success) : undefined}
    >
      <LoginForm callbackUrl={callbackUrl} />
    </AuthCard>
  );
}