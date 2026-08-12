/**
 * MASTER PLAN RULE 5, ENFORCED IN CODE.
 *
 * "If the data to write it does not exist, do not publish the page."
 * A thin geo page is worse than no geo page.
 *
 * This gate feeds BOTH generateStaticParams() and sitemap.ts, which makes
 * shipping a thin page structurally impossible rather than a matter of discipline.
 */
import type { Neighborhood } from "@/content/neighborhoods";
import type { CommunityProgram } from "@/content/community";
import type { Intent } from "@/content/intents";
import type { Department } from "@/content/departments";

export const FLOOR = { neighborhood: 400, neighborhoodService: 300, intent: 400 } as const;

export const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export const hasPlaceholder = (s: string) => /\[(PLACEHOLDER|DRAFT|CONFIRM)/.test(s);

/** A FAQ is only publishable if its answer carries no unresolved placeholder. */
export const cleanFaqs = <T extends { q: string; a: string }>(faqs: T[]): T[] =>
  faqs.filter((f) => !hasPlaceholder(f.a));

/**
 * A community program publishes only when its body is real (no [DRAFT]) — the
 * answer/who fields can surface on the hub, but the full page needs written copy.
 */
export function isProgramPublishable(p: CommunityProgram): boolean {
  return wordCount(p.body) >= 20 && !hasPlaceholder(p.body);
}

/** Intent page: the T3 payload must be genuinely written, 400+ unique words. */
export function isIntentPublishable(i: Intent): boolean {
  return (
    wordCount(i.body) >= FLOOR.intent &&
    !hasPlaceholder(i.body) &&
    i.related.length >= 1
  );
}

/**
 * A department hub publishes once it carries real overview copy (an intro plus at
 * least one written section) with no unresolved placeholder in any rendered field,
 * and its AEO answer is clean too.
 *
 * NOTE on consent: the operator's `participation` flags gate specific ITEMS
 * (prices, bio/photo, license, booking) — those are render-gated in the template
 * (e.g. the booking button only shows when participation.bookingLink is true), and
 * the template never renders prices/bio/photo/license at all. This gate governs
 * copy-readiness; it does not, and should not, publish any of those gated items.
 */
export function isDepartmentPublishable(d: Department): boolean {
  const o = d.overview;
  if (!o || o.sections.length < 1) return false;
  if (wordCount(o.intro) < 15 || hasPlaceholder(o.intro)) return false;
  if (hasPlaceholder(d.answer)) return false;
  for (const s of o.sections) {
    if (hasPlaceholder(s.heading)) return false;
    if (s.body && hasPlaceholder(s.body)) return false;
    for (const it of s.items ?? []) {
      if (hasPlaceholder(it.name) || hasPlaceholder(it.detail)) return false;
    }
  }
  return true;
}

export function isPublishable(n: Neighborhood): boolean {
  return (
    wordCount(n.localContext) >= FLOOR.neighborhood &&
    !hasPlaceholder(n.localContext) &&
    n.landmarks.length >= 2 &&
    n.siblings.length === 2 &&
    n.services.length === 3
  );
}

/** Reports which rows were withheld and why — feeds the Phase Report. */
export function publishReport(rows: Neighborhood[]) {
  return rows.map((n) => ({
    slug: n.slug,
    words: wordCount(n.localContext),
    passes: isPublishable(n),
    reason: isPublishable(n)
      ? "ok"
      : wordCount(n.localContext) < FLOOR.neighborhood
        ? `under floor (${wordCount(n.localContext)}/${FLOOR.neighborhood} words)`
        : hasPlaceholder(n.localContext)
          ? "unresolved placeholder in localContext"
          : "missing landmarks, siblings, or services",
  }));
}
