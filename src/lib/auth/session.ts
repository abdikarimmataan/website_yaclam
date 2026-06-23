import type { AuthRole, AuthSession } from "@/lib/api/auth.types";
import { isAccessTokenExpired } from "@/lib/auth/token-expiry";

const STORAGE_KEY = "yaclam_session";
const AUTH_COOKIE = "yaclam_auth";
const ROLE_COOKIE = "yaclam_role";
/** Match backend ACCESS_TOKEN_EXPIRES (3 minutes). */
const MAX_AGE = 60 * 3;

export const AUTH_SESSION_EVENT = "yaclam:auth-changed";

function cookieString(name: string, value: string, maxAge = MAX_AGE) {
  return `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function notifyAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function saveSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  document.cookie = cookieString(AUTH_COOKIE, "1");
  document.cookie = cookieString(ROLE_COOKIE, session.role);
  notifyAuthChange();
}

export function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.accessToken) return null;
    if (isAccessTokenExpired(parsed.accessToken)) {
      clearSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  notifyAuthChange();
}

/** Full logout: clear session and replace history so Back cannot return to protected pages. */
export function performLogout(redirectTo = "/") {
  clearSession();
  if (typeof window !== "undefined") {
    window.location.replace(redirectTo);
  }
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
