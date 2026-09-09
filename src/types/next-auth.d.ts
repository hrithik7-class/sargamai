import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    accessToken?: string;
    refreshToken?: string;
    isVerified?: boolean;
  }

  interface Session extends DefaultSession {
    accessToken?: string;
    user?: DefaultSession["user"] & {
      id?: string;
      isVerified?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
    isVerified?: boolean;
  }
}
