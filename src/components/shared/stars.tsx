import { Star } from "lucide-react";

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#B8860B]">
      <Star size={14} fill="#B8860B" stroke="#B8860B" /> {rating.toFixed(1)}
    </span>
  );
}
