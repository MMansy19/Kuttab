# Authentication System Migration Implementation Plan

This document outlines the step-by-step implementation plan for migrating from the current authentication system to the new feature-based architecture.

## Migration Timeline

| Phase | Description | Estimated Time | Dependencies |
|-------|-------------|----------------|--------------|
| 1     | Deploy Auth Feature Code | 1 day | None |
| 2     | Update API Routes | 2 days | Phase 1 |
| 3     | Update Core Pages | 2 days | Phase 2 |
| 4     | Update Protected Routes | 3 days | Phase 3 |
| 5     | Testing & Bug Fixes | 3 days | Phase 4 |
| 6     | Final Cleanup | 1 day | Phase 5 |

## Detailed Implementation Steps

### Phase 1: Deploy Auth Feature Code

1. **Merge Feature Branch to Main**
   - Merge `/features/auth` directory to main branch
   - Ensure no breaking changes are introduced
   - Run existing tests to validate

2. **Update Package Dependencies**
   - Ensure all required packages are in package.json
   - Run `npm install` to update dependencies

3. **Configure Environment Variables**
   - Verify all required environment variables are documented
   - Update `.env.example` if needed

### Phase 2: Update API Routes

1. **Create Auth Options File**
   ```typescript
   // features/auth/services/auth-options.ts
   import { NextAuthOptions } from "next-auth";
   import { authOptions as oldAuthOptions } from "@/lib/auth";
   
   // Export existing options initially to minimize risk
   export const authOptions: NextAuthOptions = oldAuthOptions;
   ```

2. **Update NextAuth API Route**
   ```typescript
   // app/api/auth/[...nextauth]/route.ts
   import NextAuth from "next-auth";
   import { authOptions } from "@/features/auth/services/auth-options";

   const handler = NextAuth(authOptions);

   export { handler as GET, handler as POST };
   ```

3. **Implement Register API Route**
   ```typescript
   // app/api/auth/register/route.ts
   import { NextResponse } from "next/server";
   import bcrypt from "bcryptjs";
   import { RegisterData } from "@/features/auth/types";
   
   export async function POST(req: Request) {
     try {
       const body: RegisterData = await req.json();
       
       // Validate input
       if (!body.email || !body.password || !body.name) {
         return NextResponse.json(
           { error: "Missing required fields" }, 
           { status: 400 }
         );
       }
       
       // Check if email exists
       // In development mode with mock users, let everything through
       
       // Hash password
       const hashedPassword = await bcrypt.hash(body.password, 12);
       
       // Store in database (mock for now, modify for real DB)
       
       return NextResponse.json(
         { success: true }, 
         { status: 201 }
       );
     } catch (error) {
       return NextResponse.json(
         { error: "Registration failed" }, 
         { status: 500 }
       );
     }
   }
   ```

4. **Create User Profile API Route**
   ```typescript
   // app/api/users/me/route.ts
   import { getServerSession } from "next-auth";
   import { NextResponse } from "next/server";
   import { authOptions } from "@/features/auth/services/auth-options";

   export async function GET() {
     const session = await getServerSession(authOptions);
     
     if (!session?.user) {
       return NextResponse.json(
         { error: "Unauthorized" }, 
         { status: 401 }
       );
     }
     
     return NextResponse.json({ user: session.user });
   }
   ```

5. **Create Password API Route**
   ```typescript
   // app/api/users/password/route.ts
   import { getServerSession } from "next-auth";
   import { NextResponse } from "next/server";
   import bcrypt from "bcryptjs";
   import { authOptions } from "@/features/auth/services/auth-options";

   export async function PUT(req: Request) {
     const session = await getServerSession(authOptions);
     
     if (!session?.user) {
       return NextResponse.json(
         { error: "Unauthorized" }, 
         { status: 401 }
       );
     }
     
     const { currentPassword, newPassword } = await req.json();
     
     if (!currentPassword || !newPassword) {
       return NextResponse.json(
         { error: "Missing required fields" }, 
         { status: 400 }
       );
     }
     
     // In a real implementation, validate current password against DB
     // For now with mock users, we'll skip actual validation
     
     return NextResponse.json({ success: true });
   }
   ```

### Phase 3: Update Core Pages

1. **Update Login Page**
   ```typescript
   // app/auth/login/page.tsx
   "use client";

   import { AuthCard, LoginForm } from "@/features/auth";
   import { useSearchParams } from "next/navigation";
   import { useState, useEffect } from "react";

   export default function LoginPage() {
     const searchParams = useSearchParams();
     const [urlError, setUrlError] = useState(null);
     const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
     
     useEffect(() => {
       const errorParam = searchParams?.get("error");
       if (errorParam) {
         setUrlError(decodeURIComponent(errorParam));
       }
     }, [searchParams]);

     return (
       <AuthCard title="مرحبًا بعودتك" error={urlError}>
         <LoginForm callbackUrl={callbackUrl} />
       </AuthCard>
     );
   }
   ```

2. **Update Signup Page**
   ```typescript
   // app/auth/signup/page.tsx
   "use client";

   import { AuthCard, RegisterForm } from "@/features/auth";
   import { useSearchParams } from "next/navigation";
   import { useState, useEffect } from "react";

   export default function SignupPage() {
     const searchParams = useSearchParams();
     const [urlError, setUrlError] = useState(null);
     const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
     
     useEffect(() => {
       const errorParam = searchParams?.get("error");
       if (errorParam) {
         setUrlError(decodeURIComponent(errorParam));
       }
     }, [searchParams]);

     return (
       <AuthCard title="إنشاء حساب جديد" error={urlError}>
         <RegisterForm callbackUrl={callbackUrl} />
       </AuthCard>
     );
   }
   ```

