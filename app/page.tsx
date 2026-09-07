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
import { INTENTS } from "@/content/intents";
import { FEATURED_REVIEWS } from "@/content/reviews";
import { ROUTES, abs, BRAND } from "@/lib/routes";
import { pageGraph } from "@/lib/schema";
import { isProgramPublishable, isDepartmentPublishable, isIntentPublishable } from "@/lib/publishable";
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
  "a week, walk-ins welcome, wheelchair accessible. Every Tuesday, our standard haircuts are " +
  "$12 — for everyone, all day, no qualifying required.";

export default function Home() {
  const crumbs = [{ name: "Home", item: abs(ROUTES.home) }];
  // Gated like the studio and program cards: a page that fails its publish gate
  // renders no route, so it must never be linked from here either.
  const intents = INTENTS.filter(isIntentPublishable);
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
          Barber Shack started in Lake Stevens in 2011, and we opened here in the Birchwood
          neighborhood in June 2014 — to be the shop this part of town actually needed. Everyone
          welcome, honest prices, and a chair open all seven days. Come as you are, and walk in
          any day of the week.
        </p>
      </section>

      <Photo
        className="mb-8 max-w-lg"
        ratio="aspect-[4/5]"
        sizes="(min-width: 768px) 32rem, 100vw"
        priority
        src="/images/chair-scissor-bw.webp"
        alt="Owner and master barber Jared Jones-Valentine scissor-cutting a client at Barber Shack, in black and white."
        caption="Jared Jones-Valentine, owner, behind the chair."
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
        {/* Studio hubs ship one at a time — a card links only once its page is built. */}
        <ul className="grid gap-3 sm:grid-cols-2">
          {DEPARTMENTS.map((d) => (
            <li key={d.slug} className="border border-chrome/40 p-4">
              {isDepartmentPublishable(d) ? (
                <a href={ROUTES.department(d.slug)} className="display text-lg hover:text-signal">
                  {d.name} →
                </a>
              ) : (
                <span className="display text-lg">{d.name}</span>
              )}
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
          why a Tuesday haircut is $12 for everyone, why the door&apos;s open on Sundays, why there&apos;s
          local art on the wall and a booth at the Autism Walk every year. Look good, feel good, leave
          confident — that&apos;s the whole idea.
        </p>
      </aside>

      <section className="my-12">
        <p className="eyebrow mb-3">In the neighborhood</p>
        <Photo
          className="mb-6 max-w-lg"
          ratio="aspect-[3/4]"
          sizes="(min-width: 768px) 32rem, 100vw"
          src="/images/toon-art-of-the-cut.webp"
          alt="A comic-style illustration titled The Art of the Cut: clippers taking down a fade, a barber in glasses finishing a client's cut, a barber combing and cutting a smiling client in the chair, tattooed hands working scissors and comb, with a barber pole and pomade bottles around the panels."
          caption="The art of the cut."
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

      {intents.length > 0 && (
        <section className="my-12">
          <p className="eyebrow mb-3">Coming in</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {intents.map((i) => (
              <li key={i.slug} className="border-l-2 border-steel pl-4 py-1">
                <a href={ROUTES.intent(i.slug)} className="display text-lg underline underline-offset-4">
                  {i.h1}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <HoursBlock />
      <FaqBlock faqs={[]} />
      <CtaBar label={B.city} />
    </>
  );
}
