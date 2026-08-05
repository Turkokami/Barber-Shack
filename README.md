# Barber Shack — Smart Site build

Greenfield rebuild. Next.js App Router · TypeScript · Tailwind v4 · Vercel.
Built to the **Smart Site Master Plan v1** (hub-and-spoke, Tier 2.0).

The existing Wix site is a **data source only** — price list, hours, NAP,
photography, and the 702-review corpus. Nothing else carries over.

---

## AGENT: START HERE

1. Read `SPEC.md` in full before writing any code. It is the build contract.
2. Run pre-flight (below) and report the output.
3. Work ticket by ticket. Report PASS/FAIL against each acceptance criterion.
4. Halt at the end of each phase and output the Phase Report from `SPEC.md`.
5. Commit convention: `[P2-04] service spoke template + Service/Offer schema`.

**Never invent a value.** Anything marked `[PLACEHOLDER]` is an open registry item.
`requireResolved()` in `content/business.ts` throws at build time if one reaches a
rendered page. That is deliberate — do not remove the guard or stub past it.

### Pre-flight

```bash
node -v          # 20+
pnpm install     # or npm install
pnpm typecheck
pnpm dev
```

Report: install clean? typecheck clean? dev server up? Which placeholders block the build?

---

## Architecture

```
content/     typed data — the ONLY source of business facts
  business.ts      the constants file (Rule 2). Nothing here is typed twice elsewhere.
  services.ts      10 barbering spokes
  community.ts     the brand thesis — $12 Tuesdays, Autism Walk, vouchers, Rainbow Bridge
  departments.ts   house vs. RESIDENT studios + the participation consent gate
  neighborhoods.ts 10 Bellingham rows, gated
  barbers.ts       chair roster
  specialists.ts   named-expert E-E-A-T layer — Person entities with WA license numbers

lib/
  schema.ts        the ONLY JSON-LD emitter. No page writes schema inline.
  publishable.ts   Rule 5 enforced in code — gates routes AND sitemap
  routes.ts        canonical URL helpers

components/      14 shared components. Never inline a one-off.
app/             routes. Templates, not hand-built pages.
```

### The three rules that matter most here

**Rule 1 — templates, not pages.** Every repeatable route type is a template plus a
data row. This is what capped the NYE build at Tier 2.0 and it is not negotiable.

**Rule 2 — one source of business facts.** No name, phone, address, or hours string
literal appears outside `content/business.ts`.

**Rule 5 — the publish gate.** A neighborhood row under 400 unique words produces no
route and enters no sitemap. `isPublishable()` feeds both `generateStaticParams()`
and `sitemap.ts`. A thin geo page is worse than no geo page.

---

## What is already built

| | Status |
|---|---|
| Constants file with build-time placeholder guard | done |
| `lib/schema.ts` — root nodes, 7-node page graph, Service+Offer, department nodes | done |
| `lib/publishable.ts` + `publishReport()` | done |
| 14 shared components (incl. ExpertBlock) | done |
| Root layout, home (T1) | done |
| Service spoke template (T2) — drives 10 routes | done |
| Neighborhood template (T5) — gated, drives 10 routes | done |
| `sitemap.ts`, `robots.ts`, redirect stub | done |
| Design tokens + the price board signature | done |

**Not yet built:** services hub, pricing hub, community hub + 6 program pages,
4 department hubs, accessibility page, intent pages, city pages, barber pages,
book/reviews/about/contact, blog. All specified in `SPEC.md`.

> This scaffold has not been compiled — it was authored in an offline environment
> with no package registry. Expect to resolve import and type nits on first
> `pnpm typecheck`. The architecture is the deliverable; the wiring is trivial.

---

## Design direction

Shop signage, not barber-lounge luxury. The premium-craft look (charcoal, gold,
vintage badge, serif display) belongs to Machete and tells the wrong story for a
shop whose thesis is "everyone is welcome and Tuesday is $12."

- **Ink** `#12161B` · **Shop white** `#ECEEEF` · **Signal red** `#C8102E` · **Steel** `#2E5C8A` · **Chrome** `#8C949C`
- Archivo (display) / Karla (body) / JetBrains Mono (data)
- **Signature: the price board.** Prices set as tabular data on a ruled board,
  because the price *is* the message — and it is the visual half of the Offer schema.

---

## Tone rule

From Jared: *community hub first, barbershop second.*

$12 Tuesdays is an **access program**, not a discount promotion. It exists for
single parents, people on Social Security or state assistance, and job seekers
getting ready to go back to work. Never frame it as "cheap haircuts," never imply
anyone has to qualify, never write it in a marketing register.

**The test:** if a line would embarrass the shop at the Autism Walk booth, rewrite it.

## Named voice

Shaquana — licensed cosmetologist, barber, and instructor — is the named expert for the
textured hair, apprenticeship, toupee, and salon clusters. `ExpertBlock` pulls her via
`voiceFor(cluster)`. **Her bio is published in her own first-person words and is never
rewritten into marketing voice.**

Her name is spelled **Shaquana** — as she spells it herself. That spelling is
authoritative and appears nowhere in this repo in any other form. Do not normalise it,
do not let a find-and-replace touch it.

She is an **independent operator**, not an employee — see `SPEC.md` Amendment C.

## The consent gate

Barber Shack runs the standard barbershop model: independent operators working out of
the shop. The shop is the hub and the front door; each specialty is its own business.

`content/departments.ts` carries a `participation` block per resident studio and
**every flag defaults to false. Silence is not consent.** `mayPublish()` gates every
template. A resident's price, face, license number, or booking link cannot render until
that operator agrees in writing (registry #30).

Never emit `employee` or `department` for a resident. `containedInPlace` is the only
accurate relationship, and accurate structured data is the entire point of the layer.