3. **Update Error Page**
   ```typescript
   // app/auth/error/page.tsx
   "use client";

   import { useEffect, useState } from "react";
   import { useSearchParams } from "next/navigation";
   import Link from "next/link";
   import { AuthCard } from "@/features/auth";

   export default function AuthErrorPage() {
     const searchParams = useSearchParams();
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
       const errorMessage = searchParams?.get("error") || null;
       setError(errorMessage);
     }, [searchParams]);

     const getErrorMessage = () => {
       // Error message mapping from the example file
       switch (error) {
         case "Signin":
           return "حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى بحساب آخر.";
         // Add other cases from the example
         default:
           return "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.";
       }
     };

     const errorTitle = error ? `خطأ: ${error}` : "خطأ في المصادقة";

     return (
       <AuthCard title={errorTitle} error={getErrorMessage()}>
         <div className="flex justify-center mt-6 space-x-4 rtl:space-x-reverse">
           <Link
             href="/auth/login"
             className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-colors"
           >
             تسجيل الدخول
           </Link>
           <Link
             href="/"
             className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md transition-colors"
           >
             العودة للرئيسية
           </Link>
         </div>
       </AuthCard>
     );
   }
   ```

4. **Update Root Layout**
   ```typescript
   // app/layout.tsx
   import { AuthProvider, AuthSyncProvider } from "@/features/auth";

   export default function RootLayout({ children }) {
     return (
       <html lang="ar" dir="rtl">
         <body>
           <AuthProvider>
             <AuthSyncProvider>
               {children}
             </AuthSyncProvider>
           </AuthProvider>
         </body>
       </html>
     );
   }
   ```

### Phase 4: Update Protected Routes

1. **Create Protected Layout Wrapper**
   ```typescript
   // components/layout/ProtectedLayout.tsx
   "use client";

   import { ReactNode } from "react";
   import { ProtectedRoute } from "@/features/auth";

   export default function ProtectedLayout({ 
     children, 
     allowedRoles = undefined 
   }: { 
     children: ReactNode, 
     allowedRoles?: string[] 
   }) {
     return (
       <ProtectedRoute roles={allowedRoles}>
         {children}
       </ProtectedRoute>
     );
   }
   ```

2. **Update Dashboard Pages**
   ```typescript
   // app/dashboard/layout.tsx
   import ProtectedLayout from "@/components/layout/ProtectedLayout";

   export default function DashboardLayout({ children }) {
     return (
       <ProtectedLayout>
         <main className="dashboard-container">
           {children}
         </main>
       </ProtectedLayout>
     );
   }
   ```

3. **Update Admin Pages**
   ```typescript
   // app/dashboard/admin/layout.tsx
   import ProtectedLayout from "@/components/layout/ProtectedLayout";

   export default function AdminLayout({ children }) {
     return (
       <ProtectedLayout allowedRoles={["ADMIN"]}>
         <main className="admin-container">
           {children}
         </main>
       </ProtectedLayout>
     );
   }
   ```

4. **Update Teacher Pages**
   ```typescript
   // app/dashboard/teacher/layout.tsx
   import ProtectedLayout from "@/components/layout/ProtectedLayout";

   export default function TeacherLayout({ children }) {
     return (
       <ProtectedLayout allowedRoles={["TEACHER", "ADMIN"]}>
         <main className="teacher-container">
           {children}
         </main>
       </ProtectedLayout>
     );
   }
   ```

5. **Update Navigation Components**
   ```typescript
   // components/layout/Navigation.tsx
   import { UserMenu } from "@/features/auth";
   
   export default function Navigation() {
     return (
       <nav className="main-nav">
         {/* Other navigation items */}
         <UserMenu />
       </nav>
     );
   }
   ```

### Phase 5: Testing & Bug Fixes

1. **Create Test Matrix**
   - Login functionality with valid/invalid credentials
   - Registration with valid/invalid data
   - Protected route access with different roles
   - Password reset functionality
   - Cross-tab synchronization

2. **Test Authentication Flows**
   - Follow each authentication flow from start to finish
   - Ensure proper redirects and error handling

3. **Test Edge Cases**
   - Session expiration behavior
   - Network disconnection during authentication
   - Multiple tabs with different authentication states

4. **Fix Identified Issues**
   - Document and fix any bugs found during testing
   - Update documentation as needed

### Phase 6: Final Cleanup

1. **Mark Old Files as Deprecated**
   ```typescript
   // lib/auth.ts
   /**
    * @deprecated Use @/features/auth/services/auth-options.ts instead
    */
   ```

2. **Update Import References**
   - Search for all imports from old auth files
   - Replace with imports from the new feature module

3. **Remove Duplicated Code**
   - Identify and remove any redundant auth code
   - Ensure all auth functionality uses the new system

4. **Documentation Update**
   - Update README with new auth system information
   - Document any breaking changes

## Verification Checklist

Before considering the migration complete, verify:

- [ ] All authentication flows work (login, register, logout)
- [ ] Protected routes correctly restrict access
- [ ] Role-based permissions function correctly
- [ ] Password validation and strength indicators work
- [ ] Error handling shows appropriate messages
- [ ] Cross-tab synchronization functions correctly
- [ ] All tests pass with the new implementation
