"use client"

// Force dynamic rendering for authentication pages
export const dynamic = 'force-dynamic';

import { AuthCard } from "@/features/auth/components/AuthCard";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/features/auth";

interface LoginContentWrapperProps {
  onGetParams: (error: string | null, success: string | undefined, callbackUrl: string) => void;
}

// Component that uses useSearchParams
function LoginContentWrapper({ onGetParams }: LoginContentWrapperProps) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  const success = searchParams?.get("success");
  const [urlError, setUrlError] = useState<string | null>(null);
  
  // Safe access to session data
  const { status } = useAuth();
  
  useEffect(() => {
    // Get error message from URL if it exists
    const errorParam = searchParams?.get("error");
    if (errorParam) {
      setUrlError(decodeURIComponent(errorParam));
    }
    
    // Pass parameters up to parent
    onGetParams(
      urlError, 
      success ? decodeURIComponent(success) : undefined, 
      callbackUrl
    );
  }, [searchParams, urlError, success, callbackUrl, onGetParams]);

  // Show minimal loading state until hydration completes
  if (status === 'loading') {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return null;
}

// Loading fallback component
function LoginPageLoading() {
  return <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>;
}

export default function LoginPage() {
  const [params, setParams] = useState({
    error: null as string | null,
    success: undefined as string | undefined,
    callbackUrl: "/dashboard"
  });

  const handleParams = (error: string | null, success: string | undefined, callbackUrl: string) => {
    setParams({ error, success, callbackUrl });
  };

  return (
    <AuthCard 
      title="مرحبًا بعودتك"
      error={params.error}
      success={params.success}
    >
      <Suspense fallback={<LoginPageLoading />}>
        <LoginContentWrapper onGetParams={handleParams} />
      </Suspense>
      <LoginForm callbackUrl={params.callbackUrl} />
    </AuthCard>
  );
}