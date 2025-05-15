import NextAuth from "next-auth";
import { authOptions } from "@/features/auth/services/auth-options";

// Create NextAuth handler
const handler = NextAuth(authOptions);

// Export the required HTTP methods
export { handler as GET, handler as POST };