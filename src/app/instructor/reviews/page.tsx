import { Star } from "lucide-react";

const reviews = [
  { name: "Hodan A.", course: "Power BI Mastery", rating: 5, text: "Best Somali data course out there. The Olist project tied everything together.", initials: "HA" },
  { name: "Yuusuf M.", course: "Forex Foundations", rating: 5, text: "Finally a trading course focused on risk and discipline, not hype.", initials: "YM" },
  { name: "Cabdi N.", course: "AI & Prompt Engineering", rating: 4, text: "Very practical. Would love a few more advanced examples.", initials: "CN" },
];

export default function InstructorReviews() {
  return (
    <div>
      <h1 className="mb-1 text-[28px] font-bold text-navy">Reviews</h1>
      <p className="mb-6 text-ink-3">Feedback from learners across your courses.</p>
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="rounded-2xl border border-line bg-white px-6 py-5 text-center">
          <div className="font-display text-4xl font-semibold text-navy">4.8</div>
          <div className="mt-1 flex justify-center gap-0.5">{[1,2,3,4,5].map((s)=><Star key={s} size={14} fill={s<=5?"#C9A84C":"none"} stroke="#C9A84C" />)}</div>
          <div className="mt-1 text-[12px] text-ink-3">1,240 reviews</div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {reviews.map((r) => (
          <div key={r.name} className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-navy font-bold text-gold">{r.initials}</span>
                <div><div className="font-bold text-navy">{r.name}</div><div className="text-[12px] text-ink-3">{r.course}</div></div>
              </div>
              <span className="flex gap-0.5">{[1,2,3,4,5].map((s)=><Star key={s} size={13} fill={s<=r.rating?"#C9A84C":"none"} stroke="#C9A84C" />)}</span>
            </div>
            <p className="text-[14.5px] text-ink-2">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
