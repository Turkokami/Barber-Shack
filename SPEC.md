# BARBER SHACK — GREENFIELD BUILD SPECIFICATION
**Stack:** Next.js (App Router) · TypeScript · Tailwind · Vercel
**Framework:** Smart Site Master Plan v1 — hub-and-spoke, Tier 2.0
**Model:** Ground-up rebuild. The existing Wix site is a **data source only**, not a migration target.
**Prepared for:** Claude Cowork execution
**Issued:** August 1, 2026 · Supersedes the Wix remediation spec

---

## AMENDMENT A — OWNER BRIEF (Jared), August 1 2026

**This amendment overrides the positioning, page inventory, and scoring below where they conflict.**

### A.1 The thesis changed

Barber Shack is **a community hub first and a barbershop second.** That is not a
marketing layer bolted onto a haircut business — it is the reason the business exists,
and it outranks every commercial consideration in this build.

**$12 Tuesdays is an access program, not a discount promotion.** It exists for single
parents, people on Social Security or state assistance, and job seekers getting ready
to re-enter the workforce. A sharp haircut changes how you walk into a room, and
financial hardship should not stand between anyone and that.

> **Retire `/cheap-haircut-bellingham/`.** It was specced before this brief and it is
> now off-brand. "Cheap haircuts" is the wrong frame for an access program. Replace it
> with `/community/12-dollar-tuesdays/`, written in the register of the program itself.
> Never imply anyone has to qualify. There is no separate line.

**Tone test for every page in this build:** if a line would embarrass the shop at the
Autism Walk booth, rewrite it.

### A.2 The sensory-friendly position is now substantiated

The original spec built that cluster on a single customer review, with a warning not to
overclaim. It now rests on a **standing annual Autism Walk booth** — a real, verifiable,
multi-year community commitment. That moves it from a promising content angle to a
genuine E-E-A-T asset.

The overclaim prohibition still stands. Written owner sign-off on every operational
practice before publish. No claimed certification, training, or clinical competency.

### A.3 Five new clusters

This is not a single-service barbershop. Each department needs its own hub, spokes,
and schema node (`department` on the root `LocalBusiness`).

| Cluster | Routes | Schema type | Note |
|---|---|---|---|
| **Community hub** + 6 programs | 7 | `Organization` / `Event` | $12 Tuesdays · Autism Walk · Back-to-school · Haircut vouchers · Rainbow Bridge · Art Wall |
| **Toupee studio** | 6–8 | `HealthAndBeautyBusiness` | **Highest-value unbuilt cluster.** High ticket, high intent, long consideration, near-zero local competition. Own vocabulary: hair system, hairpiece, non-surgical replacement, topper. Prioritise in Phase 2. |
| **Tattoo studio** | 5–7 | `TattooParlor` | Tattoo search is **artist-led, not shop-led.** Per-artist pages with portfolio and booking, or the cluster will not rank. Confirm WA licensing display requirements. |
| **Full salon** | 6–8 | `HairSalon` | Currently invisible. Anyone searching salon terms has no reason to find this shop. |
| **Apprentice program** | 2–3 | `EducationalOrganization` | Two audiences, split them: prospective apprentices (recruiting) and customers (credibility). A shop that teaches the trade is treated as an authority in it. |
| **Accessibility** | 1 | — | Wheelchair accessible + sensory-friendly. A fact about the business, not a footer line. Carries `amenityFeature` nodes. |

### A.4 The Rainbow Bridge

Barber Shack was the driving force behind the **Rainbow Bridge on Northwest Avenue.**
This is the strongest link-earning and local-press asset on the entire site — a physical,
permanent, photographable landmark the shop actually built. It gets a real page with the
origin story, not a line on the About page. Treat it accordingly.

### A.5 Revised targets

| | Original spec | Amended |
|---|---|---|
| Routes | 52 | **~72** |
| Services | 5 | 5 |
| Local | 4 | 4 |
| E-E-A-T | 4 | **5** — apprentice program, named barbers, multi-year community record |
| Reviews | 4 | 4 *(unchanged — the 4.5 display rating is still the constraint)* |
| Schema | 5 | 5 |
| Content | 5 | 5 |
| Design | 4 | 4 |
| Convert | 5 | 5 |
| **Average** | **4.50** | **4.63** |

4.63 would rank first in the benchmark set, ahead of both Sasquatch properties.

### A.6 New registry items

| # | Item | Blocks | Source |
|---|---|---|---|
| 14 | Salon service list and pricing | salon cluster | Jared |
| 15 | Toupee studio services, process, pricing model | toupee cluster | Jared |
| 16 | Tattoo artists — names, portfolios, booking, WA license numbers | tattoo cluster | Jared |
| 17 | Apprentice program structure, WA licensing and hour requirements | apprenticeship | Jared / WA Dept. of Licensing |
| 18 | Autism Walk — organising body, years running, booth activity | community | Jared |
| 19 | Shelter and agency partner names *(with written permission before publishing any partner name)* | vouchers | Jared |
| 20 | Rainbow Bridge — origin story, people involved, build date, photos | community | Jared |
| 21 | Community Art Wall — how an artist gets on the wall | community | Jared |
| 22 | Confirmed sensory-friendly practices | accessibility | **Jared, in writing** |
| 23 | Which services the $12 Tuesday rate covers | pricing | Jared |

