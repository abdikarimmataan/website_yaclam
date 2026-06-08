"use client";

import { useAuthSession } from "@/components/auth/use-auth-session";

export function InstructorTokenPanel() {
  const session = useAuthSession();

  return (
    <div className="space-y-2">
      <p className="text-xs text-ink-3">
        Instructor is assigned automatically from your login account.
      </p>
      <div className="flex items-center gap-3 rounded-xl border border-[#1f2a4a] bg-[#0b1126] p-3">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-sm font-bold text-navy">
          {session?.initials ?? "IN"}
        </span>
        <div>
          <p className="font-semibold text-navy">{session?.displayName ?? "Instructor"}</p>
          <p className="text-sm text-ink-3">{session?.email ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}
