import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db"; // adjust to your project structure
import { PrismaAdapter } from "@auth/prisma-adapter"

type UserRole = "ADMIN" | "CREATOR" | "VIEWER";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
      adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
authorize: async (credentials) => {
  const email = credentials?.email as string
  const password = credentials?.password as string
    if (!email || !password) return null;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) return null;

  const isValid = await compare(password, user.password);
  if (!isValid) return null;

  // Return only id, name, email — cast to User to suppress TS error
  return {
    id: user.id,
    name: user.name,
    email: user.email,// eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any; // ← OR use: as User
}

    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // This block runs on initial sign-in.
        // The `user` object here contains the `id`, `name`, `email`, and `role`
        // that you returned from the `authorize` callback (for Credentials)
        // or from the OAuth provider (for Google).

        token.id = user.id; // <--- !!! CRITICAL FIX: Add user.id to the JWT token !!!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
token.role = (user as any).role; // Add role from the initial 'user' object
                                       // (assuming your User type or `authorize` returns it)
      } else if (token.email) {
        // This block runs on subsequent requests when only the token is available
        // (i.e., not an initial sign-in, but a session refresh/check).
        // Fetch the user from the DB to ensure role/id is up-to-date.
        // It's good practice to make sure 'id' is here too.
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true }, // Only fetch necessary fields
        });
        if (dbUser) {
          token.id = dbUser.id; // <--- !!! CRITICAL FIX: Ensure ID is updated if token refreshed !!!
          token.role = dbUser.role ?? "VIEWER";
        }
      }
      return token;
    },

async session({ session, token }) {
  if (session.user && token) {
    session.user.role = token.role as UserRole;
    session.user.id = token.id as string;  // <--- add this line to expose user id in session
  }
  return session;
}

  },
  pages: {
    signIn: "/profile", // Adjust based on your app
  },  
  secret: process.env.NEXTAUTH_SECRET,

});
