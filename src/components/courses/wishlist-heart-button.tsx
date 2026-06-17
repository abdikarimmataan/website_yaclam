"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { readSession } from "@/lib/auth/session";
import { addToWishlist, isCourseInWishlist, removeFromWishlist } from "@/lib/api/wishlist.service";
import { toast } from "@/lib/utils/toast";

export function WishlistHeartButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const session = readSession();
    if (!session?.userId || session.role !== "student") return;

    let cancelled = false;
    isCourseInWishlist(courseId)
      .then((value) => {
        if (!cancelled) setSaved(value);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const session = readSession();
    if (!session?.accessToken || session.role !== "student") {
      toast.info("Please log in to save courses to your wishlist.");
      router.push("/login");
      return;
    }

    setBusy(true);
    try {
      if (saved) {
        await removeFromWishlist(courseId);
        setSaved(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(courseId);
        setSaved(true);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Wishlist update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      onClick={toggle}
      disabled={busy}
      className="absolute right-3 top-3 grid h-[34px] w-[34px] place-items-center rounded-full bg-white/90 text-ink-2 transition hover:text-danger"
    >
      {busy ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Heart size={16} fill={saved ? "currentColor" : "none"} className={saved ? "text-danger" : ""} />
      )}
    </button>
  );
}
