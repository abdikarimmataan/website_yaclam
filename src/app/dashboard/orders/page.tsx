import { OrdersClient } from "@/components/dashboard/orders-client";

export const metadata = { title: "Orders" };

export default function Orders() {
  return (
    <div>
      <h1 className="mb-1 text-[28px] font-bold text-navy">Orders</h1>
      <p className="mb-7 text-ink-3">Your purchase history and receipts.</p>
      <OrdersClient />
    </div>
  );
}
