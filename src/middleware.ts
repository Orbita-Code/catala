import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const USER = process.env.BASIC_AUTH_USER || "catala";
const PASS = process.env.BASIC_AUTH_PASS || "catala2025";
const AUTH_COOKIE = "catala_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function middleware(request: NextRequest) {
  // Skip auth in development
  if (process.env.NODE_ENV === "development") return NextResponse.next();

  // Check cookie first (PWA home screen doesn't support Basic Auth dialogs)
  const authCookie = request.cookies.get(AUTH_COOKIE);
  if (authCookie?.value === "1") {
    return NextResponse.next();
  }

  // Check Basic Auth header
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(":");
      if (user === USER && pass === PASS) {
        // Set cookie so PWA standalone mode works without re-auth
        const response = NextResponse.next();
        response.cookies.set(AUTH_COOKIE, "1", {
          maxAge: COOKIE_MAX_AGE,
          path: "/",
          sameSite: "lax",
        });
        return response;
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Català"',
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/|covers/|illustrations/|levels/|.*\\.png$|.*\\.webp$).*)"],
};
