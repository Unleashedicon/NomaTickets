// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "CREATOR" | "VIEWER";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "ADMIN" | "CREATOR" | "VIEWER";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "ADMIN" | "CREATOR" | "VIEWER";
  }
}
