import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Lop 1: chan o edge truoc khi render.
export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    if (req.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: { authorized: ({ token }) => !!token },
    pages: { signIn: "/login" },
  },
);

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"] };
