import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const authOptions: NextAuthOptions = {
  // ─── Providers ──────────────────────────────────────────────────────────────
  providers: [
    // Email + Password (calls our FastAPI backend directly)
    CredentialsProvider({
      id: "credentials",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        full_name: { label: "Full Name", type: "text" },
        mode: { label: "Mode", type: "text" }, // "signin" | "signup"
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const isSignup = credentials.mode === "signup";
        const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/signin";

        const body = isSignup
          ? {
              email: credentials.email,
              password: credentials.password,
              full_name: credentials.full_name ?? "",
            }
          : {
              email: credentials.email,
              password: credentials.password,
            };

        const res = await fetch(`${API_URL}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          // Throwing an error propagates the message to the sign-in page
          throw new Error(error.detail ?? "Authentication failed");
        }

        const data = await res.json();
        // data shape: { access_token, refresh_token, token_type, user }
        return {
          id: String(data.user.id),
          email: data.user.email,
          name: data.user.full_name,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          isVerified: data.user.is_verified,
        } as NextAuthUser & { accessToken: string; refreshToken: string; isVerified: boolean };
      },
    }),

    // Google OAuth — NextAuth handles the redirect/consent screen.
    // After Google returns the code, the `signIn` callback below exchanges it
    // with our FastAPI backend for our own JWT.
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          scope: "openid email profile",
        },
      },
    }),

    // Facebook OAuth
    FacebookProvider({
      clientId: process.env.FACEBOOK_APP_ID ?? "",
      clientSecret: process.env.FACEBOOK_APP_SECRET ?? "",
    }),
  ],

  // ─── Callbacks ──────────────────────────────────────────────────────────────
  callbacks: {
    /**
     * signIn callback — runs after a successful OAuth provider sign-in.
     * For Google/Facebook we exchange the provider's access token with our
     * FastAPI backend to create/find the user and get our own JWT.
     */
    async signIn({ user, account }) {
      if (!account) return true;

      if (account.provider === "google") {
        try {
          const res = await fetch(
            `${API_URL}/api/auth/callback/google?code=${account.access_token}`,
          );
          if (!res.ok) return "/get-started?error=OAuthGoogleFailed";
          const data = await res.json();
          // Store our tokens on the user object so jwt callback can pick them up
          (user as any).accessToken = data.access_token;
          (user as any).refreshToken = data.refresh_token;
          (user as any).isVerified = data.user.is_verified;
          user.id = String(data.user.id);
          user.name = data.user.full_name;
          user.email = data.user.email;
        } catch {
          return "/get-started?error=OAuthGoogleFailed";
        }
      }

      if (account.provider === "facebook") {
        try {
          const res = await fetch(
            `${API_URL}/api/auth/callback/facebook?code=${account.access_token}`,
          );
          if (!res.ok) return "/get-started?error=OAuthFacebookFailed";
          const data = await res.json();
          (user as any).accessToken = data.access_token;
          (user as any).refreshToken = data.refresh_token;
          (user as any).isVerified = data.user.is_verified;
          user.id = String(data.user.id);
          user.name = data.user.full_name;
          user.email = data.user.email;
        } catch {
          return "/get-started?error=OAuthFacebookFailed";
        }
      }

      return true;
    },

    /**
     * jwt callback — persists accessToken/refreshToken inside the encrypted
     * NextAuth JWT cookie so we never expose them to the browser.
     */
    async jwt({ token, user }) {
      // On first sign-in, `user` is populated; on subsequent calls only `token` is.
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.isVerified = (user as any).isVerified ?? false;
      }
      return token;
    },

    /**
     * session callback — shapes what's exposed to the client via useSession().
     */
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.userId as string,
        email: token.email as string,
        name: token.name as string,
        isVerified: token.isVerified as boolean,
      } as any;
      (session as any).accessToken = token.accessToken as string;
      return session;
    },
  },

  // ─── Pages ──────────────────────────────────────────────────────────────────
  pages: {
    signIn: "/get-started",
    error: "/get-started",
  },

  // ─── Session strategy ───────────────────────────────────────────────────────
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days — matches backend refresh token expiry
  },

  // ─── Misc ───────────────────────────────────────────────────────────────────
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
