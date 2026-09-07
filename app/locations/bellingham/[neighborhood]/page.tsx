/**
 * TEMPLATE T5 — NEIGHBOURHOOD.
 * Gated by isPublishable(). A row under the 400-word floor produces NO route
 * and enters NO sitemap. Rule 5, enforced by the compiler rather than by memory.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NEIGHBORHOODS, getNeighborhood } from "@/content/neighborhoods";
import { getService } from "@/content/services";
import { isPublishable } from "@/lib/publishable";
import { BUSINESS as B } from "@/content/business";
import { ROUTES, abs } from "@/lib/routes";
import { pageGraph, neighborhoodNode } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import AnswerBox from "@/components/AnswerBox";
import TrustStrip from "@/components/TrustStrip";
import FaqBlock from "@/components/FaqBlock";
import CtaBar from "@/components/CtaBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import Photo from "@/components/Photo";

export function generateStaticParams() {
  return NEIGHBORHOODS.filter(isPublishable).map((n) => ({ neighborhood: n.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ neighborhood: string }> }
): Promise<Metadata> {
  const { neighborhood } = await params;
  const n = getNeighborhood(neighborhood);
  if (!n || !isPublishable(n)) return {};
  return {
    title: `Barbershop near ${n.name}, ${B.city}`,
    description: `Walk-in haircuts ${n.driveTimeMin} minutes from ${n.name}. Open seven days, $12 Tuesdays.`,
    alternates: { canonical: abs(ROUTES.neighborhood(n.slug)) },
  };
}

export default async function NeighborhoodPage(
  { params }: { params: Promise<{ neighborhood: string }> }
) {
  const { neighborhood } = await params;
  const n = getNeighborhood(neighborhood);
  if (!n || !isPublishable(n)) notFound();

  const url = abs(ROUTES.neighborhood(n.slug));
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: B.city, item: abs(ROUTES.bellingham) },
    { name: n.name, item: url },
  ];

  const answer =
    `Barber Shack is about ${n.driveTimeMin} minutes from ${n.name}. Walk in any day of the ` +
    `week, including Sunday — no appointment needed. On Tuesdays our standard haircuts are $12.`;

  const graph = pageGraph({
    url,
    name: `Barbershop near ${n.name}, ${B.city}`,
    description: answer,
    primary: neighborhoodNode(n, url),
    crumbs,
  });

  return (
    <>
      <JsonLd graph={graph} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-4xl md:text-5xl mt-2 mb-4">Barbershop near {n.name}</h1>
      <TrustStrip />
      <AnswerBox>{answer}</AnswerBox>

      <Photo
        className="my-8"
        ratio="aspect-[16/10]"
        src="/images/interior-shop-floor.webp"
        alt="Inside Barber Shack on Cedarwood Avenue — the shop floor and chairs."
      />

      {/* The Rule 5 payload — 400+ words genuinely unique to this neighbourhood */}
      <section className="my-10 max-w-2xl">
        {n.localContext.split("\n\n").map((p, i) => <p key={i} className="mb-4">{p}</p>)}
      </section>

      <section className="my-10">
        <p className="eyebrow mb-3">Nearby</p>
        <ul className="board text-sm space-y-1">
          {n.landmarks.map((l) => <li key={l}>{l}</li>)}
        </ul>
      </section>

      {/* Downward links — three services */}
      <section className="my-10">
        <p className="eyebrow mb-3">What we do</p>
        <ul className="space-y-2">
          {n.services.map((s) => {
            const svc = getService(s);
            return svc ? (
              <li key={s}>
                <a href={ROUTES.service(s)} className="underline underline-offset-4">{svc.name}</a>
              </li>
            ) : null;
          })}
        </ul>
      </section>

      {/* Lateral links — exactly two siblings, never orphaned */}
      <section className="my-10">
        <p className="eyebrow mb-3">Other neighborhoods</p>
        <ul className="space-y-2">
          {n.siblings.map((s) => {
            const sib = getNeighborhood(s);
            return sib && isPublishable(sib) ? (
              <li key={s}>
                <a href={ROUTES.neighborhood(s)} className="underline underline-offset-4">{sib.name}</a>
              </li>
            ) : null;
          })}
        </ul>
      </section>

      <FaqBlock faqs={[]} />
      <CtaBar label={n.name} />
    </>
  );
}
