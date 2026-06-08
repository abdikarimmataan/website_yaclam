"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearSession } from "@/lib/auth/session";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <button type="button" onClick={handleLogout} className={className}>
      <LogOut size={16} /> Log out
    </button>
  );
}
