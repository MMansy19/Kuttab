import React from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Login | KOTTAB",
  description: "Sign in to your KOTTAB account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">مرحبًا بعودتك</h1>
        <AuthForm type="login" />
      </div>
    </div>
  );
}
