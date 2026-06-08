"use client";

import { useEffect, useState } from "react";
import type { AuthSession } from "@/lib/api/auth.types";
import { readSession } from "@/lib/auth/session";

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(readSession());
  }, []);

  return session;
}
