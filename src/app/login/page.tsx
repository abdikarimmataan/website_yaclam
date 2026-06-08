"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { AuthArt } from "@/components/shared/auth-art";
import { PasswordInput } from "@/components/shared/password-input";
import { login } from "@/lib/api/auth.service";
import type { AuthRole } from "@/lib/api/auth.types";
import { redirectPathForRole, saveSession } from "@/lib/auth/session";
import { toast } from "@/lib/utils/toast";
import { cn } from "@/lib/utils";

const roles: { id: AuthRole; label: string; hint: string; icon: typeof GraduationCap }[] = [
  { id: "student", label: "Student", hint: "Learn & track progress", icon: GraduationCap },
  { id: "instructor", label: "Instructor", hint: "Manage your courses", icon: BookOpen },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<AuthRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const session = await login(role, { email: email.trim(), password });
      saveSession(session);
      toast.success(`Welcome back, ${session.displayName}.`);
      router.replace(redirectPathForRole(session.role));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <AuthArt login />
      <div className="mx-auto flex w-full max-w-md flex-col justify-center p-10 sm:p-16">
        <h1 className="mb-2 text-3xl font-semibold text-navy">Log in</h1>
        <p className="mb-6 text-ink-3">Choose your account type, then sign in.</p>

        <div className="mb-6 grid grid-cols-2 gap-3">
          {roles.map((item) => {
            const selected = role === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id)}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition",
                  selected
                    ? "border-royal bg-royal/5 shadow-[0_0_0_1px_rgba(31,58,147,0.15)]"
                    : "border-line bg-white hover:border-royal/40"
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl",
                    selected ? "bg-navy text-gold" : "bg-surface-2 text-royal"
                  )}
                >
                  <item.icon size={18} />
                </span>
                <span className="text-[14px] font-bold text-navy">{item.label}</span>
                <span className="text-[12px] leading-snug text-ink-3">{item.hint}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={onSubmit} className="flex flex-col">
          <div className="mb-4">
            <label className="field-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="field-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-navy mt-2 w-full disabled:opacity-60">
            {loading ? <Loader2 size={17} className="animate-spin" /> : null}
            Log in as {role === "student" ? "Student" : "Instructor"} <ArrowRight size={17} />
          </button>
        </form>

        <p className="mt-5 text-center text-[14.5px] text-ink-3">
          New to Yaclam?{" "}
          <Link href="/register" className="font-bold text-royal">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
