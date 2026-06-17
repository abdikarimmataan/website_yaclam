import { WishlistClient } from "@/components/dashboard/wishlist-client";

export const metadata = { title: "Wishlist" };

export default function Wishlist() {
  return (
    <div>
      <h1 className="mb-1 text-[28px] font-bold text-navy">Wishlist</h1>
      <p className="mb-7 text-ink-3">Courses you saved for later.</p>
      <WishlistClient />
    </div>
  );
}
