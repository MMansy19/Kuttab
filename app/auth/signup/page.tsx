import React from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Sign Up | KOTTAB",
  description: "Create a new KOTTAB account",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">إنشاء حسابك</h1>
          <AuthForm type="signup" />
      </div>
    </div>
  );
}