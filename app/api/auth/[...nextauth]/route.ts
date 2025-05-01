import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Create the handlers and export them directly
const handler = NextAuth(authOptions);
export const GET = handler.GET;
export const POST = handler.POST;