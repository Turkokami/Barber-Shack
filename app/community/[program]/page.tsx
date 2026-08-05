/**
 * COMMUNITY PROGRAM TEMPLATE. One template, N programs. Rule 1.
 * Gated by isProgramPublishable(): a program whose body is still [DRAFT] produces
 * no route and no sitemap entry — it appears on the hub, but not as a thin page.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROGRAMS, getProgram, PROGRAM_IMAGE } from "@/content/community";
import { BUSINESS as B } from "@/content/business";
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
    title: p.name,
    description: p.answer.slice(0, 155),
    alternates: { canonical: abs(ROUTES.program(p.slug)) },
  };
}

export default async function ProgramPage({ params }: { params: Promise<{ program: string }> }) {
  const { program } = await params;
  const p = getProgram(program);
  if (!p || !isProgramPublishable(p)) notFound();

  const url = abs(ROUTES.program(p.slug));
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: "Community", item: abs(ROUTES.community) },
    { name: p.name, item: url },
  ];
  const faqs = cleanFaqs(p.faqs);

  return (
    <>
      <JsonLd graph={pageGraph({ url, name: p.name, description: p.answer, faqs, crumbs })} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-4xl md:text-5xl mt-2 mb-4">{p.name}</h1>
      <AnswerBox>{p.answer}</AnswerBox>

      {PROGRAM_IMAGE[p.slug] && (
        <Photo className="my-8 max-w-2xl" src={PROGRAM_IMAGE[p.slug].src} alt={PROGRAM_IMAGE[p.slug].alt} />
      )}

      <section className="my-10">
        <p className="eyebrow mb-3">Who it&apos;s for</p>
        <p className="text-lg max-w-2xl">{p.who}</p>
      </section>

      <section className="my-10 max-w-2xl">
        {p.body.split("\n\n").map((para, i) => <p key={i} className="mb-4">{para}</p>)}
      </section>

      <FaqBlock faqs={faqs} />
      <CtaBar label={B.city} />
    </>
  );
}
