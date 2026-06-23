"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getJwtExpiresAtMs } from "@/lib/auth/token-expiry";
import { clearSession, performLogout, readSession } from "@/lib/auth/session";

function isProtectedPath(path: string) {
  return path === "/dashboard" || path.startsWith("/dashboard/") || path === "/instructor" || path.startsWith("/instructor/");
}

function redirectExpired(path: string) {
  if (path.startsWith("/login") || path.startsWith("/register")) {
    clearSession();
    return;
  }
  if (isProtectedPath(path)) {
    performLogout(`/login?next=${encodeURIComponent(path)}`);
    return;
  }
  clearSession();
}

export function TokenExpiryWatcher() {
  const pathname = usePathname();

  useEffect(() => {
    const session = readSession();
    if (!session?.accessToken) return;

    const expiresAt = getJwtExpiresAtMs(session.accessToken);
    if (!expiresAt) return;

    const msUntilExpiry = expiresAt - Date.now();
    if (msUntilExpiry <= 0) {
      redirectExpired(pathname);
      return;
    }

    const timer = setTimeout(() => {
      redirectExpired(window.location.pathname);
    }, msUntilExpiry);

    const onFocus = () => {
      if (!readSession() && isProtectedPath(window.location.pathname)) {
        window.location.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      }
    };

    window.addEventListener("focus", onFocus);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [pathname]);

  return null;
}
