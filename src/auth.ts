import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// Dev-only credentials provider for local testing
const devProvider = Credentials({
  id: "dev-login",
  name: "Dev Login",
  credentials: {
    email: { label: "Email", type: "email" },
  },
  async authorize(credentials) {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
      return null;
    }
    if (credentials?.email) {
      return {
        id: "dev-user-1",
        name: "Dev User",
        email: credentials.email as string,
      };
    }
    return null;
  },
});

const providers = [
  GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
  }),
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }),
];

// Add dev provider only in development
if (process.env.NODE_ENV === "development") {
  providers.push(devProvider);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname === "/login";

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      return isLoggedIn;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
