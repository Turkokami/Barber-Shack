/**
 * BOOK — booking is one tap from every page; this is the full booking surface.
 * Walk-in AND appointment. The walk-in option is never hidden behind the app.
 */
import type { Metadata } from "next";
import { BUSINESS as B, NAP } from "@/content/business";
import { ROUTES, abs } from "@/lib/routes";
import { pageGraph } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerBox from "@/components/AnswerBox";
import BookingEmbed from "@/components/BookingEmbed";
import Photo from "@/components/Photo";
import HoursBlock from "@/components/HoursBlock";

export const metadata: Metadata = {
  title: `Book a Chair — ${B.name}`,
  description:
    "Walk in any day of the week at Barber Shack in Bellingham, including Sunday — or book a set time or a specific barber ahead on Vagaro.",
  alternates: { canonical: abs(ROUTES.book) },
};

const ANSWER =
  "Walk in any day we are open, including Sunday — no appointment needed. Prefer a set time or a " +
  "specific barber? Book ahead on Vagaro. Either way the shop is at 2500 Cedarwood Ave in Bellingham.";

export default function BookPage() {
  const url = abs(ROUTES.book);
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: "Book", item: url },
  ];

  return (
    <>
      <JsonLd graph={pageGraph({ url, name: `Book a Chair — ${B.name}`, description: ANSWER, crumbs })} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-4xl md:text-5xl mt-2 mb-4">Book a chair in {NAP.cityState}</h1>
      <AnswerBox>{ANSWER}</AnswerBox>

      <Photo
        className="my-8"
        ratio="aspect-[16/10]"
        src="/images/cut-fresh-fade.webp"
        alt="A crisp, freshly finished fade at Barber Shack in Bellingham."
        caption="Walk in, or grab a set time below."
      />

      <BookingEmbed />
      <HoursBlock />

      <section className="my-10">
        <p className="eyebrow mb-3">Rather call?</p>
        <p className="text-lg">
          <a href={`tel:${B.phoneTel}`} className="underline underline-offset-4">Call {B.phoneDisplay}</a>{" "}
          and someone will tell you how the chairs are looking.
        </p>
      </section>
    </>
  );
}
