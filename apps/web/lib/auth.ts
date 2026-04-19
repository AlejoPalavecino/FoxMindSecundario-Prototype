import type { AuthSession, LoginRequest, UserRole } from "@foxmind/shared";

export const AUTH_COOKIE_ACCESS = "foxmind_access_token";
export const AUTH_COOKIE_REFRESH = "foxmind_refresh_token";
export const AUTH_COOKIE_ROLE = "foxmind_role";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export async function login(request: LoginRequest): Promise<AuthSession> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });
  if (!response.ok) {
    throw new Error("No se pudo iniciar sesión");
  }
  return (await response.json()) as AuthSession;
}

export function saveSessionCookies(session: AuthSession) {
  writeCookie(AUTH_COOKIE_ACCESS, session.tokens.accessToken);
  writeCookie(AUTH_COOKIE_REFRESH, session.tokens.refreshToken);
  writeCookie(AUTH_COOKIE_ROLE, session.user.role);
}

export function clearSessionCookies() {
  writeCookie(AUTH_COOKIE_ACCESS, "", -1);
  writeCookie(AUTH_COOKIE_REFRESH, "", -1);
  writeCookie(AUTH_COOKIE_ROLE, "", -1);
}

export function roleHomePath(role: UserRole) {
  return role === "DOCENTE" ? "/docente" : "/alumno";
}

function writeCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`;
}
