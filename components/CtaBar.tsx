import { BUSINESS as B } from "@/content/business";
import { ROUTES } from "@/lib/routes";

/** Named to the page's market, never a generic sitewide banner. */
export default function CtaBar({ label = "Bellingham" }: { label?: string }) {
  return (
    <section className="bg-ink text-shopwhite px-6 py-10 my-14 rounded-xl">
      <p className="eyebrow mb-2">Walk in or book</p>
      <h2 className="text-3xl mb-5">Get in the chair in {label} today.</h2>
      <div className="flex flex-wrap gap-3">
        <a href={ROUTES.book}
           className="bg-signal text-white px-7 py-3.5 rounded-lg font-bold uppercase tracking-wide text-sm transition hover:brightness-110">
          Book a chair
        </a>
        <a href={`tel:${B.phoneTel}`}
           className="border-2 border-shopwhite/70 text-white px-7 py-3.5 rounded-lg font-bold uppercase tracking-wide text-sm transition hover:bg-white/10">
          Call {B.phoneDisplay}
        </a>
      </div>
    </section>
  );
}
