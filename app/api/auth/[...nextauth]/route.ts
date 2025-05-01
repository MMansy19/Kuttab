import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Create NextAuth handler
const handler = NextAuth(authOptions);

// Export only the required GET and POST handlers
export const GET = handler.GET;
export const POST = handler.POST;