---

---

## AMENDMENT B — NAMED SPECIALIST: SHAQUANA, August 1 2026

**Resolves the authorship of three unbuilt clusters at once and adds a fourth.**

### B.1 Who she is

Licensed cosmetologist · trained barber **from The Barber Shack** · professional braider ·
loctician · **licensed instructor**. Specializes in creative braid styles, healthy loc care,
and textured hair across all lengths and textures. Teaches textured hair and barbering.
Building the apprenticeship program from the ground up. Co-creating the toupee business
with a fellow industry professional.

> **The loop is the story.** She trained at The Barber Shack, became licensed, and now
> teaches there and is building the program that trains the next barber. That is the
> single strongest piece of evidence the apprentice program works — stronger than any
> claim the shop could make about itself. Lead the apprenticeship cluster with it.

### B.2 She is the named voice for four clusters

Master Plan's on-page contract wants *one credentialed named voice, in first person,
with the license number displayed, carried consistently across the site.* Shaquana is
that voice for:

| Cluster | Her standing |
|---|---|
| **Textured hair, braids & locs** | Professional braider and loctician who teaches the discipline |
| **Apprenticeship** | Licensed instructor; built the program; is its own proof of concept |
| **Toupee studio** | Co-founder |
| **Full salon** | Licensed cosmetologist |

`ExpertBlock` pulls her automatically via `voiceFor(cluster)`. Her bio is published in
**her own first-person words** and is never rewritten into marketing voice.

### B.3 NEW CLUSTER — textured hair, braids & locs

**This is the most underserved cluster in the market, and it is also the inclusivity
thesis made literal.** A shop that says everyone is welcome and can actually do
everyone's hair is making a materially different claim than one that only says it.

Whatcom County has very thin textured-hair provision. People routinely drive to Seattle
for braids and loc care. Searchers use highly specific terms — knotless braids, retwist,
starter locs, silk press, protective styles, natural cuts — that **no local competitor
targets at all.**

Build in Phase 2, alongside the toupee studio. Estimated 8–12 routes: a cluster hub,
per-style service pages, a loc-care library, and a "traveling from out of area" page
aimed at the Seattle-drive searcher.

### B.4 Two gates that must clear before anything ships

**GATE 1 — name spelling. Registry #24: RESOLVED.** The name is **Shaquana**, spelled as
she spells it herself. This is now locked in `content/specialists.ts` and is the only
spelling permitted anywhere in the build — in copy, in schema, in image alt text, in
filenames, in commit messages. Do not normalise it, do not "correct" it, and do not let
a spellchecker or a find-and-replace touch it. A person's own spelling of their own name
is authoritative, and a Person entity that misspells its subject is worse than no Person
entity at all.

*Optional, non-blocking:* a surname if she uses one professionally. Useful for license
verification and for disambiguating her across the web, but the cluster ships without it.

**GATE 2 — toupee business entity structure.** She describes *creating a toupee business*
with a fellow professional. That may be a **separate legal entity operating under the
Barber Shack roof**, not a Barber Shack department. This is exactly the entity-hygiene
question the Master Plan treats as foundational, and it changes the schema:

**RESOLVED in Amendment C** — its own entity, operating as an independent resident of
Barber Shack. Modelled as `containedInPlace`, on the Barber Shack domain, with a consent
gate on everything published about it. See Amendment C.

### B.5 Registry additions

| # | Item | Blocks | Source |
|---|---|---|---|
| 24 | ~~Name spelling~~ **RESOLVED — "Shaquana"** | — | Closed |
| 24b | Surname, if used professionally *(optional, non-blocking)* | license verification | Shaquana |
| 25 | WA cosmetologist, barber, and instructor license numbers | `hasCredential` nodes | Shaquana / WA DOL |
| 26 | Textured hair service list and pricing | textured-hair cluster | Shaquana |
| 27 | Toupee business — legal entity structure and partner | **Gate 2**, toupee cluster | Shaquana / Jared |
| 28 | Apprenticeship program structure, intake, WA hour requirements | apprenticeship cluster | Shaquana |
| 29 | Photograph | Person node, bio page | Shaquana |

### B.6 Revised targets

| | Amendment A | Amendment B |
|---|---|---|
| Routes | ~72 | **~82** |
| E-E-A-T | 5 | 5 *(now genuinely earned — a licensed instructor with displayed license numbers, not a claimed voice)* |
| Services | 5 | 5 |
| **Average** | **4.63** | **4.63** |

The score does not move, because Amendment A had already taken E-E-A-T to its ceiling on
the strength of the apprentice program. What changes is that the ceiling is now
**defensible** — an actual licensed instructor with verifiable credentials, rather than a
program described in the third person. That is the difference between scoring a 5 and
holding a 5 under scrutiny.

---

---

## AMENDMENT C — OPERATING MODEL: INDEPENDENT RESIDENTS, August 1 2026

