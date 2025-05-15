import { type NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { getToken } from "next-auth/jwt";

// Define protected paths and required roles
const protectedPaths = {
  "/dashboard/admin": ["ADMIN"],
  "/dashboard/teacher": ["TEACHER", "ADMIN"],
  "/dashboard/user": ["USER", "TEACHER", "ADMIN"],
};

// Define role-based redirections
const roleRedirections = {
  ADMIN: "/dashboard/admin",
  TEACHER: "/dashboard/teacher",
  USER: "/dashboard/user",
};

// Define public paths
const publicPaths = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/error",
  "/teachers",
  "/about",
  "/contact",
];


// Only check for NEXTAUTH_SECRET in non-build environments
if (process.env.NODE_ENV !== 'production' && 
    !process.env.NEXT_PUBLIC_BUILD_MODE && 
    !process.env.NEXTAUTH_SECRET) {
  console.warn("Warning: NEXTAUTH_SECRET is not set in development environment");
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Security headers for all responses
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Skip middleware for public paths
  if (publicPaths.includes(pathname) || 
      pathname.startsWith("/_next") || 
      pathname.startsWith("/api/auth")) {
    return response;
  }

  // API route protection
  if (pathname.startsWith("/api")) {
    if (!token) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    // Admin-only API routes
    if (pathname.startsWith("/api/admin") && token.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح بالوصول" },
        { status: 403 }
      );
    }

    return response;
  }

  // Handle protected paths
  const protectedPathEntry = Object.entries(protectedPaths).find(([path]) => 
    pathname.startsWith(path)
  );

  if (protectedPathEntry) {
    const [path, allowedRoles] = protectedPathEntry;

    if (!token) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!allowedRoles.includes(token.role)) {
      const redirectUrl = roleRedirections[token.role as keyof typeof roleRedirections] || "/";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if (token && ["/auth/login", "/auth/signup"].includes(pathname)) {
    const redirectUrl = roleRedirections[token.role as keyof typeof roleRedirections] || "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/api/:path*",
  ],
};