/**
 * COMMUNITY PROGRAM TEMPLATE. One template, N programs. Rule 1.
 * Gated by isProgramPublishable(): a program whose body is still [DRAFT] produces
 * no route and no sitemap entry — it appears on the hub, but not as a thin page.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROGRAMS, getProgram, PROGRAM_IMAGE } from "@/content/community";
import { BUSINESS as B, fillRate } from "@/content/business";
import { ROUTES, abs } from "@/lib/routes";
import { pageGraph } from "@/lib/schema";
import { isProgramPublishable, cleanFaqs } from "@/lib/publishable";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerBox from "@/components/AnswerBox";
import FaqBlock from "@/components/FaqBlock";
import CtaBar from "@/components/CtaBar";
import Photo from "@/components/Photo";

export function generateStaticParams() {
  return PROGRAMS.filter(isProgramPublishable).map((p) => ({ program: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ program: string }> }
): Promise<Metadata> {
  const { program } = await params;
  const p = getProgram(program);
  if (!p || !isProgramPublishable(p)) return {};
  return {
    title: fillRate(p.name),
    description: fillRate(p.answer).slice(0, 155),
    alternates: { canonical: abs(ROUTES.program(p.slug)) },
  };
}

export default async function ProgramPage({ params }: { params: Promise<{ program: string }> }) {
  const { program } = await params;
  const p = getProgram(program);
  if (!p || !isProgramPublishable(p)) notFound();

  const url = abs(ROUTES.program(p.slug));
  // Rate tokens resolve per render, so an announced price change needs no redeploy.
  const name = fillRate(p.name);
  const answer = fillRate(p.answer);
  const faqs = cleanFaqs(p.faqs).map((f) => ({ q: fillRate(f.q), a: fillRate(f.a) }));
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: "Community", item: abs(ROUTES.community) },
    { name, item: url },
  ];

  return (
    <>
      <JsonLd graph={pageGraph({ url, name, description: answer, faqs, crumbs })} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-4xl md:text-5xl mt-2 mb-4">{name}</h1>
      <AnswerBox>{answer}</AnswerBox>

      {/* An announced change the shop wants read before it lands — the owner's
          own words, never rewritten into marketing voice. */}
      {p.announcement && (
        <section className="border-l-4 border-signal bg-paper px-5 py-5 my-8 rounded-r-lg max-w-2xl">
          <p className="display text-lg mb-3">{p.announcement.heading}</p>
          {p.announcement.body.map((para, i) => (
            <p key={i} className="mb-3 text-[0.98rem]">{para}</p>
          ))}
          {p.announcement.signoff && (
            <p className="board text-sm text-meta mt-4">{p.announcement.signoff}</p>
          )}
        </section>
      )}

      {PROGRAM_IMAGE[p.slug] && (
        <Photo className="my-8 max-w-2xl" src={PROGRAM_IMAGE[p.slug].src} alt={PROGRAM_IMAGE[p.slug].alt} />
      )}

      <section className="my-10">
        <p className="eyebrow mb-3">Who it&apos;s for</p>
        <p className="text-lg max-w-2xl">{p.who}</p>
      </section>

      <section className="my-10 max-w-2xl">
        {fillRate(p.body).split("\n\n").map((para, i) => <p key={i} className="mb-4">{para}</p>)}
      </section>

      <FaqBlock faqs={faqs} />
      <CtaBar label={B.city} />
    </>
  );
}
