import type { AuthRole, AuthSession } from "@/lib/api/auth.types";

const STORAGE_KEY = "yaclam_session";
const AUTH_COOKIE = "yaclam_auth";
const ROLE_COOKIE = "yaclam_role";
const MAX_AGE = 60 * 60 * 24 * 7;

function cookieString(name: string, value: string, maxAge = MAX_AGE) {
  return `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function saveSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  document.cookie = cookieString(AUTH_COOKIE, "1");
  document.cookie = cookieString(ROLE_COOKIE, session.role);
}

export function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function redirectPathForRole(role: AuthRole) {
  return role === "instructor" ? "/instructor" : "/dashboard";
}

export function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
}
