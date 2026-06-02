import { CircleCheck } from "lucide-react";

export function AuthArt({ login }: { login: boolean }) {
  return (
    <div className="hero-bg relative hidden flex-col justify-center overflow-hidden p-16 text-white lg:flex">
      <p className="ar mb-6 text-right text-[30px] text-gold">يعلم</p>
      <h2 className="mb-4 text-4xl font-semibold">{login ? "Welcome back." : "Begin your journey."}</h2>
      <p className="text-[16px] text-white/75">
        {login
          ? "Continue learning where you left off and keep your streak alive."
          : "Join thousands of Somali learners building real, job-ready skills."}
      </p>
      <ul className="mt-8 flex flex-col gap-3.5">
        {["50+ expert-led courses", "Verified certificates", "200+ scholarships", "Learn in Somali, your way"].map((x) => (
          <li key={x} className="flex items-center gap-3 text-[15px]"><CircleCheck size={20} className="text-gold" /> {x}</li>
        ))}
      </ul>
    </div>
  );
}
