"use client";

import { performLogout } from "@/lib/auth/session";
import { LogOut } from "lucide-react";

export function LogoutButton({ className }: { className?: string }) {
  function handleLogout() {
    performLogout("/");
  }

  return (
    <button type="button" onClick={handleLogout} className={className}>
      <LogOut size={16} /> Log out
    </button>
  );
}