**Barber Shack is the hub. The specialties are spokes run by independent operators,
several of them their own legal entities.** This is the standard barbershop model, and
it changes the entity graph, the pricing architecture, and what may lawfully be
published on the site. It also invalidates two things Amendments A and B got wrong.

### C.1 What was wrong, and is now corrected

| Was | Why it was wrong | Now |
|---|---|---|
| `department` nodes on the root `LocalBusiness` | Implies Barber Shack operates them. It does not. | `containsPlace` / `containedInPlace` |
| `employee: [SPECIALISTS]` on the root business | **Materially inaccurate.** For licensed trades, misstating staff vs. independent contractor also misstates liability. | Removed. Each operator is their own `LocalBusiness`. |
| `Person.worksFor` → Barber Shack | She does not work for the shop. | `workLocation` → shop; `alumniOf` → shop *(separately true, and the strongest signal on the node)* |
| Sitewide price board covering all services | The shop cannot set an independent operator's price | House prices only, plus opted-in resident prices |

Barber Shack is the **venue, the brand, and the front door**. Nobody is anybody's
subsidiary and nobody is anybody's employee. `containedInPlace` is the only relationship
that is accurate, and accurate structured data is the whole point of the layer.

### C.2 The consent layer — `participation`

Every resident studio in `content/departments.ts` carries a participation block, and
**every flag defaults to `false`. Silence is not consent.**

```ts
participation: {
  listPrices:      false,  // may we publish their prices + Offer schema?
  tuesdayProgram:  false,  // do they participate in $12 Tuesdays?
  bioAndPhoto:     false,  // may we publish their name, bio, photo?
  licenseDisplay:  false,  // may we display their license number?
  bookingLink:     false,  // may we link to their booking platform?
}
```

`mayPublish(department, field)` gates every template. A resident's price, face, licence
number, or booking link cannot render until the flag is flipped, and the flag is only
flipped on **written agreement from that operator.** Registry #30.

This is not bureaucracy. Publishing an independent business's price without their
agreement is a live exposure, and `Offer` schema attributing that price to Barber Shack
is inaccurate structured data attached to the wrong entity.

### C.3 Consequences for the three assets

**$12 Tuesdays.** The shop cannot promise $12 across chairs it does not control. Two
honest paths — pick one and write it exactly:

- *Shop-wide, with buy-in.* Every operator signs on, and the page says "every chair."
  Strongest version. Requires all of them.
- *Named participation.* The page says which chairs honour it. Less clean, still true,
  and still far ahead of a competitor who never mentions price at all.

**Never write "$12 haircuts at Barber Shack" if any chair does not honour it.** The
program's whole credibility is that it is unconditional. A customer turned away at the
chair after reading the page does more damage than the page ever earned.

**The price board.** Splits into house prices *(shop sets, always publishable)* and
resident prices *(operator sets, opt-in only)*. The board should say which is which —
"prices set by the studio" is a normal, honest line in this industry and readers
understand it immediately.

**Booking.** Each operator may already keep their own book on their own platform. Do not
force them onto one system; the site routes to whatever they use. This is exactly why
Machete lives on The Cut app. The acceptance-gate requirement stays *booking reachable in
one tap* — it does not require a single booking system.

### C.4 The opportunity nobody in this market is using

Independently-branded practitioners at a shared address **may each hold their own Google
Business Profile**, provided each is publicly reachable and independently branded.

Executed properly, that turns one local-pack entry into several, across categories the
shop cannot rank for on a single listing — a barbershop listing does not compete for
braid or loc queries, but a braiding studio listing does.

Executed sloppily it is a duplicate-listing violation that damages everyone at the
address. **Do not open a single additional GBP until the eligibility rules are read in
full and each operator genuinely meets them** — distinct branding, distinct category,
distinct public contact, staffed hours. This is upside, not a shortcut. Registry #31.

### C.5 Reviews stay with the shop

The 702 reviews belong to the Barber Shack GBP and stay on the root `LocalBusiness`
`aggregateRating`. They are not attributed to any resident studio node. A resident
studio's own rating only appears once that studio has its own verified profile with its
own reviews.

### C.6 Registry additions

| # | Item | Blocks | Source |
|---|---|---|---|
| 27 | ~~Toupee entity structure~~ **RESOLVED — independent resident, `containedInPlace`** | — | Closed |
| 30 | **Signed participation agreement per resident operator** — prices, Tuesday program, bio and photo, licence display, booking link | every resident cluster | Each operator, in writing |
| 31 | GBP eligibility review per operator before any additional listing | local strategy | Jared + each operator |
| 32 | Which chairs honour $12 Tuesdays | pricing, community cluster | Jared + all operators |
| 33 | Each resident studio's legal/trading name, own phone, own site if any | `residentNode` | Each operator |

### C.7 Tier is unchanged

Multiple resident entities at one address is **not** Smart Site 3.0. 3.0 is multi-market
and multi-location. This is a single-location Tier 2.0 build with a richer entity graph.
Do not inflate the tier — the geographic surface is what would earn 3.0, and there is
only one location.

