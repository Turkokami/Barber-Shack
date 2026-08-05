/**
 * TEMPLATE T1 — HOME / HUB.
 *
 * Hero thesis: this is a community hub that cuts hair, not a barbershop that
 * does charity. Jared's words lead the page; the services follow.
 */
import type { Metadata } from "next";
import { BUSINESS as B, NAP } from "@/content/business";
import { SERVICES } from "@/content/services";
import { PROGRAMS } from "@/content/community";
import { DEPARTMENTS } from "@/content/departments";
import { FEATURED_REVIEWS } from "@/content/reviews";
import { ROUTES, abs, BRAND } from "@/lib/routes";
import { pageGraph } from "@/lib/schema";
import { isProgramPublishable } from "@/lib/publishable";
import JsonLd from "@/components/JsonLd";
import AnswerBox from "@/components/AnswerBox";
import TrustStrip from "@/components/TrustStrip";
import PriceTable from "@/components/PriceTable";
import HoursBlock from "@/components/HoursBlock";
import FaqBlock from "@/components/FaqBlock";
import CtaBar from "@/components/CtaBar";
import Photo from "@/components/Photo";
import ReviewPull from "@/components/ReviewPull";

export const metadata: Metadata = {
  title: `${B.name} — Community Barbershop in ${NAP.cityState}`,
  alternates: { canonical: abs(ROUTES.home) },
};

const ANSWER =
  "Barber Shack is a community barbershop at 2500 Cedarwood Ave in Bellingham. Open seven days " +
  "a week, walk-ins welcome, wheelchair accessible. Every Tuesday, haircuts are $12 — for " +
  "everyone, all day, no qualifying required.";

export default function Home() {
  const crumbs = [{ name: "Home", item: abs(ROUTES.home) }];
  return (
    <>
      <JsonLd graph={pageGraph({
        url: abs(ROUTES.home), name: B.name, description: ANSWER, crumbs,
      })} />

      <section className="pt-10 pb-6">
        <p className="eyebrow mb-4">{BRAND.tagline} · Bellingham · open seven days</p>
        <h1 className="text-5xl md:text-7xl mb-5">
          A community hub<br />that happens to<br />cut hair.
        </h1>
        <p className="text-xl max-w-xl text-ink/80">
          We opened on Cedarwood Ave in 2011 to be the shop this neighborhood actually needed —
          everyone welcome, honest prices, and a chair open all seven days. Come as you are, and
          walk in any day of the week.
        </p>
      </section>

      <Photo
        className="mb-8"
        ratio="aspect-[16/10]"
        priority
        src="/images/chair-fade.webp"
        alt="A barber working a clean fade on a client at Barber Shack in Bellingham."
        caption="A fresh fade in progress — no appointment needed."
      />

      <TrustStrip />
      <AnswerBox>{ANSWER}</AnswerBox>

      <PriceTable
        caption="On the board"
        rows={SERVICES.map((s) => ({
          name: s.name, price: s.price, tuesdayPrice: s.tuesdayPrice,
          href: ROUTES.service(s.slug),
        }))}
      />

      <section className="my-12">
        <p className="eyebrow mb-3">Under one roof</p>
        {/* Studio hubs are not built yet — listed as cards, linked as each ships. */}
        <ul className="grid gap-3 sm:grid-cols-2">
          {DEPARTMENTS.map((d) => (
            <li key={d.slug} className="border border-chrome/40 p-4">
              <span className="display text-lg">{d.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <aside className="border border-steel/40 bg-paper p-6 my-12 max-w-2xl">
        <p className="eyebrow mb-2">More than a barbershop</p>
        <p className="mb-0">
          Here&apos;s the honest version: the haircut is almost the excuse. What we&apos;re really
          after is a place in this town where anybody can walk in, take a seat, and leave feeling a
          little better than they came in — whoever you are, whatever your week looks like. That&apos;s
          why Tuesdays are $12 for everyone, why the door&apos;s open on Sundays, why there&apos;s
          local art on the wall and a booth at the Autism Walk every year. Look good, feel good, leave
          confident — that&apos;s the whole idea.
        </p>
      </aside>

      <section className="my-12">
        <p className="eyebrow mb-3">In the neighborhood</p>
        <Photo
          className="mb-6 max-w-2xl"
          ratio="aspect-[6/5]"
          src="/images/team.webp"
          alt="The Barber Shack team holding a banner that reads Empowering everyone to shine, Home of the $12 Tuesday."
          caption="The team out at a community event."
        />
        <ul className="grid gap-3 sm:grid-cols-2">
          {PROGRAMS.map((p) => (
            <li key={p.slug} className="border-l-2 border-steel pl-4 py-1">
              {isProgramPublishable(p) ? (
                <a href={ROUTES.program(p.slug)} className="display text-lg underline underline-offset-4">{p.name}</a>
              ) : (
                <span className="display text-lg">{p.name}</span>
              )}
              <p className="text-sm text-ink/75 mt-1">{p.who}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <a href={ROUTES.community} className="board text-xs underline underline-offset-4">
            More about what we do in the neighborhood →
          </a>
        </p>
      </section>

      {/* Renders only when real, verbatim Google reviews are in content/reviews.ts */}
      <ReviewPull reviews={FEATURED_REVIEWS} />

      <HoursBlock />
      <FaqBlock faqs={[]} />
      <CtaBar label={B.city} />
    </>
  );
}
