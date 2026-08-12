/**
 * DEPARTMENT HUB TEMPLATE. One template, N department hubs. Rule 1.
 *
 * These are narrative hubs, NOT price boards: the single services hub lives at
 * /services (Hard Prohibition #2), and every hub links back to it. A department
 * appears here only once it carries real overview copy (isDepartmentPublishable);
 * a [DRAFT] department renders no route and no sitemap entry.
 *
 * dynamicParams = false so only the generated department slugs resolve — this
 * root-level dynamic segment never shadows a real top-level page.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEPARTMENTS, getDepartment, DEPARTMENT_IMAGE } from "@/content/departments";
import { isDepartmentPublishable, cleanFaqs } from "@/lib/publishable";
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
import ContactForm from "@/components/ContactForm";

export const dynamicParams = false;

export function generateStaticParams() {
  return DEPARTMENTS.filter(isDepartmentPublishable).map((d) => ({ department: d.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ department: string }> }
): Promise<Metadata> {
  const { department } = await params;
  const d = getDepartment(department);
  if (!d || !isDepartmentPublishable(d)) return {};
  return {
    title: `${d.name} in ${NAP.cityState}`,
    description: d.answer.slice(0, 155),
    alternates: { canonical: abs(ROUTES.department(d.slug)) },
  };
}

export default async function DepartmentPage(
  { params }: { params: Promise<{ department: string }> }
) {
  const { department } = await params;
  const d = getDepartment(department);
  if (!d || !d.overview || !isDepartmentPublishable(d)) notFound();

  const { intro, sections } = d.overview;
  const faqs = cleanFaqs(d.faqs ?? []);
  const photo = DEPARTMENT_IMAGE[d.slug];
  const cta = d.cta ?? (d.entity === "resident" ? { kind: "studio" as const } : { kind: "services" as const });
  const url = abs(ROUTES.department(d.slug));
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: d.name, item: url },
  ];

  return (
    <>
      <JsonLd graph={pageGraph({ url, name: `${d.name} in ${NAP.cityState}`, description: d.answer, faqs, crumbs })} />
      <Breadcrumbs crumbs={crumbs} />

      {cta.kind === "coming-soon" && <p className="eyebrow mb-2">Coming soon</p>}
      <h1 className="text-4xl md:text-5xl mt-2 mb-4">{d.name}</h1>
      <TrustStrip />
      <AnswerBox>{d.answer}</AnswerBox>

      {photo && (
        <Photo className="my-8" ratio="aspect-[16/10]" src={photo.src} alt={photo.alt} caption={photo.caption} />
      )}

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

      {cta.kind === "coming-soon" ? (
        // Pre-launch program: a real interest form (emails the shop) plus a call
        // option — no booking, no non-functional email field.
        <>
          <section className="bg-ink text-shopwhite px-6 py-10 my-14 rounded-xl">
            <p className="eyebrow mb-2">Ready to start?</p>
            <h2 className="text-3xl mb-3">Ready to start your career in barbering?</h2>
            <p className="mb-5 max-w-xl text-shopwhite/85">{cta.note}</p>
            <a href={`tel:${B.phoneTel}`}
               className="inline-block border-2 border-shopwhite/70 text-white px-7 py-3.5 rounded-lg font-bold uppercase tracking-wide text-sm transition hover:bg-white/10">
              Call {B.phoneDisplay}
            </a>
          </section>
          <ContactForm
            topic="Apprenticeship interest"
            heading="Join the apprenticeship interest list"
            intro="Leave your details and we'll send program updates, tuition information, and early application access."
          />
        </>
      ) : cta.kind === "studio" ? (
        // Independent operator: the shop can't publish their prices on their behalf
        // (participation flags, Registry #30). If they've shared a booking link
        // (bookingLink consent), send clients straight to it; otherwise point them
        // to the shop to reach the studio.
        <aside className="border border-steel/40 bg-paper p-6 my-12 max-w-2xl">
          <p className="eyebrow mb-2">Booking</p>
          {d.bookingUrl && d.participation.bookingLink ? (
            <>
              <p className="mb-4">
                {d.name} is an independent studio inside Barber Shack. Book directly with the artist.
              </p>
              <a href={d.bookingUrl} target="_blank" rel="noopener noreferrer"
                 className="inline-block bg-signal text-white px-7 py-3.5 rounded-lg font-bold uppercase tracking-wide text-sm transition hover:brightness-110">
                Book with the studio →
              </a>
            </>
          ) : (
            <p className="mb-0">
              {d.name} is offered by an independent studio inside Barber Shack. Ask at the shop for
              pricing and to book with the studio directly.
            </p>
          )}
        </aside>
      ) : (
        <aside className="border border-steel/40 bg-paper p-6 my-12 max-w-2xl">
          <p className="eyebrow mb-2">Prices & booking</p>
          <p className="mb-4">Find every service on the board, walk-in or booked.</p>
          <p className="board text-sm flex flex-wrap gap-x-6 gap-y-2">
            <a href={ROUTES.pricing} className="underline underline-offset-4 hover:text-signal">See the price board →</a>
            <a href={ROUTES.services} className="underline underline-offset-4 hover:text-signal">Browse all services →</a>
            <a href={ROUTES.book} className="underline underline-offset-4 hover:text-signal">Book a chair →</a>
          </p>
        </aside>
      )}

      <HoursBlock />
      <FaqBlock faqs={faqs} />
      {cta.kind !== "coming-soon" && <CtaBar label={B.city} />}
    </>
  );
}
