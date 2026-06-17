import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthed = request.cookies.get("yaclam_auth")?.value === "1";
  const role = request.cookies.get("yaclam_role")?.value;

  if (pathname === "/login" || pathname === "/register") {
    if (isAuthed && (role === "student" || role === "instructor")) {
      const dest = role === "instructor" ? "/instructor" : "/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthed) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/instructor") && role !== "instructor") {
    const dest = role === "student" ? "/dashboard" : "/login";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (pathname.startsWith("/dashboard") && role !== "student") {
    const dest = role === "instructor" ? "/instructor" : "/login";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return noStore(NextResponse.next());
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/instructor",
    "/instructor/:path*",
    "/login",
    "/register",
  ],
};
