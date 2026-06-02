import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="ar mb-4 text-5xl text-gold">يعلم</p>
      <h1 className="mb-3 text-5xl font-semibold text-navy">404</h1>
      <p className="mb-7 max-w-md text-ink-3">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="btn btn-navy"><Home size={17} /> Back home</Link>
    </div>
  );
}
