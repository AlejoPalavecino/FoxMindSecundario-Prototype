import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_ACCESS, AUTH_COOKIE_ROLE } from "./lib/auth";
import { getDefaultPathByRole } from "./lib/role-navigation";

const PUBLIC_PATHS = new Set(["/login"]);

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (isStaticPath(path)) {
    return NextResponse.next();
  }
  const accessToken = request.cookies.get(AUTH_COOKIE_ACCESS)?.value;
  const role = request.cookies.get(AUTH_COOKIE_ROLE)?.value;
  if (PUBLIC_PATHS.has(path)) {
    return accessToken ? redirectByRole(request, role) : NextResponse.next();
  }
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (path.startsWith("/docente") && role !== "DOCENTE") {
    return redirectByRole(request, role);
  }
  if (path.startsWith("/alumno") && role !== "ALUMNO") {
    return redirectByRole(request, role);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

function redirectByRole(request: NextRequest, role?: string) {
  if (role === "DOCENTE") {
    return NextResponse.redirect(new URL(getDefaultPathByRole("DOCENTE"), request.url));
  }
  if (role === "ALUMNO") {
    return NextResponse.redirect(new URL(getDefaultPathByRole("ALUMNO"), request.url));
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

function isStaticPath(path: string) {
  return path.startsWith("/_next") || path.includes(".");
}
