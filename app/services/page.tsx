/**
 * SERVICES HUB — the single services hub. Never a second one (Hard Prohibition #2).
 * Data-driven from content/services.ts.
 */
import type { Metadata } from "next";
import { SERVICES } from "@/content/services";
import { BUSINESS as B, NAP } from "@/content/business";
import { ROUTES, abs } from "@/lib/routes";
import { pageGraph } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerBox from "@/components/AnswerBox";
import TrustStrip from "@/components/TrustStrip";
import PriceTable from "@/components/PriceTable";
import HoursBlock from "@/components/HoursBlock";
import FaqBlock from "@/components/FaqBlock";
import CtaBar from "@/components/CtaBar";
import Photo from "@/components/Photo";

export const metadata: Metadata = {
  title: `Barbershop Services in ${NAP.cityState}`,
  description:
    "Clipper cuts, skin fades, kids' cuts, beard trims, and straight-razor shaves at Barber Shack in Bellingham. Open seven days, walk-ins welcome, $12 Tuesdays.",
  alternates: { canonical: abs(ROUTES.services) },
};

const ANSWER =
  "Barber Shack offers clipper cuts, long cuts, skin fades, flat tops, kids' cuts, beard trims, " +
  "and hot-towel straight-razor shaves at 2500 Cedarwood Ave in Bellingham. Walk in any day, " +
  "including Sunday. Every Tuesday, our standard haircuts are $12 for everyone.";

const FAQS = [
  { q: "Do I need an appointment?", a: "No. Walk-ins are welcome every day we are open, including Sunday. You can also book ahead on Vagaro." },
  { q: "Which services are $12 on Tuesdays?", a: "Our standard haircuts — the price board marks the Tuesday rate on every service it covers. Skin fades and flat tops are not included; those stay at their regular price." },
];

export default function ServicesHub() {
  const url = abs(ROUTES.services);
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: "Services", item: url },
  ];

  return (
    <>
      <JsonLd graph={pageGraph({ url, name: `Barbershop Services in ${NAP.cityState}`, description: ANSWER, faqs: FAQS, crumbs })} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-4xl md:text-5xl mt-2 mb-4">Services in {NAP.cityState}</h1>
      <TrustStrip />
      <AnswerBox>{ANSWER}</AnswerBox>

      <Photo
        className="my-8"
        ratio="aspect-[16/10]"
        src="/images/cut-clipper-closeup.webp"
        alt="Clippers detailing the side of a client's cut at Barber Shack in Bellingham."
        caption="Every service on the board, walk-in or booked."
      />

      <PriceTable
        caption="On the board"
        rows={SERVICES.map((s) => ({
          name: s.name, price: s.price, tuesdayPrice: s.tuesdayPrice, href: ROUTES.service(s.slug),
        }))}
      />

      <HoursBlock />
      <FaqBlock faqs={FAQS} />
      <CtaBar label={B.city} />
    </>
  );
}