---

## 0. HOW TO USE THIS DOCUMENT

> **Instructions to the executing agent.** This is a build contract. Work in ticket order. Each
> ticket has acceptance criteria — report PASS or FAIL against each one explicitly. Do not mark a
> ticket complete on partial satisfaction. After each phase, halt and output the Phase Report
> (§12) before continuing.
>
> **Commit convention:** `[P2-04] service spoke template + Service/Offer schema` — ticket ID first,
> one commit per ticket.
>
> Where this document says **[PLACEHOLDER]**, the value is not known. **Do not invent it.** Log it
> in §11, halt that ticket, continue with the rest of the phase.

**Governing rules.** All ten Global Build Rules and five Smart Build Standards from Master Plan v1
apply. Where this document and the Master Plan conflict, the Master Plan wins.

---

## 1. WHY GREENFIELD

The decision is made; this section exists so the reasoning survives the handoff.

| | Wix remediation | Greenfield Next.js |
|---|---|---|
| **Rule 1 (data-driven templating)** | Not satisfiable — 10 neighborhood pages hand-assembled in an editor will drift | Native. One template, one data file, N pages |
| **Schema control** | Fighting Wix's built-in emitter for duplicate nodes | Total. `lib/schema.ts` is the single source |
| **Performance gate (LCP < 2.5s)** | Fighting a 2016 template | Static-generated, edge-served, trivially green |
| **Build velocity** | Editor-bound, one page at a time | 52 pages from ~8 templates |
| **Ceiling** | Capped around 3.5 on the rubric | 4.50 |

**This is the same failure that capped NYE at Smart Site 2.0** — hand-built pages across two
Elementor versions, unable to scale past ~150 URLs. Do not repeat it here.

**What the old site is for:** extracting the price list, the hours, the address, the review corpus,
and any usable photography. Nothing else. No URL structure, no copy, no template, no assets that
carry Wix branding, and none of the three unedited Wix demo blog posts.

---

## 2. TARGET STATE

| | Now | Full build |
|---|---|---|
| **Score** (8-dim rubric, 1–5) | **1.50** | **4.50** |
| Pages | 3 | 52 |
| Platform | Wix, 2016 template | Next.js App Router on Vercel |
| Structured data | Zero | 7-node `@graph`, every page |
| Booking | None | One tap from every page |

**Dimension movement:** Services 1→5 · Local 1→4 · E-E-A-T 1→4 · Reviews 4→4 · Schema 1→5 ·
Content 1→5 · Design 2→4 · Convert 1→5.

**Reviews is the honest constraint.** 702 reviews is a genuine asset — second-highest count in
Whatcom County — but the 4.5 display rating is the leak. Roughly **78 consecutive 5-stars to move
the display to 4.6**; roughly **702 more to reach parity with V's at 4.8**. 4.6 in a quarter is
realistic; anything promising 4.8 quickly is selling something. Past 4.6, the play shifts from
raising the rating to **outweighing it with surface area** — which is what the geo and content
clusters exist to do.

---

## 3. THE POSITIONING SPINE

Every page ladders to one of three assets no competitor can copy quickly.

| Asset | Now | Becomes |
|---|---|---|
| **$12 Tuesdays** | One line of unlinked hero text | A dedicated page, a pricing hub, `Offer` schema on every service, a weekly GBP post. Against a market where competitor reviews report $53 for a kid's cut, this is roughly a quarter of the going rate — and it is currently **invisible at the moment of decision.** |
| **Open 7 days incl. Sunday** | Buried in hours | A dedicated page plus an hours block on every service and geo page. Most of the craft tier closes Sunday *and* Monday. V's and Chestnut carry documented walk-in refusals in reviews. |
| **Sensory-friendly capability** | Surfaced organically in one customer review | The flagship position. **Zero competitors claim this territory anywhere in Whatcom County.** |

**Market context.** Machete (4.9★, 224) has **no website at all**. Old 99 (4.7★, 282) runs a bare
Square subdomain. V's (4.8★, 1,088) has inherited franchise scaffolding with zero local content.
Eleven scraper directories currently rank for Bellingham barber queries. **The seat is empty.**

> **Handling note — sensory-friendly cluster.** Write it for the family, not the algorithm. State
> plainly what the shop actually does: quiet chair, no wait, same barber each visit, clipper-free
> options, parent stays in the chair — whatever is genuinely true. **Do not claim a certification,
> training, or clinical competency the shop does not hold.** Do not imply medical expertise. The
> credibility comes from specificity and honesty, and a single overclaim destroys the asset.
> Owner sign-off in writing on every operational claim before publish.

---

## 4. REPO SCAFFOLD

