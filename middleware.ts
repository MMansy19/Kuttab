import { type NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { getToken } from "next-auth/jwt";

// Define protected paths and which roles can access them
const protectedPaths = {
  "/dashboard/admin": ["ADMIN"],
  "/dashboard/teacher": ["TEACHER", "ADMIN"],
  "/dashboard/user": ["USER", "TEACHER", "ADMIN"],
  "/api/users": ["ADMIN"],
  "/api/teachers": ["ADMIN", "TEACHER", "USER"],
  "/api/bookings": ["ADMIN", "TEACHER", "USER"],
};

// Define automatic redirections based on user role
const roleRedirections = {
  ADMIN: "/dashboard/admin",
  TEACHER: "/dashboard/teacher",
  USER: "/dashboard/user",
};

// Define sensitive API paths that need additional protection
const sensitiveApiPaths = [
  "/api/users",
  "/api/teachers/approval",
  "/api/teachers/delete",
  "/api/admin",
];

// Define public paths that should be accessible without redirections when logged in
const publicPaths = [
  "/teachers",
  "/about",
  "/contact",
  "/donate",
];

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secureCookie: process.env.NODE_ENV === "production",
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Remove console.log in production
  if (process.env.NODE_ENV !== "production") {
    console.log("Middleware token check:", token ? "Token exists" : "No token", "Path:", req.nextUrl.pathname);
  }

  const { pathname, searchParams } = req.nextUrl;
  const callbackUrl = searchParams.get("callbackUrl");
  
  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  
  // Check if this is an API request
  const isApiRequest = pathname.startsWith("/api");
  
  // Additional protection for sensitive API endpoints
  if (isApiRequest && sensitiveApiPaths.some(path => pathname.startsWith(path))) {
    // For sensitive API routes, strictly enforce admin role
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح بالوصول" },
        { status: 403 }
      );
    }
  }
  
  // Handle authentication for protected routes
  const isProtectedPath = Object.keys(protectedPaths).some((path) =>
    pathname.startsWith(path)
  );

  // If trying to access a protected route without being logged in
  if (isProtectedPath && !token) {
    if (process.env.NODE_ENV !== "production") {
      console.log("Access to protected path without token, redirecting to login");
    }
    
    if (isApiRequest) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }
    
    const url = new URL("/auth/login", req.url);
    // Save the requested URL as callbackUrl to redirect after successful login
    url.searchParams.set("callbackUrl", encodeURIComponent(pathname));
    return NextResponse.redirect(url);
  }

  // If logged in and trying to access a protected route without proper role
  if (isProtectedPath && token) {
    const userRole = token.role as string;
    if (process.env.NODE_ENV !== "production") {
      console.log("User role:", userRole, "for protected path:", pathname);
    }
    
    const allowedRoles = Object.entries(protectedPaths).find(([path]) =>
      pathname.startsWith(path)
    )?.[1];

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      if (isApiRequest) {
        return NextResponse.json(
          { error: "غير مصرح بالوصول لهذه الخدمة" },
          { status: 403 }
        );
      }
      
      // Redirect to appropriate dashboard based on role
      const redirectUrl = new URL(roleRedirections[userRole as keyof typeof roleRedirections] || "/", req.url);
      // Add a notification param that can be picked up by the dashboard to show a toast
      redirectUrl.searchParams.set("notification", "unauthorized_access");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If trying to access auth pages while logged in
  if (token && (pathname === "/auth/login" || pathname === "/auth/signup")) {
    const userRole = token.role as string;
    
    if (process.env.NODE_ENV !== "production") {
      console.log("User already logged in, redirecting to dashboard for role:", userRole);
    }
    
    // If there's a valid callback URL, try to honor it if the user has permission
    if (callbackUrl) {
      // Fix double-encoding issue by ensuring proper decoding
      let decodedCallbackUrl;
      try {
        // Handle potential double-encoded URLs
        decodedCallbackUrl = decodeURIComponent(callbackUrl);
        if (decodedCallbackUrl.includes('%2F')) {
          decodedCallbackUrl = decodeURIComponent(decodedCallbackUrl);
        }
      } catch (e) {
        // If decoding fails, use as is
        decodedCallbackUrl = callbackUrl;
      }
      
      // Ensure the URL is properly formatted for redirection
      const callbackPath = decodedCallbackUrl.startsWith('/') 
        ? decodedCallbackUrl 
        : `/${decodedCallbackUrl}`;
      
      // Check if the callback URL is to a protected path
      const isCallbackProtected = Object.entries(protectedPaths).some(([path, roles]) => 
        callbackPath.startsWith(path) && roles.includes(userRole)
      );
      
      // If the callback path is protected and user has access, or it's a public path
      if (isCallbackProtected || publicPaths.some(path => callbackPath.startsWith(path))) {
        return NextResponse.redirect(new URL(callbackPath, req.url));
      }
    }
    
    // Default to role-based redirections
    return NextResponse.redirect(new URL(roleRedirections[userRole as keyof typeof roleRedirections] || "/", req.url));
  }

  // If accessing the root path while logged in
  if (token && pathname === "/") {
    const userRole = token.role as string;
    return NextResponse.redirect(new URL(roleRedirections[userRole as keyof typeof roleRedirections] || "/", req.url));
  }

  // If accessing the dashboard root, redirect to role-specific dashboard
  if (token && pathname === "/dashboard") {
    const userRole = token.role as string;
    return NextResponse.redirect(
      new URL(roleRedirections[userRole as keyof typeof roleRedirections] || "/", req.url)
    );
  }

  // Add the security headers to the response
  return response;
}

// Configure which routes should use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/dashboard/:path*",
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
    "/",
  ],
};