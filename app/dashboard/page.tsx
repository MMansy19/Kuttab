import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/features/auth/services/auth-options";

// Force dynamic rendering for authentication pages
export const dynamic = 'force-dynamic';

// Dashboard router page that redirects users based on their role
export default async function DashboardPage() {
  // Get the session on the server side
  const session = await getServerSession(authOptions);
  
  if (process.env.NODE_ENV !== "production") {
    console.log("Dashboard page role check:", session?.user?.role);
  }
  
  // If no session, the layout will redirect to login (safety check)
  if (!session || !session.user) {
    redirect('/auth/login?callbackUrl=/dashboard');
  }
  
  // Redirect based on user role
  const userRole = session.user.role?.toUpperCase();
  
  switch(userRole) {
    case 'ADMIN':
      redirect('/dashboard/admin');
    case 'TEACHER':
      redirect('/dashboard/teacher');
    case 'USER':
      redirect('/dashboard/user');
    default:
      // Default to user dashboard if role is undefined or unknown
      console.warn(`Unknown user role: ${userRole}, defaulting to user dashboard`);
      redirect('/dashboard/user');
  }
  
}