```
barber-shack/
├─ app/
│  ├─ layout.tsx                      root layout, StickyCall, TrustStrip, footer
│  ├─ page.tsx                        home / hub
│  ├─ sitemap.ts
│  ├─ robots.ts
│  ├─ not-found.tsx
│  ├─ services/
│  │  ├─ page.tsx                     services hub (single — never two)
│  │  └─ [service]/page.tsx           10 spokes
│  ├─ pricing/page.tsx
│  ├─ locations/
│  │  ├─ bellingham/
│  │  │  ├─ page.tsx
│  │  │  └─ [neighborhood]/page.tsx   10
│  │  └─ [city]/page.tsx              Ferndale, Lynden
│  ├─ barbers/
│  │  ├─ page.tsx
│  │  └─ [barber]/page.tsx            6, each a Person entity
│  ├─ (intent)/
│  │  ├─ sensory-friendly-haircuts/page.tsx
│  │  ├─ 12-dollar-tuesdays/page.tsx
│  │  ├─ walk-in-barber-bellingham/page.tsx
│  │  ├─ sunday-haircut-bellingham/page.tsx
│  │  ├─ first-haircut-toddler/page.tsx
│  │  ├─ same-day-haircut-bellingham/page.tsx
│  │  ├─ back-to-school-haircuts/page.tsx
│  │  └─ cheap-haircut-bellingham/page.tsx
│  ├─ book/page.tsx
│  ├─ reviews/page.tsx
│  ├─ gallery/page.tsx
│  ├─ about/page.tsx
│  ├─ contact/page.tsx
│  └─ blog/[slug]/page.tsx            12 at launch
├─ content/
│  ├─ business.ts                     THE CONSTANTS FILE — single source of truth
│  ├─ services.ts
│  ├─ neighborhoods.ts
│  ├─ cities.ts
│  ├─ barbers.ts
│  ├─ intents.ts
│  └─ posts/                          MDX
├─ components/
│  ├─ JsonLd.tsx          AnswerBox.tsx       FaqBlock.tsx
│  ├─ PriceTable.tsx      BarberCard.tsx      TrustStrip.tsx
│  ├─ CtaBar.tsx          StickyCall.tsx      Breadcrumbs.tsx
│  ├─ HoursBlock.tsx      BookingEmbed.tsx    ReviewPull.tsx
├─ lib/
│  ├─ schema.ts                       every @graph builder
│  ├─ publishable.ts                  the Rule 5 gate
│  └─ routes.ts                       canonical URL helpers
└─ next.config.ts                     redirects() — legacy Wix URL map
```

**Component discipline.** Thirteen components carry the entire site. If a page needs a component
that does not exist, add it to this list first — never inline a one-off.

---

## 5. THE CONSTANTS FILE

`content/business.ts` is the only place any of these values exist. Rule 2 is enforced by the type
system: no string literal for name, phone, address, or hours appears anywhere else in the repo.

```ts
export const BUSINESS = {
  name:        "Barber Shack",
  legalName:   "[PLACEHOLDER]",
  url:         "https://bellinghambarbershack.com",
  street:      "2500 Cedarwood Ave",
  city:        "Bellingham",
  region:      "WA",
  postal:      "98225",
  country:     "US",
  phoneDisplay:"[PLACEHOLDER]",
  phoneTel:    "[PLACEHOLDER]",           // +1XXXXXXXXXX
  email:       "[PLACEHOLDER]",           // @bellinghambarbershack.com — NOT gmail
  founded:     "[PLACEHOLDER]",
  owner:       "[PLACEHOLDER]",
  geo:         { lat: "[PLACEHOLDER]", lng: "[PLACEHOLDER]" },
  hours:       "[PLACEHOLDER — all 7 days explicitly]",
  priceRange:  "$",
  rating:      "4.5",
  reviewCount: "702",
  gbpUrl:      "[PLACEHOLDER]",
  reviewUrl:   "[PLACEHOLDER]",           // CID link for QR cards
  sameAs:      ["[PLACEHOLDER — GBP, Facebook, Instagram]"],
} as const;
```

**Rule 9 enforcement.** Once locked, NAP is identical character for character on-site, in schema,
in GBP, and in every directory. Audit all three before Phase 3.

---

## 6. SCHEMA LAYER

`lib/schema.ts` is the single emitter. No page writes JSON-LD inline. Subtype is **`HairSalon`** —
schema.org has no `BarberShop` type; do not invent one.

```ts
import { BUSINESS as B } from "@/content/business";

export const ID = {
  website:  `${B.url}/#website`,
  business: `${B.url}/#localbusiness`,
  logo:     `${B.url}/#logo`,
  barber:   (slug: string) => `${B.url}/#barber-${slug}`,
};

export function rootNodes() {
  return [
    { "@type": "WebSite", "@id": ID.website, url: `${B.url}/`, name: B.name,
      publisher: { "@id": ID.business } },
    { "@type": ["LocalBusiness", "HairSalon"], "@id": ID.business,
      name: B.name, url: `${B.url}/`, telephone: B.phoneTel, email: B.email,
      priceRange: B.priceRange,
      address: { "@type": "PostalAddress", streetAddress: B.street,
        addressLocality: B.city, addressRegion: B.region,
        postalCode: B.postal, addressCountry: B.country },
      geo: { "@type": "GeoCoordinates", latitude: B.geo.lat, longitude: B.geo.lng },
      openingHoursSpecification: B.hours,
      areaServed: [
        { "@type": "City", name: "Bellingham" },
        { "@type": "City", name: "Ferndale" },
        { "@type": "City", name: "Lynden" },
        { "@type": "AdministrativeArea", name: "Whatcom County" },
      ],
      aggregateRating: { "@type": "AggregateRating",
        ratingValue: B.rating, reviewCount: B.reviewCount },
      sameAs: B.sameAs },
  ];
}

