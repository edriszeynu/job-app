import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function getDashboardPath(token: {
  role?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  email?: string | null;
}) {
  if (token.isAdmin || token.isSuperAdmin || token.email === "admin@jobhub.com") {
    return "/dashboard/admin";
  }

  return token.role === "EMPLOYER"
    ? "/dashboard/employer"
    : "/dashboard/seeker";
}

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Require auth for protected routes
  if (path.startsWith("/dashboard") && !token) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set(
      "callbackUrl",
      `${path}${req.nextUrl.search}`
    );
    return NextResponse.redirect(signInUrl);
  }

  if (token && (path === "/dashboard" || path === "/dashboard/")) {
    return NextResponse.redirect(new URL(getDashboardPath(token), req.url));
  }

  // Role-based protection
  if (path.startsWith("/dashboard/seeker") && token?.role !== "JOB_SEEKER") {
    return NextResponse.redirect(new URL(getDashboardPath(token!), req.url));
  }

  if (path.startsWith("/dashboard/employer") && token?.role !== "EMPLOYER") {
    return NextResponse.redirect(new URL(getDashboardPath(token!), req.url));
  }

  if (path.startsWith("/dashboard/admin") && !token?.isAdmin && !token?.isSuperAdmin && token?.email !== "admin@jobhub.com") {
    return NextResponse.redirect(new URL(getDashboardPath(token!), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/signin",
    "/auth/register",
    "/auth/error",
  ],
};
