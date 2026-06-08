import { Send } from "lucide-react";
import { getContactCmsConfig } from "@/lib/api/contact-cms.service";
import { contactCardHref } from "@/lib/api/contact-cms.utils";
import { Icon } from "@/lib/icon-map";

export async function generateMetadata() {
  const cms = await getContactCmsConfig();
  return { title: cms.title };
}

export default async function ContactPage() {
  const cms = await getContactCmsConfig();

  const contactCards = [
    { key: "email", ...cms.email },
    { key: "phone", ...cms.phone },
    { key: "location", ...cms.location },
  ].filter((card) => card.isVisible);

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
            {contactCards.length > 0 ? (
              contactCards.map((c) => {
                const href = contactCardHref(c.key, c.description);
                const description = href ? (
                  <a href={href} className="mt-0.5 text-[14.5px] text-ink-3 transition hover:text-royal">
                    {c.description}
                  </a>
                ) : (
                  <div className="mt-0.5 text-[14.5px] text-ink-3">{c.description}</div>
                );

                return (
                  <div
                    key={c.key}
                    className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface text-royal">
                      <Icon name={c.icon} size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-navy">{c.title}</div>
                      {description}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-line bg-surface px-6 py-10 text-center">
                <p className="text-[15px] text-ink-3">{cms.emptyStateText}</p>
              </div>
            )}
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
            <button type="button" className="btn btn-navy mt-5 w-full">
              Send message <Send size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
