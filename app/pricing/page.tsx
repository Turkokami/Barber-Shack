/**
 * PRICING HUB — the price board as a full page. House prices only.
 * Resident-studio prices are the operator's to set and publish only with consent
 * (Amendment C) — this page says which is which.
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
import CtaBar from "@/components/CtaBar";
import Photo from "@/components/Photo";

export const metadata: Metadata = {
  title: `Haircut Prices in ${NAP.cityState}`,
  description:
    "Barber Shack's full, posted price list. Walk in any day, including Sunday. Every Tuesday, haircuts are $12 for everyone — all day, no qualifying required.",
  alternates: { canonical: abs(ROUTES.pricing) },
};

const ANSWER =
  "Barber Shack keeps an honest, posted price list at 2500 Cedarwood Ave in Bellingham. Walk in " +
  "any day, including Sunday. Every Tuesday, haircuts are $12 for everyone — all day, no " +
  "qualifying required.";

export default function PricingHub() {
  const url = abs(ROUTES.pricing);
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: "Prices", item: url },
  ];

  return (
    <>
      <JsonLd graph={pageGraph({ url, name: `Haircut Prices in ${NAP.cityState}`, description: ANSWER, crumbs })} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-4xl md:text-5xl mt-2 mb-4">Prices</h1>
      <TrustStrip />
      <AnswerBox>{ANSWER}</AnswerBox>

      <Photo
        className="my-8"
        ratio="aspect-[16/10]"
        src="/images/interior-shop-floor.webp"
        alt="Inside Barber Shack: the shop floor and chairs at 2500 Cedarwood Ave in Bellingham."
        caption="What's on the board is what you pay at the chair."
      />

      <PriceTable
        caption="House prices — set by the shop"
        rows={SERVICES.map((s) => ({
          name: s.priceNote ? `${s.name} (${s.priceNote})` : s.name,
          price: s.price, tuesdayPrice: s.tuesdayPrice, href: ROUTES.service(s.slug),
        }))}
      />

      <aside className="border border-steel/40 bg-paper p-6 my-10">
        <p className="eyebrow mb-2">Prices set by the studio</p>
        <p className="mb-0">
          The salon, textured-hair, toupee, and tattoo studios are run by independent operators who
          set their own prices and keep their own books. Their rates are published here only once
          each operator agrees — so this board shows house prices, with resident-studio pricing
          added as each one opts in.
        </p>
      </aside>

      <section className="my-10">
        <p className="eyebrow mb-3">The Tuesday rate</p>
        <p className="max-w-2xl">
          Every Tuesday, haircuts are <strong>$12</strong> — for everyone, all day, with no
          qualifying and no separate line.{" "}
          <a href={ROUTES.program("12-dollar-tuesdays")} className="underline underline-offset-4">
            More about $12 Tuesdays →
          </a>
        </p>
      </section>

      <CtaBar label={B.city} />
    </>
  );
}
