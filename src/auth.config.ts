import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const enPanel =
        nextUrl.pathname.startsWith("/admin") && nextUrl.pathname !== "/admin/login";
      if (enPanel) return isLoggedIn;
      return true;
    },
  },
} satisfies NextAuthConfig;
