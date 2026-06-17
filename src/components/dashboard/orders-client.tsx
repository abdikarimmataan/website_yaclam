"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Receipt } from "lucide-react";
import { getMyTransactions, type TransactionRecord } from "@/lib/api/payment.service";

function resolveTitle(record: TransactionRecord): string {
  if (record.courseInfo?.title) return record.courseInfo.title;
  const raw = record.courseId;
  if (raw && typeof raw !== "string" && raw.title) return raw.title;
  return "Course";
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function OrdersClient() {
  const [orders, setOrders] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMyTransactions()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-ink-3">
        <Loader2 size={20} className="animate-spin" />
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white p-10 text-center">
        <p className="text-ink-3">No payment history yet.</p>
        <Link href="/courses" className="btn btn-gold btn-sm mt-4 inline-flex">
          Browse courses
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="hidden grid-cols-[1fr_1fr_1.6fr_1fr_1fr_0.8fr] gap-3 border-b border-line bg-surface px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-ink-3 md:grid">
        <span>Order</span>
        <span>Date</span>
        <span>Course</span>
        <span>Method</span>
        <span>Amount</span>
        <span>Status</span>
      </div>
      {orders.map((o) => (
        <div
          key={o.id}
          className="grid grid-cols-2 gap-3 border-b border-surface-2 px-5 py-4 text-[14px] last:border-b-0 md:grid-cols-[1fr_1fr_1.6fr_1fr_1fr_0.8fr] md:items-center"
        >
          <span className="flex items-center gap-2 font-semibold text-navy">
            <Receipt size={15} className="text-ink-3 md:hidden" />
            {o.transactionId}
          </span>
          <span className="text-ink-3">{formatDate(o.created_at || o.date)}</span>
          <span className="col-span-2 text-ink-2 md:col-span-1">{resolveTitle(o)}</span>
          <span className="text-ink-3">EVC Plus</span>
          <span className="font-bold text-navy">${Number(o.amount).toFixed(2)}</span>
          <span className="inline-flex w-fit rounded-md bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-bold text-[#047857]">
            Paid
          </span>
        </div>
      ))}
    </div>
  );
}
