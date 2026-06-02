"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuthArt } from "@/components/shared/auth-art";

export default function RegisterPage() {
  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <AuthArt login={false} />
      <div className="mx-auto flex w-full max-w-md flex-col justify-center p-10 sm:p-16">
        <h1 className="mb-2 text-3xl font-semibold text-navy">Create your account</h1>
        <p className="mb-7 text-ink-3">Free to start — no card required.</p>
        <div className="mb-4">
          <label className="field-label">Full name</label>
          <input className="field-input" placeholder="Magacaaga oo dhameystiran" />
        </div>
        <div className="mb-4">
          <label className="field-label">Email address</label>
          <input type="email" className="field-input" placeholder="you@example.com" />
        </div>
        <div className="mb-4">
          <label className="field-label">Password</label>
          <input type="password" className="field-input" placeholder="••••••••" />
        </div>
        <Link href="/dashboard" className="btn btn-navy mt-2 w-full">Create account <ArrowRight size={17} /></Link>
        <p className="mt-5 text-center text-[14.5px] text-ink-3">
          Already have an account? <Link href="/login" className="font-bold text-royal">Log in</Link>
        </p>
        <p className="mt-6 text-center text-[12px] leading-relaxed text-ink-3">Authentication wires to NextAuth · payments via WaafiPay, PayPal &amp; Stripe.</p>
      </div>
    </div>
  );
}
