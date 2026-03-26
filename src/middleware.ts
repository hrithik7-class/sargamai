import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect NextAuth error page to get-started so users see the error there
  if (pathname === "/api/auth/error") {
    const url = new URL("/get-started", request.url);
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    return NextResponse.redirect(url);
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // No session — redirect to get-started with callback
  if (!token) {
    const url = new URL("/get-started", request.url);
    url.searchParams.set("callbackUrl", pathname || "/dashboard");
    return NextResponse.redirect(url);
  }

  // Session exists but user is not verified — redirect to verify-email
  const isVerified = token.isVerified as boolean | undefined;
  if (isVerified === false) {
    const url = new URL("/verify-email", request.url);
    url.searchParams.set("email", (token.email as string) ?? "");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/error", "/dashboard", "/dashboard/:path*"],
};
