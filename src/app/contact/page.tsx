import { Mail, Phone, MapPin, Send } from "lucide-react";
import { getPageCmsConfig } from "@/lib/api/page-cms.service";

export async function generateMetadata() {
  const cms = await getPageCmsConfig("contact");
  return { title: cms.title };
}

export default async function ContactPage() {
  const cms = await getPageCmsConfig("contact");

  return (
    <div>
      {cms.isVisible ? (
        <div className="dark-band py-14 text-white">
          <div className="container">
            <h1 className="mb-2.5 text-[clamp(30px,5vw,46px)] font-semibold">{cms.title}</h1>
            <p className="max-w-xl text-[17px] text-white/72">{cms.subtitle}</p>
          </div>
        </div>
      ) : null}

      <section className="section container">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-5">
            {[
              { icon: Mail, t: "Email", d: "hello@yaclam.com" },
              { icon: Phone, t: "Phone", d: "+353 1 234 5678" },
              { icon: MapPin, t: "Location", d: "Dublin, Ireland · Serving learners worldwide" },
            ].map((c) => (
              <div key={c.t} className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface text-royal"><c.icon size={22} /></div>
                <div>
                  <div className="font-bold text-navy">{c.t}</div>
                  <div className="mt-0.5 text-[14.5px] text-ink-3">{c.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-line bg-white p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">First name</label>
                <input className="field-input" placeholder="Magaca koowaad" />
              </div>
              <div>
                <label className="field-label">Last name</label>
                <input className="field-input" placeholder="Magaca dambe" />
              </div>
            </div>
            <div className="mt-4">
              <label className="field-label">Email</label>
              <input type="email" className="field-input" placeholder="you@example.com" />
            </div>
            <div className="mt-4">
              <label className="field-label">Subject</label>
              <input className="field-input" placeholder="How can we help?" />
            </div>
            <div className="mt-4">
              <label className="field-label">Message</label>
              <textarea rows={5} className="field-input resize-none" placeholder="Write your message…" />
            </div>
            <button className="btn btn-navy mt-5 w-full">Send message <Send size={16} /></button>
            <p className="mt-3 text-center text-[12px] text-ink-3">Form submission wires to your backend / email service (Resend).</p>
          </div>
        </div>
      </section>
    </div>
  );
}
