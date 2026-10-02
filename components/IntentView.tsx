/**
 * TEMPLATE T3 — INTENT PAGE (shared view).
 * Fixed block order: AnswerBox → the specific answer → proof → booking →
 * related services → FaqBlock → CtaBar. One view, N thin route files. Rule 1.
 */
import { BUSINESS as B, tuesdayRate } from "@/content/business";
import { getService } from "@/content/services";
import type { Intent } from "@/content/intents";
import { abs, ROUTES } from "@/lib/routes";
import { pageGraph } from "@/lib/schema";
import { cleanFaqs } from "@/lib/publishable";
import { fillRate } from "@/content/business";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerBox from "@/components/AnswerBox";
import TrustStrip from "@/components/TrustStrip";
import CommunityNote from "@/components/CommunityNote";
import BookingEmbed from "@/components/BookingEmbed";
import Photo from "@/components/Photo";
import FaqBlock from "@/components/FaqBlock";
import CtaBar from "@/components/CtaBar";

export default function IntentView({ intent }: { intent: Intent }) {
  const url = abs(ROUTES.intent(intent.slug));
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: intent.h1, item: url },
  ];
  // Rate tokens resolve per render — see tuesdayRate() in content/business.ts.
  const answer = fillRate(intent.answer);
  const faqs = cleanFaqs(intent.faqs).map((f) => ({ q: fillRate(f.q), a: fillRate(f.a) }));

  return (
    <>
      <JsonLd graph={pageGraph({ url, name: intent.title, description: answer, faqs, crumbs })} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-4xl md:text-5xl mt-2 mb-4">{intent.h1}</h1>
      <TrustStrip />
      <AnswerBox>{answer}</AnswerBox>

      {intent.image && (
        <Photo
          className="my-8"
          ratio="aspect-[16/10]"
          src={intent.image.src}
          alt={intent.image.alt}
        />
      )}

      <section className="my-10 max-w-2xl">
        {fillRate(intent.body).split("\n\n").map((p, i) => (
          <p key={i} className="mb-4">{p}</p>
        ))}
      </section>

      <CommunityNote>
        Our standard haircuts are ${tuesdayRate()} on Tuesdays, all day. The program exists for single parents,
        people on Social Security or state assistance, and anyone getting ready to go back to work —
        but nobody is asked to qualify, and there is no separate line.
      </CommunityNote>

      <BookingEmbed />

      <section className="my-10">
        <p className="eyebrow mb-3">Related services</p>
        <ul className="space-y-2">
          {intent.related.map((s) => {
            const svc = getService(s);
            return svc ? (
              <li key={s}>
                <a href={ROUTES.service(s)} className="underline underline-offset-4">{svc.name}</a>
              </li>
            ) : null;
          })}
        </ul>
      </section>

      <FaqBlock faqs={faqs} />
      <CtaBar label={B.city} />
    </>
  );
}
