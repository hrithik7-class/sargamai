import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Decode JWT payload without verification (to read exp). Returns null if invalid. */
function getJwtExp(accessToken: string): number | null {
  try {
    const parts = accessToken.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(base64));
    return typeof json.exp === "number" ? json.exp : null;
  } catch {
    return null;
  }
}

/** Check if access token is expired or will expire within 60 seconds. */
function isAccessTokenExpired(accessToken: string): boolean {
  const exp = getJwtExp(accessToken);
  if (!exp) return true;
  return exp <= Math.floor(Date.now() / 1000) + 60;
}

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
        mode: { label: "Mode", type: "text" }, // "signin" | "signup" | "verify" | "verify_tokens"
        otp: { label: "OTP", type: "text" },
        access_token: { label: "Access Token", type: "text" },
        refresh_token: { label: "Refresh Token", type: "text" },
        user_data: { label: "User Data", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const mode = credentials.mode ?? "signin";

        // verify_tokens: frontend already verified via direct API call; use passed tokens
        if (mode === "verify_tokens" && credentials.access_token && credentials.user_data) {
          try {
            const user = JSON.parse(credentials.user_data as string);
            return {
              id: String(user.id),
              email: user.email,
              name: user.full_name,
              accessToken: credentials.access_token as string,
              refreshToken: (credentials.refresh_token as string) ?? "",
              isVerified: user.is_verified ?? true,
            } as NextAuthUser & { accessToken: string; refreshToken: string; isVerified: boolean };
          } catch {
            return null;
          }
        }

        // Verify-email flow: call verify-email endpoint with email + OTP (legacy, via NextAuth server)
        if (mode === "verify") {
          const otpDigits = credentials.otp?.replace(/\D/g, "") ?? "";
          if (otpDigits.length !== 6 || !credentials.email) return null;
          const res = await fetch(`${API_URL}/api/auth/verify-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email?.trim(), otp: otpDigits }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail ?? "Invalid or expired OTP");
          }
          const data = await res.json();
          return {
            id: String(data.user.id),
            email: data.user.email,
            name: data.user.full_name,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            isVerified: data.user.is_verified,
          } as NextAuthUser & { accessToken: string; refreshToken: string; isVerified: boolean };
        }

        // Signin / Signup flow
        if (!credentials?.password) return null;

        const isSignup = mode === "signup";
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

        let res: Response;
        try {
          res = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        } catch (fetchErr) {
          const msg = fetchErr instanceof Error ? fetchErr.message : "Network error";
          throw new Error(`Cannot reach the server. Is the backend running at ${API_URL}? ${msg}`);
        }

        // Signup returned 202 — verification required
        if (res.status === 202) {
          const data = await res.json().catch(() => ({}));
          const email = typeof data.email === "string" ? data.email : data.detail?.email ?? credentials.email;
          throw new Error(`VERIFICATION_REQUIRED:${email}`);
        }

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          let detail = "Authentication failed";
          if (typeof error.detail === "string") {
            detail = error.detail;
          } else if (Array.isArray(error.detail) && error.detail[0]?.msg) {
            detail = error.detail.map((e: { msg?: string }) => e.msg).filter(Boolean).join("; ") || detail;
          } else if (error.detail?.msg) {
            detail = error.detail.msg;
          } else if (error.message) {
            detail = error.message;
          }
          throw new Error(detail);
        }

        const data = await res.json();
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
  ],

  // ─── Callbacks ──────────────────────────────────────────────────────────────
  callbacks: {
    /**
     * signIn callback — runs after a successful OAuth provider sign-in.
     * For Google we exchange the provider's access token with our FastAPI
     * backend to create/find the user and get our own JWT.
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

      return true;
    },

    /**
     * jwt callback — persists accessToken/refreshToken inside the encrypted
     * NextAuth JWT cookie. Refreshes access token when expired.
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
        return token;
      }

      // Refresh access token when expired (backend tokens expire in ~30 min)
      const accessToken = token.accessToken as string | undefined;
      const refreshToken = token.refreshToken as string | undefined;
      if (accessToken && refreshToken && isAccessTokenExpired(accessToken)) {
        try {
          const res = await fetch(
            `${API_URL}/api/auth/refresh?refresh_token=${encodeURIComponent(refreshToken)}`,
            { method: "POST" },
          );
          if (res.ok) {
            const data = await res.json();
            token.accessToken = data.access_token;
            token.refreshToken = data.refresh_token ?? refreshToken;
          }
        } catch {
          // Keep existing tokens; next API call may get 401 and user can re-sign-in
        }
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
