"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { AuthSession } from "@/lib/api/auth.types";
import { AUTH_SESSION_EVENT, readSession } from "@/lib/auth/session";

export function useAuthSession() {
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function sync() {
      setSession(readSession());
      setReady(true);
    }

    sync();

    window.addEventListener(AUTH_SESSION_EVENT, sync);
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);

    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, [pathname]);

  return { session, ready, isLoggedIn: ready && Boolean(session?.accessToken) };
}
