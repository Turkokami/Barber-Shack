/**
 * CONTACT — NAP exactly as it appears in schema and GBP (Rule 9).
 * The domain email is still an open registry item (#2); until it resolves this
 * page shows phone only, never the gmail. Silence beats an off-brand address.
 */
import type { Metadata } from "next";
import { BUSINESS as B, NAP, isResolved } from "@/content/business";
import { ROUTES, abs } from "@/lib/routes";
import { pageGraph } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerBox from "@/components/AnswerBox";
import HoursBlock from "@/components/HoursBlock";
import CtaBar from "@/components/CtaBar";
import Photo from "@/components/Photo";

export const metadata: Metadata = {
  title: `Contact — ${B.name} in ${NAP.cityState}`,
  description:
    "Barber Shack is at 2500 Cedarwood Ave, Bellingham, WA 98225. Call (360) 296-9190. Open seven days, walk-ins welcome.",
  alternates: { canonical: abs(ROUTES.contact) },
};

const ANSWER =
  "Barber Shack is at 2500 Cedarwood Ave, Bellingham, WA 98225. Call (360) 296-9190. Open seven " +
  "days a week, walk-ins welcome, wheelchair accessible.";

const emailResolved = isResolved(B.email);
const socials = B.sameAs.filter((u) => isResolved(u));
const mapResolved = isResolved(B.gbpUrl);

export default function ContactPage() {
  const url = abs(ROUTES.contact);
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: "Contact", item: url },
  ];

  return (
    <>
      <JsonLd graph={pageGraph({ url, name: `Contact — ${B.name}`, description: ANSWER, crumbs })} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-4xl md:text-5xl mt-2 mb-4">Contact</h1>
      <AnswerBox>{ANSWER}</AnswerBox>

      <Photo
        className="my-8 max-w-2xl"
        ratio="aspect-[4/3]"
        src="/images/storefront.webp"
        alt="The Barber Shack storefront on Cedarwood Avenue in Bellingham, with the pride flag and BS sign."
        caption="Find us at 2500 Cedarwood Ave."
      />

      <section className="my-10 board">
        <div className="board-row"><span>Address</span><span className="dots" aria-hidden /><span>{NAP.full}</span></div>
        <div className="board-row">
          <span>Phone</span><span className="dots" aria-hidden />
          <a href={`tel:${B.phoneTel}`} className="underline underline-offset-4">{B.phoneDisplay}</a>
        </div>
        {emailResolved && (
          <div className="board-row">
            <span>Email</span><span className="dots" aria-hidden />
            <a href={`mailto:${B.email}`} className="underline underline-offset-4">{B.email}</a>
          </div>
        )}
        {mapResolved && (
          <div className="board-row">
            <span>Map</span><span className="dots" aria-hidden />
            <a href={B.gbpUrl} className="underline underline-offset-4" rel="noopener" target="_blank">
              Google Business Profile
            </a>
          </div>
        )}
      </section>

      {socials.length > 0 && (
        <section className="my-10">
          <p className="eyebrow mb-3">Find us</p>
          <ul className="space-y-2">
            {socials.map((u) => (
              <li key={u}>
                <a href={u} className="underline underline-offset-4" rel="noopener" target="_blank">
                  {u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <HoursBlock />
      <CtaBar label={B.city} />
    </>
  );
}
