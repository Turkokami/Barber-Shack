# Barber Shack — working rules

`SPEC.md` is the build contract and `README.md` covers architecture. This file is
the short list of things that are easy to get wrong and expensive to get wrong.

---

## PHOTOGRAPHY RULE — no barbers' faces

**Standing rule from Jared. It applies to every image on the site, forever.**

Staff change. A photo of a barber's face ties the site to someone who may not be
here in six months, and taking it down later is a worse conversation than never
publishing it.

| Allowed | Not allowed |
|---|---|
| Barbers' **hands** — clippers, comb, scissors, razor | **Any barber's face**, including in a mirror or background |
| **Jared himself** — he is the owner and the named voice | Group or team photos of staff |
| **Clients** — all permissions are given | Staff portraits |
| **Cartoons and illustrations** — explicitly fine per Jared | |
| Interiors, signage, storefront, the barber pole | |

**Before adding any photo of a person, look at the image.** Do not go by the
filename. `jared.webp` was in this repo for months and was *not* Jared — the owner
confirmed that twice, and a previous session nearly published it as him. The file
has since been deleted. Filenames lie; open the image.

The compliant working set, if you need a photo of work happening:
`cut-clipper-closeup`, `cut-fade-comb`, `cut-fade-comb2`, `cut-fresh-fade`,
`cut-lineup`, `shave-bw` (hands only), `chair-scissor-bw` (Jared), and any
`toon-*` illustration.

Nine images were deleted when this rule was set. They are recoverable from git
history if a face is ever cleared for use — do not restore one without asking.

---

## Other things that bite

**Shaquana.** Spelled as she spells it. Never normalised, never corrected, never
touched by a find-and-replace. A `Person` entity that misspells its subject is
worse than no entity.

**Placeholders are load-bearing.** `[PLACEHOLDER]` marks an unresolved registry
item. `requireResolved()` fails the build if one reaches a rendered page. That is
deliberate — resolve it with the owner or leave the page unbuilt. Never invent a
value, and never stub past the guard.

**The publish gate.** `isPublishable()` and its siblings feed both
`generateStaticParams()` and `sitemap.ts`. If a page fails the gate it renders no
route — so never link to it either. Filter link lists through the same gate the
route uses, the way the home page and Bellingham hub do.

**Consent gates.** Resident studios in `content/departments.ts` default every
`participation` flag to `false`. Silence is not consent. No price, face, licence
number or booking link renders for a resident until the operator agrees in writing.

**Founding dates.** The business was founded in **Lake Stevens in 2011**; the
Bellingham shop opened in **Birchwood in June 2014**. These are two different
facts. "On Cedarwood since 2011" was wrong and was live for a while — use
`BUSINESS.founded`, `BUSINESS.foundedCity` and `BUSINESS.bellinghamSince`.

**Third-party widgets.** The Vagaro booking loader is a parse-time script and must
stay server-rendered via `dangerouslySetInnerHTML`. Appending it in a `useEffect`
silently breaks it. See the note in `components/BookingEmbed.tsx` before touching it.

---

## Deploying

Vercel builds production from the branch configured as its Production Branch, and
there is **no staging step** — a push goes straight to the live site. Run
`npx tsc --noEmit` and a full `npm run build` before pushing.

Note: `next/font/google` cannot fetch fonts in a sandboxed environment with
restricted egress. That is an environment limit, not a code fault — Vercel builds
them fine. Do not "fix" it by removing the fonts.
