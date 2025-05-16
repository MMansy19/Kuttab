"use client"

export const dynamic = 'force-dynamic';

import { AuthCard } from "@/features/auth/components/AuthCard";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Suspense, useState } from "react";
import { useAuth } from "@/features/auth";

function LoginContentWrapper({ onParamsLoaded }: { onParamsLoaded: (params: any) => void }) {
  const searchParams = useSearchParams();

  // Get all needed params at once
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  const success = searchParams?.get("success");
  const email = searchParams?.get("email");
  const error = searchParams?.get("error");

  // Call the callback once with all params
  useState(() => {
    onParamsLoaded({
      callbackUrl,
      success: success ? decodeURIComponent(success) : undefined,
      email: email || undefined,
      error: error ? decodeURIComponent(error) : null
    });
  });

  return null;
}

export default function LoginPage() {
  const { status } = useAuth();
  const [params, setParams] = useState({
    callbackUrl: "/dashboard",
    error: null as string | null,
    success: undefined as string | undefined,
    email: undefined as string | undefined
  });

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
      error={params.error}
      success={params.success}
    >
      <Suspense fallback={null}>
        <LoginContentWrapper
          onParamsLoaded={(loadedParams) => setParams(loadedParams)}
        />
      </Suspense>
      <LoginForm
        callbackUrl={params.callbackUrl}
      />
    </AuthCard>
  );
}