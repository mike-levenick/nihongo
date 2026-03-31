import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const allowedUsers = (process.env.AUTH_ALLOWED_USERS || "")
  .split(",")
  .map((u) => u.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.login) return false;
      if (allowedUsers.length === 0) return true;
      return allowedUsers.includes((profile.login as string).toLowerCase());
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.username) {
        (session.user as unknown as Record<string, unknown>).username = token.username;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile?.login) {
        token.username = profile.login;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
});
