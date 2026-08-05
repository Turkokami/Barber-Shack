/**
 * TEMPLATE T4 — CITY (Bellingham). The parent of the neighborhood cluster.
 * Neighborhood links are real indexed routes, never anchor jumps — and only the
 * rows that clear isPublishable() appear, so no link points at a withheld page.
 */
import type { Metadata } from "next";
import { NEIGHBORHOODS } from "@/content/neighborhoods";
import { SERVICES } from "@/content/services";
import { BUSINESS as B, NAP } from "@/content/business";
import { isPublishable } from "@/lib/publishable";
import { ROUTES, abs } from "@/lib/routes";
import { pageGraph } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerBox from "@/components/AnswerBox";
import TrustStrip from "@/components/TrustStrip";
import HoursBlock from "@/components/HoursBlock";
import FaqBlock from "@/components/FaqBlock";
import CtaBar from "@/components/CtaBar";
import Photo from "@/components/Photo";

export const metadata: Metadata = {
  title: `Barbershop in ${NAP.cityState}`,
  description:
    "Barber Shack is a community barbershop at 2500 Cedarwood Ave in Bellingham, serving every neighborhood in town. Open seven days, walk-ins welcome, $12 Tuesdays.",
  alternates: { canonical: abs(ROUTES.bellingham) },
};

const ANSWER =
  "Barber Shack is a community barbershop at 2500 Cedarwood Ave in Bellingham, in the Birchwood " +
  "neighborhood. It serves the whole city — walk in any day of the week, including Sunday, and " +
  "every Tuesday haircuts are $12 for everyone.";

const FAQS = [
  { q: "Where in Bellingham is Barber Shack?", a: "At 2500 Cedarwood Ave, in the Birchwood neighborhood of northwest Bellingham." },
  { q: "Is it open on weekends?", a: "Yes — seven days a week, including Saturday nine to five and Sunday ten to four." },
];

export default function BellinghamCity() {
  const url = abs(ROUTES.bellingham);
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: B.city, item: url },
  ];
  const hoods = NEIGHBORHOODS.filter(isPublishable);

  return (
    <>
      <JsonLd graph={pageGraph({ url, name: `Barbershop in ${NAP.cityState}`, description: ANSWER, faqs: FAQS, crumbs })} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-4xl md:text-5xl mt-2 mb-4">Barbershop in {NAP.cityState}</h1>
      <TrustStrip />
      <AnswerBox>{ANSWER}</AnswerBox>

      <Photo
        className="my-8"
        ratio="aspect-[16/10]"
        src="/images/barber-pole.webp"
        alt="A classic barber pole beside the Barber Shack BS logo wall in Bellingham."
      />

      <section className="my-10 max-w-2xl">
        <p className="mb-4">
          Barber Shack has cut hair on Cedarwood Avenue since 2011, in the Birchwood neighborhood of
          northwest Bellingham. From there it is a short trip to just about anywhere in the city —
          and because the shop runs on walk-ins and stays open seven days a week, it is easy to fit a
          haircut around wherever your day already takes you.
        </p>
        <p className="mb-4">
          Whatever part of town you are coming from, the deal is the same: no appointment needed,
          honest prices posted on the board, and $12 for everyone every Tuesday, all day, with no
          qualifying and no separate line.
        </p>
      </section>

      {hoods.length > 0 && (
        <section className="my-10">
          <p className="eyebrow mb-3">By neighborhood</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {hoods.map((n) => (
              <li key={n.slug} className="border-l-2 border-steel pl-4 py-1">
                <a href={ROUTES.neighborhood(n.slug)} className="display text-lg underline underline-offset-4">
                  {n.name}
                </a>
                <p className="text-sm text-ink/70 mt-1">About {n.driveTimeMin} min from the shop</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="my-10">
        <p className="eyebrow mb-3">What we do</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <a href={ROUTES.service(s.slug)} className="underline underline-offset-4">{s.name}</a>
            </li>
          ))}
        </ul>
      </section>

      <HoursBlock />
      <FaqBlock faqs={FAQS} />
      <CtaBar label={B.city} />
    </>
  );
}
