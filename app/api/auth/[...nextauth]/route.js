// auth.ts (yoki route handler)
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Custom Google",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        const res = await fetch(
          "https://mlm-backend.pixl.uz/authorization/user",
          {
            headers: {
              Authorization: `Bearer ${credentials.token}`,
            },
          }
        );

        if (!res.ok) return null;

        const user = await res.json();
        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/", // Login sahifasi
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});
