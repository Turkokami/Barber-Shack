# Build Phases — Route Manifest

Phase gates are completion conditions, not dates. Do not start a phase before the
one before it verifies.

**Status key:** `✅ built` · `🟡 scaffolded, needs content` · `⬜ not started`

---

## Phase 0 — Foundation & Permit Map

| Item | Status |
|---|---|
| Registry with confirmed/pending status tracking | ✅ `config/business.ts` |
| Jurisdiction permit map | ✅ `config/jurisdictions.ts` |
| Service registry with license scope + permit flags | ✅ `config/services.ts` |
| Location registry bound to jurisdictions | ✅ `config/locations.ts` |
| Scope guard | ✅ `lib/scope-guard.ts` |
| Build-time linter, 9 checks | ✅ `scripts/lint-scope.ts` |
| 7-node JSON-LD graph | ✅ `lib/schema/graph.ts` |
| Design tokens | ✅ `tailwind.config.ts` |
| **Permit authority verified per jurisdiction** | ⬜ **BLOCKING — 13 calls** |
| Domain registered | ⬜ pending registry item |
| Dedicated business line + call tracking | ⬜ pending registry item |
| GBP created as hidden-address SAB | ⬜ |

**Gate:** permit map complete. Until then Phase 2 pages render permit-free only.

### The 13 calls

| Jurisdiction | Contact | Priority |
|---|---|---|
| City of Cleveland | Cleveland Building & Codes | 1 — primary revenue market |
| City of Athens | Athens Codes Enforcement | 2 — weakest competitor field |
| Bradley County | Bradley County Building & Codes | 3 — home county |
| McMinn County | McMinn County Building Inspector | 4 — corridor towns |
| Hamilton County | Hamilton County Building Inspection | 5 — Ooltewah, Apison, Harrison |
| City of Collegedale | Collegedale Building & Codes | 6 |
| Polk County | — | 7 — Benton, Ocoee, Old Fort, Delano |
| Meigs County | — | 8 — Decatur |
| Soddy-Daisy, Red Bank, East Ridge, Signal Mountain | each separately | 9 |
| Rhea County | — | 10 — confirm Dayton is inside radius first |

---

## Phase 1 — Core Site, Credentials & Technical Foundation

~22 routes. **Gate: `@graph` validates clean in Rich Results Test, zero errors.**

| Route | Status |
|---|---|
| `/` | ⬜ |
| `/services` | ⬜ |
| `/services/drain-cleaning` | 🟡 registry entry exists, page needed |
| `/services/emergency-plumbing` | 🟡 |
| `/services/leak-detection` | 🟡 |
| `/services/fixture-repair` | 🟡 |
| `/services/water-heater-repair` | 🟡 |
| `/services/water-heater-replacement` | 🟡 |
| `/services/tankless-water-heater-installation` | 🟡 |
| `/about` — named-expert E-E-A-T, license, credential history | ⬜ |
| `/contact` — no address, no map embed | ⬜ |
| `/reviews` | ⬜ |
| `sitemap.ts`, `robots.ts`, canonical strategy | ⬜ |

**Parallel, day one:** review generation system + citation build on canonical NAP.

---

## Phase 2 — Geographic Coverage

21 routes, all scaffolded through `app/service-areas/[slug]/page.tsx`.
**Gate: Phase 1 schema validated.**

Each location needs ≥3 non-copyable `localFacts` — linter check `[6]` enforces it.
Current data is a starting point; replace with real specifics as jobs accumulate.

| Tier | Locations |
|---|---|
| Anchor | Charleston, Calhoun |
| Primary | Cleveland, Athens |
| Growth | Ooltewah, Collegedale, Apison, Harrison |
| Corridor | Riceville, Niota, Etowah, Englewood, Benton, Ocoee, Old Fort, Delano, Georgetown, Birchwood, Decatur, Soddy-Daisy |
| Restricted | Chattanooga — permit-free services only |

---

## Phase 3 — Opportunity Clusters

~34 routes. **Where the market position is won.** Gate: Phase 2 indexing.

**Drain cluster (~6)** — the only line at full strength in every market
`main-line-clog` · `recurring-backups` · `root-intrusion` · `hydro-jetting` ·
`kitchen-drain` · `commercial-drain-maintenance`

**Water heating (~8)**
`sizing-guide` · `tank-vs-tankless` · `gas-vs-electric` · `expansion-tanks` ·
`hard-water-damage-to-heaters` · `heater-lifespan` · `anode-rods` · `venting`

**Water quality (~8)**
`hard-water-bradley-county` · `whole-house-filtration` · `softener-service` ·
`iron-and-sulfur` · `sediment` · `well-water-testing` · `scale-damage` · `taste-and-odor`

**Well & septic property (~6)** — house side only, never system work
`plumbing-on-well-water` · `septic-safe-plumbing` · `what-we-refer-out` ·
`rural-crawlspace-runs` · `long-service-runs` · `manufactured-homes`

**Problem-intent micro pages (~14)**
`no-hot-water` · `water-heater-leaking` · `sewage-smell` · `low-water-pressure` ·
`running-toilet` · `frozen-pipes` · `burst-pipe` · `slab-leak` · `water-hammer` ·
`galvanized-pipe-failure` · `brown-water` · `sewer-backup` · `dripping-hose-bib` ·
`pilot-light-wont-stay-lit`

---

## Phase 4 — Authority & Conversion

~18 routes. Gate: Phase 3 indexed.

- Permit guidance by county — Bradley, McMinn, Hamilton, Polk, Meigs
- `what-is-a-limited-licensed-plumber` — explaining the credential class openly is
  a trust play competitors saying only "licensed" cannot match
- Utility processes — Cleveland Utilities, Athens Utilities Board, Hiwassee Utility Commission
- `how-our-estimates-work` — targets the documented mid-job price revision complaints
- Financing · commercial service & property management · plumbing reference library
- Conversion hardening: tap-to-call above fold, sticky mobile CTA, lead routing

---

## Phase 5 — Ongoing

Seasonal content (winter freeze, summer irrigation and hose bibs, storm response),
case studies with photos, continuous review generation.

---

## Projected scoring

| Milestone | Score /100 | Corridor rank |
|---|---|---|
| Today | 20 | Unranked |
| Phases 1–2 | 73 | ~6th of 19 |
| Phase 3 | 88 | ~3rd of 19 |
| Phase 4 + 12mo reviews | 95 | 1st |
| 24 months | 98 | 1st, clear |

Reviews are the only gate that cannot be compressed. Everything in this repo can
be finished in weeks. 250–350 reviews takes two years and starts today.
