import { Wallet, DollarSign, TrendingUp, Download } from "lucide-react";

const payouts = [
  { date: "01 May 2026", amount: "$640", method: "Bank transfer", status: "Paid" },
  { date: "01 Apr 2026", amount: "$580", method: "Bank transfer", status: "Paid" },
  { date: "01 Mar 2026", amount: "$720", method: "Bank transfer", status: "Paid" },
];
const bars = [40, 62, 55, 78, 70, 90];
const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];

export default function InstructorEarnings() {
  return (
    <div>
      <h1 className="mb-1 text-[28px] font-bold text-navy">Earnings</h1>
      <p className="mb-6 text-ink-3">Your revenue and payout history.</p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: DollarSign, v: "$8,940", l: "Lifetime earnings" },
          { icon: Wallet, v: "$640", l: "Available to withdraw" },
          { icon: TrendingUp, v: "$1,260", l: "This quarter" },
        ].map((k) => (
          <div key={k.l} className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 grid h-[42px] w-[42px] place-items-center rounded-xl bg-surface text-royal"><k.icon size={20} /></div>
            <div className="font-display text-[26px] font-semibold text-navy">{k.v}</div>
            <div className="text-[13px] text-ink-3">{k.l}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-2xl border border-line bg-white p-6">
        <h3 className="mb-5 font-sans text-[16px] font-bold text-navy">Revenue (last 6 months)</h3>
        <div className="flex items-end justify-between gap-3" style={{ height: 160 }}>
          {bars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-lg bg-gradient-to-t from-royal to-gold" style={{ height: `${h}%` }} />
              <span className="text-[12px] text-ink-3">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-sans text-[16px] font-bold text-navy">Payout history</h3>
        <button className="btn btn-outline btn-sm"><Download size={14} /> Statement</button>
      </div>
      <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-white">
        {payouts.map((p) => (
          <div key={p.date} className="flex items-center justify-between border-b border-surface-2 px-5 py-4 text-[14px] last:border-b-0">
            <span className="text-ink-2">{p.date}</span>
            <span className="text-ink-3">{p.method}</span>
            <span className="font-bold text-navy">{p.amount}</span>
            <span className="rounded-md bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-bold text-[#047857]">{p.status}</span>
          </div>
        ))}
      </div>
      <p className="mt-6 rounded-xl border border-line bg-white p-4 text-[13px] text-ink-3">Payout processing (WaafiPay/bank) and revenue splits wire to the backend.</p>
    </div>
  );
}
