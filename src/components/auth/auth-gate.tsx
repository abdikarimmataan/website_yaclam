"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { AuthRole } from "@/lib/api/auth.types";
import {
  AUTH_SESSION_EVENT,
  readSession,
  redirectPathForRole,
} from "@/lib/auth/session";

type Props = {
  children: ReactNode;
  role: AuthRole;
};

/** Client guard for protected areas — blocks bfcache Back after logout. */
export function AuthGate({ children, role }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    function guard() {
      const session = readSession();
      if (!session?.accessToken) {
        const next = encodeURIComponent(pathname || "/");
        window.location.replace(`/login?next=${next}`);
        return;
      }
      if (session.role !== role) {
        window.location.replace(redirectPathForRole(session.role));
      }
    }

    guard();

    window.addEventListener(AUTH_SESSION_EVENT, guard);
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) guard();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, guard);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [pathname, role]);

  return children;
}
