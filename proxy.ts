import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Require auth for protected routes
  if (path.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Role-based protection
  if (path.startsWith("/dashboard/seeker") && token?.role !== "JOB_SEEKER") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (path.startsWith("/dashboard/employer") && token?.role !== "EMPLOYER") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (path.startsWith("/dashboard/admin") && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
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