// 7-node page graph: WebSite, WebPage, ImageObject, LocalBusiness,
// Service|BlogPosting, FAQPage, BreadcrumbList
export function pageGraph(opts: {
  url: string; name: string; description: string; image: string;
  primary?: object;                        // Service | BlogPosting | Person
  faqs?: { q: string; a: string }[];
  crumbs: { name: string; item: string }[];
}) { /* … */ }
```

### 6.1 The single highest-leverage decision

Every service spoke emits a `Service` node with `offers` → `Offer` → `price`. **This is what makes
the $12 Tuesday wedge machine-readable.** Right now the price advantage is invisible at the moment
of decision; `Offer` schema is what makes it visible to both Google and answer engines.

```ts
{
  "@type": "Service", "@id": `${url}#service`,
  name: svc.name, serviceType: svc.type,
  provider: { "@id": ID.business },
  areaServed: { "@type": "City", name: "Bellingham" },
  offers: {
    "@type": "Offer", price: svc.price, priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    ...(svc.tuesdayPrice && { priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: svc.tuesdayPrice, priceCurrency: "USD",
      validThrough: "[recurring — Tuesdays]" }})
  }
}
```

**Hard rules.** `aggregateRating` comes from the verified GBP figure only, never hand-entered.
Barber pages add a `Person` node referenced as `employee` from the LocalBusiness. Validate every
graph in Rich Results Test before publish.

---

## 7. DATA LAYER & THE PUBLISH GATE

Every repeatable page type is a template plus a typed data row. Rule 1 is not negotiable.

```ts
// content/neighborhoods.ts
export type Neighborhood = {
  slug: string;
  name: string;
  city: "Bellingham";
  localContext: string;      // 400+ words genuinely unique — the Rule 5 payload
  landmarks: string[];
  driveTimeMin: number;
  siblings: string[];        // exactly 2, for lateral linking
  services: string[];        // 3 slugs, for downward linking
};
```

```ts
// lib/publishable.ts
export function isPublishable(n: Neighborhood): boolean {
  return wordCount(n.localContext) >= 400
      && n.landmarks.length >= 2
      && n.siblings.length === 2;
}
```

**`isPublishable()` gates both `generateStaticParams()` and `sitemap.ts`.** A neighborhood row that
fails the gate does not become a route and does not enter the sitemap. This is Master Plan Rule 5
enforced in code rather than in discipline — a thin geo page is worse than no geo page, and this
makes shipping one structurally impossible.

Neighborhoods (10): Cordata · Barkley · Fairhaven · Sunnyland · York · Columbia · Happy Valley ·
Birchwood · Silver Beach · Bakerview/Guide Meridian.

Services (10): Men's haircut · Kids' haircut · Fade · Buzz cut · Beard trim & shaping ·
Hot towel straight-razor shave · Line-up/edge-up · Senior cut · Military & regulation cut ·
Wash & style.

---

## 8. PAGE TEMPLATE CONTRACTS

Fixed block order per Master Plan §4. Blocks are never reordered per page.

| Template | Route | Block order |
|---|---|---|
| **T1 Home** | `/` | Hero (value prop + CTA) → TrustStrip (4.5★ / 702) → three-asset grid → service grid → HoursBlock → ReviewPull → FaqBlock → CtaBar |
| **T2 Service** | `/services/[service]` | AnswerBox (40–60w) → price + duration → what's included → who it's for → barbers who do it → HoursBlock → FaqBlock → CtaBar |
| **T3 Intent** | `/(intent)/…` | AnswerBox → the specific answer → proof → booking → related services → FaqBlock → CtaBar |
| **T4 City** | `/locations/[city]` | AnswerBox → local context → neighborhood links (**real routes, never anchors**) → services → ReviewPull → FaqBlock → CtaBar |
| **T5 Neighborhood** | `/locations/bellingham/[n]` | AnswerBox → `localContext` → drive time + landmarks → 2 siblings → 3 services → FaqBlock → CtaBar |
| **T6 Barber** | `/barbers/[barber]` | Photo + name + years → first-person voice → specialties → services performed → book-with-this-barber CTA |
| **T7 Blog** | `/blog/[slug]` | AnswerBox → body → parent service link → FaqBlock → CtaBar |

**Universal, every page:** exactly one H1 · AnswerBox at top · Breadcrumbs matching the URL ·
StickyCall on mobile · booking one tap away · FaqBlock feeding exactly one FAQPage node.

---

## 9. BUILD QUEUE

### PHASE 0 — Extraction & external quick wins
*Runs in parallel with Phase 1. Costs nothing. The GBP work compounds while the build proceeds.*

| # | Ticket | Acceptance |
|---|---|---|
| 0.1 | Extract from the Wix site | Price list, hours (all 7 days), address, phone, usable photography exported to `content/`. **Nothing else is carried over** — no copy, no URLs, no assets carrying Wix branding. |
| 0.2 | Export the review corpus | All 702 GBP reviews pulled for mining: the sensory-friendly review, walk-in mentions, barber names, most-cited services. Source material for `localContext` and bios. |
| 0.3 | Legacy URL inventory | Every live Wix URL catalogued with its Phase 5 redirect target. |
| 0.4 | Kill the demo posts | The three unedited Wix demo blog posts deindexed now, before the new site launches. |
| 0.5 | Domain email | Live and receiving. Gmail forwards. |
| 0.6 | GBP buildout | Every field: services, attributes, hours incl. Sunday, `$12 Tuesdays` as a post, photos, Q&A seeded. |
| 0.7 | QR review cards at the chair | Printed, linked to `reviewUrl`, staff briefed on the ask. **Start the 78-review clock now** — it runs the entire build. |

### PHASE 1 — Foundation

| # | Ticket | Acceptance |
|---|---|---|
| 1.1 | Scaffold repo | Next.js App Router + TS + Tailwind, deployed to Vercel preview. `pnpm build` clean. |
| 1.2 | `content/business.ts` | Every value resolved or logged in §11. Zero unresolved values in any built page. |
| 1.3 | `lib/schema.ts` | `rootNodes()` + `pageGraph()` implemented. Validates in Rich Results Test. |
| 1.4 | 13 shared components | All render, all typed, all responsive. Storybook or a `/dev` route showing each. |
| 1.5 | `sitemap.ts` + `robots.ts` | Sitemap generated from data files, gated by `isPublishable()`. |
| 1.6 | `lib/publishable.ts` | Gate wired into `generateStaticParams()` **and** `sitemap.ts`. Verified: a sub-400-word row produces no route. |
| 1.7 | Design pass | Brand direction locked. Not a template look. Mobile-first. LCP budget under 2.5s set as CI gate. |

### PHASE 2 — Money pages *(16 routes)*

| # | Ticket | Acceptance |
|---|---|---|
| 2.1 | **Booking decision gate** | Platform selected and embedded. Machete wins on The Cut; Rubio's and MIKE FADEZ on booking apps. Must accept walk-in *and* appointment. Reachable in one tap from every page. |
| 2.2 | Home (T1) | Hero + CTA above fold. TrustStrip. All three assets linked, not merely mentioned. |
| 2.3 | Services hub + 10 spokes (T2) | One hub only. `content/services.ts` drives all 10. Each carries `Service` + `Offer` schema per §6.1. |
| 2.4 | Pricing hub | Full honest current price list. Every price also in `Offer` schema. `$12 Tuesdays` prominent. |
| 2.5 | `/sensory-friendly-haircuts/` | Built per §3 handling note. **Owner written sign-off recorded before publish.** |
| 2.6 | 3 intent pages | `12-dollar-tuesdays`, `walk-in-barber-bellingham`, `sunday-haircut-bellingham`. 400+ unique words each. |
| 2.7 | Book / Contact | Booking embedded, map, all 7 days, domain email. |

### PHASE 3 — Geographic surface *(30 routes)*

| # | Ticket | Acceptance |
|---|---|---|
| 3.1 | Bellingham city page (T4) | Neighborhoods as **real indexed routes**, never anchor jumps. |
| 3.2 | 10 neighborhoods (T5) | Each passes `isPublishable()`. Rows that fail are logged, not shipped. |
| 3.3 | Ferndale + Lynden | Honest edge-market framing. **No implied second location, no second NAP.** |
| 3.4 | 4 remaining intent pages | Per T3. |
| 3.5 | Link graph audit | Zero orphans. Every route within three clicks of home. Script-verified, not eyeballed. |

### PHASE 4 — Authority *(36 routes)*

| # | Ticket | Acceptance |
|---|---|---|
| 4.1 | 6 barber pages (T6) | Real name, photo, years behind the chair, specialties, first-person voice, `Person` node, linked from every service they perform. |
| 4.2 | About | Actual shop story. Owner named. Founding year. Why Cedarwood Ave. |
| 4.3 | Reviews wall | Verified GBP only. Never hand-written. Links to `reviewUrl`. |
| 4.4 | Gallery | Cut type × barber × before/after. Every image descriptively alt-texted. Feeds service spokes. |
| 4.5 | Review engine | Defined repeatable ask at the chair. Weekly count tracked and reported against the 78 target. |

### PHASE 5 — Launch & cutover

| # | Ticket | Acceptance |
|---|---|---|
| 5.1 | Redirect map | Every legacy Wix URL 301s in `next.config.ts` `redirects()`. Zero chains, zero 404s. |
| 5.2 | Pre-launch gate | Every route passes §10. CWV green on mobile. Rich Results clean across all 7 templates. |
| 5.3 | DNS cutover | Domain to Vercel. SSL verified. Old Wix instance unpublished, not merely hidden. |
| 5.4 | Post-launch | GSC property, sitemap submitted, GBP website URL updated, top 10 directories updated to the new URL structure. |
| 5.5 | 48-hour watch | Crawl errors, redirect integrity, ranking movement for branded terms. Report. |

### PHASE 6 — Content & cadence *(52 routes)*

| # | Ticket | Acceptance |
|---|---|---|
| 6.1 | 4 blog clusters | **Kids & first haircuts** (feeds sensory + kids') · **Style & maintenance** (fades, line-ups) · **Beards & shaving** · **Bellingham local** (feeds geo). Each post links up to exactly one service spoke. |
| 6.2 | 12 launch posts | 3 per cluster. BlogPosting + FAQPage schema. |
| 6.3 | Seasonal calendar | Back-to-school (Aug), holidays (Dec), graduation (May–Jun), summer buzz (Jun). |
| 6.4 | Ongoing | 2 posts/month minimum · weekly `$12 Tuesdays` GBP post · quarterly schema revalidation · monthly review-count report against the 4.6 target. |

---

## 10. ACCEPTANCE GATE — EVERY ROUTE

Report PASS/FAIL per item. No route ships on partial.

**Structure** — one H1 matching the core query · Breadcrumbs matching URL · route matches §4 tree ·
links up to parent and laterally to siblings · appears in sitemap only if `isPublishable()`

**Content** — AnswerBox present, 40–60 words, at top · unique-content floor met ·
no template variables visible in rendered copy · every price matches the pricing hub and the chair

**Markup** — full 7-node `@graph` validating · all nodes reference shared `@id`s, never redeclared ·
exactly one FAQPage node matching the visible FaqBlock · NAP matches `business.ts` character for
character · every image has descriptive alt text

**Performance & conversion** — mobile CWV green, LCP under 2.5s · `next/image`, WebP, lazy ·
primary CTA above fold · StickyCall on mobile · booking one tap · TrustStrip near hero ·
**all text is real HTML text** — nothing baked into images, canvas, or meaning-carrying SVG

---

## 11. OPEN PLACEHOLDER REGISTRY

Halt the affected ticket, log, continue the phase. Do not invent.

| # | Item | Blocks | Source |
|---|---|---|---|
| 1 | Shop phone number | 1.2, all schema | Owner |
| 2 | Domain email | 0.5, 1.2 | Registrar |
| 3 | Exact hours, all 7 days | 0.6, 1.2, 2.7 | Owner |
| 4 | Year founded | 1.2, 4.2 | Owner |
| 5 | Owner name + shop story | 4.2 | Owner |
| 6 | Geo coordinates | 1.3 | GBP |
| 7 | GBP place URL + CID review link | 0.6, 0.7, 4.3 | GBP |
| 8 | Full current price list | 0.1, 2.4 | Owner / old site |
| 9 | Barber roster — names, tenure, specialties, photos | 4.1 | Owner |
| 10 | Verified sensory-friendly practices | 2.5 | **Owner written sign-off** |
| 11 | Booking platform | 2.1 | Decision gate |
| 12 | Registered legal entity name | 1.2 | WA SOS |
| 13 | Neighborhood `localContext` × 10 | 3.2 | Research + owner |

---

## 12. PHASE REPORT FORMAT

Output after every phase. Do not roll forward without it.

```
PHASE {n} REPORT
Tickets:        {n} attempted / {n} PASS / {n} FAIL
Routes live:    {n}  (target: {n})
Failed tickets: [ID — reason — blocker]
Placeholders hit: [# from §11]
Schema:         {n}/{n} templates validate clean
CWV:            LCP {x}s mobile / target 2.5s
Rule 5 gate:    {n} rows passed / {n} withheld
Review count:   {n} of 78 toward 4.6 display
Gate:           CLEAR TO PROCEED / BLOCKED ON [x]
```

---

## 13. HARD PROHIBITIONS

1. No Wix copy, URLs, template, or branded assets carried into the new build.
2. No second services hub.
3. No page shipped that fails `isPublishable()`.
4. No JSON-LD written inline in a page — `lib/schema.ts` only.
5. No hand-entered `aggregateRating`. Verified GBP figures only.
6. No sensory-friendly claim beyond written owner confirmation. No implied certification, training, or clinical competency.
7. No unqualified "guaranteed" or "best in Bellingham" without defined terms.
8. No competitor named on any public page.
9. No price on-site that does not match the price at the chair.
10. No text baked into images, canvas, or meaning-carrying SVG.
11. No route shipped without booking reachable in one tap.
12. No published URL changed without a 301 in `next.config.ts`.

---

## 14. THESIS

**Nobody in Bellingham owns barbering search — the seat is empty.** Build 52 routes from eight
templates on Next.js, make the $12 wedge machine-readable through `Offer` schema, claim the
sensory-friendly territory no competitor has touched, and run the review engine at the chair from
day one. Target: own the Bellingham local pack and organic SERP within two quarters, before anyone
else notices the seat is empty.

---

*Greenfield Build Specification — Barber Shack. Next.js App Router · TypeScript · Tailwind · Vercel.
Derived from Smart Site Master Plan v1. Scoring per the Sasquatch Smart Site Scorecard.*
