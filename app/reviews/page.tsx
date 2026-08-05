/**
 * REVIEWS — verified Google reviews only, verbatim (Hard Prohibition #5).
 * Quotes come from content/reviews.ts; the page also always shows the real GBP
 * aggregate and links straight to Google, so it is useful even before quotes are in.
 */
import type { Metadata } from "next";
import { BUSINESS as B, NAP, isResolved } from "@/content/business";
import { REVIEWS } from "@/content/reviews";
import { ROUTES, abs } from "@/lib/routes";
import { pageGraph, reviewNodes } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerBox from "@/components/AnswerBox";
import TrustStrip from "@/components/TrustStrip";
import ReviewPull from "@/components/ReviewPull";
import CtaBar from "@/components/CtaBar";
import Photo from "@/components/Photo";

export const metadata: Metadata = {
  title: `Reviews — ${B.name} in ${NAP.cityState}`,
  description:
    "Barber Shack has a 4.5-star rating across 702 Google reviews in Bellingham — one of the highest review counts in Whatcom County.",
  alternates: { canonical: abs(ROUTES.reviews) },
};

const ANSWER =
  `Barber Shack holds a ${B.rating}-star rating across ${B.reviewCount} Google reviews — one of the ` +
  "highest review counts of any barbershop in Whatcom County. Read them on Google, or add your own.";

const readOnGoogle = isResolved(B.gbpUrl) ? B.gbpUrl : undefined;
const leaveReview = isResolved(B.reviewUrl) ? B.reviewUrl : readOnGoogle;

export default function ReviewsPage() {
  const url = abs(ROUTES.reviews);
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: "Reviews", item: url },
  ];

  const graph = pageGraph({ url, name: `Reviews — ${B.name}`, description: ANSWER, crumbs });
  if (REVIEWS.length) {
    (graph["@graph"] as Record<string, unknown>[]).push(...reviewNodes(REVIEWS, url));
  }

  return (
    <>
      <JsonLd graph={graph} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-4xl md:text-5xl mt-2 mb-4">Reviews</h1>
      <TrustStrip />
      <AnswerBox>{ANSWER}</AnswerBox>

      <Photo
        className="my-8"
        ratio="aspect-[16/10]"
        src="/images/cut-clipper2.webp"
        alt="A client getting a clean clipper cut at Barber Shack in Bellingham."
      />

      {/* Verbatim quotes render here once real reviews are in content/reviews.ts */}
      <ReviewPull reviews={REVIEWS} />

      <section className="my-12 flex flex-wrap gap-3">
        {readOnGoogle && (
          <a
            href={readOnGoogle}
            target="_blank"
            rel="noopener"
            className="bg-ink text-white px-7 py-3.5 rounded-lg font-bold uppercase tracking-wide text-sm transition hover:brightness-110"
          >
            Read our Google reviews
          </a>
        )}
        {leaveReview && (
          <a
            href={leaveReview}
            target="_blank"
            rel="noopener"
            className="border-2 border-ink px-7 py-3.5 rounded-lg font-bold uppercase tracking-wide text-sm transition hover:bg-ink hover:text-white"
          >
            Leave a review
          </a>
        )}
      </section>

      <CtaBar label={B.city} />
    </>
  );
}
