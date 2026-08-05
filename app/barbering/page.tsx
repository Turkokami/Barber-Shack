/**
 * BARBERING — the house department hub. The core trade, in the shop's own voice.
 *
 * This is a narrative hub, NOT a second price board: the single services hub lives
 * at /services (Hard Prohibition #2). Every service link here points back to it.
 * Content is data-driven from the barbering department in content/departments.ts.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDepartment } from "@/content/departments";
import { isDepartmentPublishable } from "@/lib/publishable";
import { BUSINESS as B, NAP } from "@/content/business";
import { ROUTES, abs } from "@/lib/routes";
import { pageGraph } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerBox from "@/components/AnswerBox";
import TrustStrip from "@/components/TrustStrip";
import HoursBlock from "@/components/HoursBlock";
import FaqBlock from "@/components/FaqBlock";
import CtaBar from "@/components/CtaBar";
import Photo from "@/components/Photo";

const DEPT = getDepartment("barbering");

export const metadata: Metadata = {
  title: `Barbering in ${NAP.cityState}`,
  description: DEPT?.answer.slice(0, 155),
  alternates: { canonical: abs(ROUTES.department("barbering")) },
};

const FAQS = [
  {
    q: "Do I need an appointment for a haircut?",
    a: "No — walk-ins are welcome every day we're open, including Sunday. You can also book ahead if you'd rather lock in a time.",
  },
  {
    q: "Are haircuts really $12 on Tuesdays?",
    a: "Yes. Every Tuesday, haircuts are $12 for everyone, all day — no qualifying and no questions asked.",
  },
];

export default function BarberingPage() {
  const dept = DEPT;
  if (!dept || !dept.overview || !isDepartmentPublishable(dept)) notFound();
  const { intro, sections } = dept.overview;

  const url = abs(ROUTES.department("barbering"));
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: "Barbering", item: url },
  ];

  return (
    <>
      <JsonLd graph={pageGraph({ url, name: `Barbering in ${NAP.cityState}`, description: dept.answer, faqs: FAQS, crumbs })} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-4xl md:text-5xl mt-2 mb-4">Barbering</h1>
      <TrustStrip />
      <AnswerBox>{dept.answer}</AnswerBox>

      <Photo
        className="my-8"
        ratio="aspect-[16/10]"
        src="/images/chair-scissor-bw.webp"
        alt="Owner and master barber Jared Jones-Valentine scissor-cutting a client at Barber Shack in Bellingham."
        caption="Classic barbering, modern technique — seven days a week."
      />

      <p className="text-lg leading-relaxed max-w-2xl">{intro}</p>

      {sections.map((s) => (
        <section key={s.heading} className="my-10">
          <h2 className="text-2xl md:text-3xl mb-3">{s.heading}</h2>
          {s.body && <p className="max-w-2xl">{s.body}</p>}
          {s.items && (
            <ul className="mt-4 space-y-3 max-w-2xl">
              {s.items.map((it) => (
                <li key={it.name} className="border-l-2 border-steel/50 pl-4">
                  <span className="display">{it.name}</span>
                  <span className="text-ink/80"> — {it.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <aside className="border border-steel/40 bg-paper p-6 my-12 max-w-2xl">
        <p className="eyebrow mb-2">Prices & booking</p>
        <p className="mb-4">
          Every barbering service is on the board, walk-in or booked — and haircuts are $12 for
          everyone every Tuesday.
        </p>
        <p className="board text-sm flex flex-wrap gap-x-6 gap-y-2">
          <a href={ROUTES.pricing} className="underline underline-offset-4 hover:text-signal">See the price board →</a>
          <a href={ROUTES.services} className="underline underline-offset-4 hover:text-signal">Browse all services →</a>
          <a href={ROUTES.book} className="underline underline-offset-4 hover:text-signal">Book a chair →</a>
        </p>
      </aside>

      <HoursBlock />
      <FaqBlock faqs={FAQS} />
      <CtaBar label={B.city} />
    </>
  );
}
