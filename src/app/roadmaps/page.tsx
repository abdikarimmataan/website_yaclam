import { roadmaps } from "@/lib/data/roadmaps";
import { RoadmapCard } from "@/components/shared/roadmap-card";

export const metadata = { title: "Career Roadmaps" };

export default function RoadmapsPage() {
  return (
    <div>
      <div className="dark-band py-14 text-white">
        <div className="container">
          <h1 className="mb-2.5 text-[clamp(30px,5vw,46px)] font-semibold">Career Roadmaps</h1>
          <p className="max-w-xl text-[17px] text-white/72">
            Pick a destination. We give you the salary outlook, the skills, and a guided sequence to get there.
          </p>
        </div>
      </div>
      <section className="section container">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roadmaps.map((r) => <RoadmapCard key={r.id} r={r} />)}
        </div>
      </section>
    </div>
  );
}
