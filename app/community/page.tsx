/**
 * COMMUNITY HUB — the brand thesis surfaced as its own cluster.
 * "Community hub first, barbershop second." Lists every program; deep-links only
 * the ones whose full page is written (isProgramPublishable), never a thin page.
 */
import type { Metadata } from "next";
import { PROGRAMS } from "@/content/community";
import { BUSINESS as B } from "@/content/business";
import { ROUTES, abs } from "@/lib/routes";
import { pageGraph } from "@/lib/schema";
import { isProgramPublishable } from "@/lib/publishable";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerBox from "@/components/AnswerBox";
import CtaBar from "@/components/CtaBar";
import Photo from "@/components/Photo";

export const metadata: Metadata = {
  title: "Community — What We Do in the Neighborhood",
  description:
    "Barber Shack is a community hub first and a barbershop second: $12 Tuesdays, the Autism Walk, back-to-school haircuts, shelter vouchers, the Rainbow Bridge, and the Community Art Wall.",
  alternates: { canonical: abs(ROUTES.community) },
};

const ANSWER =
  "Barber Shack is a community hub first and a barbershop second. That means $12 Tuesdays for " +
  "anyone who needs the break, a standing Autism Walk booth, back-to-school haircuts, shelter and " +
  "agency vouchers, the Rainbow Bridge on Northwest Avenue, and a Community Art Wall.";

export default function CommunityHub() {
  const url = abs(ROUTES.community);
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: "Community", item: url },
  ];

  return (
    <>
      <JsonLd graph={pageGraph({ url, name: "Community — What We Do in the Neighborhood", description: ANSWER, crumbs })} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-4xl md:text-5xl mt-2 mb-4">In the neighborhood</h1>
      <AnswerBox>{ANSWER}</AnswerBox>

      <Photo
        className="my-8 max-w-2xl"
        src="/images/family-artwall.webp"
        alt="A client and his son in front of the Barber Shack community art wall."
      />

      <p className="max-w-2xl mb-8 text-lg">
        We say it on our banner — <em>empowering everyone to shine</em> — and we treat it as a
        to-do list, not a slogan. Here&apos;s what that actually looks like around the shop.
      </p>

      <Photo
        className="my-8 mx-auto max-w-xs"
        ratio="aspect-square"
        src="/images/logo-inclusive.webp"
        alt="Barber Shack emblem: Everyone Welcome, Everyone Respected — all identities, all expressions, all people."
      />

      <section className="my-10">
        <ul className="space-y-6">
          {PROGRAMS.map((p) => {
            const live = isProgramPublishable(p);
            return (
              <li key={p.slug} className="border-l-2 border-steel pl-5 py-1">
                {live ? (
                  <a href={ROUTES.program(p.slug)} className="display text-2xl underline underline-offset-4">
                    {p.name}
                  </a>
                ) : (
                  <span className="display text-2xl">{p.name}</span>
                )}
                <p className="mt-2 max-w-2xl">{p.answer}</p>
                <p className="mt-1 text-sm text-ink/70">Who it&apos;s for: {p.who}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <CtaBar label={B.city} />
    </>
  );
}
