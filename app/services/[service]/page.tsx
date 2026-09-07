/**
 * TEMPLATE T2 — SERVICE SPOKE.
 * One template, ten routes, driven by content/services.ts. Rule 1.
 * Block order is fixed and never reordered per page.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVICES, getService, SERVICE_IMAGE } from "@/content/services";
import { BUSINESS as B, NAP } from "@/content/business";
import { ROUTES, abs } from "@/lib/routes";
import { pageGraph, serviceNode } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import AnswerBox from "@/components/AnswerBox";
import FaqBlock from "@/components/FaqBlock";
import TrustStrip from "@/components/TrustStrip";
import HoursBlock from "@/components/HoursBlock";
import CtaBar from "@/components/CtaBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import CommunityNote from "@/components/CommunityNote";
import Photo from "@/components/Photo";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ service: string }> }
): Promise<Metadata> {
  const { service } = await params;
  const svc = getService(service);
  if (!svc) return {};
  return {
    title: `${svc.name} in ${B.city}, ${B.region}`,
    description: svc.answer.slice(0, 155),
    alternates: { canonical: abs(ROUTES.service(svc.slug)) },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  const svc = getService(service);
  if (!svc) notFound();

  const url = abs(ROUTES.service(svc.slug));
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: "Services", item: abs(ROUTES.services) },
    { name: svc.name, item: url },
  ];

  const graph = pageGraph({
    url,
    name: `${svc.name} in ${B.city}, ${B.region}`,
    description: svc.answer,
    primary: serviceNode(svc, url),
    faqs: svc.faqs,
    crumbs,
  });

  return (
    <>
      <JsonLd graph={graph} />
      <Breadcrumbs crumbs={crumbs} />

      {/* Block 1 — exactly one H1 */}
      <h1 className="text-4xl md:text-5xl mt-2 mb-4">
        {svc.name} in {NAP.cityState}
      </h1>
      <TrustStrip />

      {/* Block 2 — AEO quick answer, 40–60 words */}
      <AnswerBox>{svc.answer}</AnswerBox>

      {SERVICE_IMAGE[svc.slug] && (
        <Photo
          className="my-8 max-w-2xl"
          ratio="aspect-[4/3]"
          src={SERVICE_IMAGE[svc.slug].src}
          alt={SERVICE_IMAGE[svc.slug].alt}
        />
      )}

      {/* Block 3 — the price board */}
      <section className="my-10">
        <p className="eyebrow mb-3">What it costs</p>
        <div className="board border-t-2 border-ink">
          <div className="board-row">
            <span>{svc.name}</span>
            <span className="dots" aria-hidden />
            <span className="font-semibold">
              {svc.priceNote && <span className="text-meta font-normal mr-1">{svc.priceNote}</span>}
              ${svc.price}
            </span>
          </div>
          {svc.tuesdayPrice && (
            <div className="board-row">
              <span className="text-signal">Tuesdays</span>
              <span className="dots" aria-hidden />
              <span className="font-semibold text-signal">${svc.tuesdayPrice}</span>
            </div>
          )}
          <div className="board-row">
            <span>Chair time</span>
            <span className="dots" aria-hidden />
            <span>{svc.durationMin} min</span>
          </div>
        </div>
      </section>

      {/* Block 4 — what's included */}
      {svc.includes.length > 0 && (
        <section className="my-10">
          <p className="eyebrow mb-3">What's included</p>
          <ul className="space-y-2">
            {svc.includes.map((i) => (
              <li key={i} className="border-b border-chrome/30 pb-2">{i}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Block 5 — who it's for */}
      <section className="my-10">
        <p className="eyebrow mb-3">Who it's for</p>
        <p className="text-lg">{svc.whoItsFor}</p>
      </section>

      {/* Block 6 — the community frame. Not decoration; it is the reason for the price. */}
      {svc.tuesdayPrice && (
        <CommunityNote>
          This cut is $12 on Tuesdays, for everybody, all day. The program exists for single
          parents, people on
          Social Security or state assistance, and anyone getting ready to go back to work — but
          nobody is asked to qualify, and there is no separate line.
        </CommunityNote>
      )}

      <HoursBlock />
      <FaqBlock faqs={svc.faqs} />
      <CtaBar label={B.city} />
    </>
  );
}
