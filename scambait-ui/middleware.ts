import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PASSWORD = process.env.UI_PASSWORD ?? "gerald";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip auth for login page and api routes
  if (pathname.startsWith("/login") || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("auth")?.value;
  if (cookie === PASSWORD) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
