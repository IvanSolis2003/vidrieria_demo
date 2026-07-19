import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  return undefined;
});

export const config = {
  matcher: ["/admin/:path*"],
};
