"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { AuthArt } from "@/components/shared/auth-art";
import { PasswordInput } from "@/components/shared/password-input";
import { registerStudent } from "@/lib/api/auth.service";
import { REGISTER_FIELDS, validateRegisterForm } from "@/lib/auth/register.validation";
import { applyFormValidationFeedback } from "@/lib/utils/form-validation";
import { toast } from "@/lib/utils/toast";

export default function RegisterPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const errors = validateRegisterForm({ fullname, email, password });
    if (applyFormValidationFeedback(errors, [...REGISTER_FIELDS])) return;

    setLoading(true);
    try {
      const message = await registerStudent({ fullname, email, password });
      toast.success(message);
      setTimeout(() => router.replace("/login"), 1200);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <AuthArt login={false} />
      <div className="mx-auto flex w-full max-w-md flex-col justify-center p-10 sm:p-16">
        <h1 className="mb-2 text-3xl font-semibold text-navy">Create your account</h1>
        <p className="mb-7 text-ink-3">Free to start — no card required.</p>

        <form onSubmit={onSubmit} className="flex flex-col">
          <div className="mb-4">
            <label className="field-label" htmlFor="fullname">
              Full name
            </label>
            <input
              id="fullname"
              autoComplete="name"
              className="field-input"
              placeholder="Magacaaga oo dhameystiran"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
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
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-1.5 text-[12px] text-ink-3">
              Use uppercase, lowercase, a number, and a special character.
            </p>
          </div>

          <button type="submit" disabled={loading} className="btn btn-navy mt-2 w-full disabled:opacity-60">
            {loading ? <Loader2 size={17} className="animate-spin" /> : null}
            Create account <ArrowRight size={17} />
          </button>
        </form>

        <p className="mt-5 text-center text-[14.5px] text-ink-3">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-royal">
            Log in
          </Link>
        </p>
        <p className="mt-6 text-center text-[12px] leading-relaxed text-ink-3">
          Authentication wires to NextAuth · payments via WaafiPay, PayPal &amp; Stripe.
        </p>
      </div>
    </div>
  );
}
