import NextAuth from "next-auth";
import { authOptions } from "@/features/auth/services/auth-options";

// Create NextAuth handler
const handler = NextAuth(authOptions);

// Export all the required HTTP methods
export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH, handler as HEAD, handler as OPTIONS };