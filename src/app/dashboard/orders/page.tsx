import { Receipt } from "lucide-react";

export const metadata = { title: "Orders" };

const orders = [
  { id: "YC-10428", date: "12 May 2026", item: "Power BI & Data Analytics Mastery", amount: "$49", method: "WaafiPay", status: "Paid" },
  { id: "YC-10391", date: "02 May 2026", item: "Forex & ICT Trading Foundations", amount: "$59", method: "PayPal", status: "Paid" },
  { id: "YC-10377", date: "21 Apr 2026", item: "Excel for Business & Analytics", amount: "$29", method: "EVC Plus", status: "Paid" },
  { id: "YC-10362", date: "08 Apr 2026", item: "UI/UX Design with Figma", amount: "$45", method: "Stripe", status: "Refunded" },
];

export default function Orders() {
  return (
    <div>
      <h1 className="mb-1 text-[28px] font-bold text-navy">Orders</h1>
      <p className="mb-7 text-ink-3">Your purchase history and receipts.</p>
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="hidden grid-cols-[1fr_1fr_1.6fr_1fr_1fr_0.8fr] gap-3 border-b border-line bg-surface px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-ink-3 md:grid">
          <span>Order</span><span>Date</span><span>Course</span><span>Method</span><span>Amount</span><span>Status</span>
        </div>
        {orders.map((o) => (
          <div key={o.id} className="grid grid-cols-2 gap-3 border-b border-surface-2 px-5 py-4 text-[14px] last:border-b-0 md:grid-cols-[1fr_1fr_1.6fr_1fr_1fr_0.8fr] md:items-center">
            <span className="flex items-center gap-2 font-semibold text-navy"><Receipt size={15} className="text-ink-3 md:hidden" />{o.id}</span>
            <span className="text-ink-3">{o.date}</span>
            <span className="col-span-2 text-ink-2 md:col-span-1">{o.item}</span>
            <span className="text-ink-3">{o.method}</span>
            <span className="font-bold text-navy">{o.amount}</span>
            <span className={`inline-flex w-fit rounded-md px-2 py-0.5 text-[11px] font-bold ${o.status === "Paid" ? "bg-[#ECFDF5] text-[#047857]" : "bg-[#FEF2F2] text-[#B91C1C]"}`}>{o.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
