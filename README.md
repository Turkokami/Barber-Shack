# Krishan Plumbing — Smart Site

Marketing site for a home-based, licensed plumber serving the Bradley–McMinn
corridor of Southeast Tennessee (Charleston, Cleveland, Athens, and the US-11
towns), with permit-free coverage extending into greater Chattanooga.

**Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind · deployed on Vercel.

The full build brief and the rules that govern it live in [`CLAUDE.md`](./CLAUDE.md).
The route plan and phase gates live in [`docs/BUILD-PHASES.md`](./docs/BUILD-PHASES.md).

## How this repo protects the license

Three constraints are enforced in code, not left to prose, because getting them
wrong risks the owner's plumbing license rather than a search ranking:

1. **The home address is never published.** This is a service-area business.
   There is no `streetAddress` anywhere in the schema layer. Linter check `[1]`
   scans every file for it.
2. **Services are gated by license scope and permit authority.** A page never
   maps over the raw service list. It asks `assertSellable()` in
   `lib/scope-guard.ts`, which withholds permit-required work in any jurisdiction
   whose permit authority is not confirmed `full` — failing safe to permit-free
   services until a permit office is called and the flag is flipped in
   `config/jurisdictions.ts`.
3. **Unconfirmed business facts cannot ship.** Every fact lives in
   `config/business.ts` with a `confirmed` / `pending` status. `fact()` returns
   the value when confirmed and **throws during a production build** when
   pending, so a placeholder phone number or unverified claim can never reach
   production.

## Commands

```bash
npm install
npm run dev               # local dev server
npm run lint:scope        # dev lint — pending facts are warnings
npm run lint:scope:prod   # strict lint — pending facts fail the build
npm run typecheck
npm run build             # strict lint, then next build
```

## Deploy note — the production build is gated on purpose

`npm run build` (and therefore a Vercel production deploy) is **intended to fail**
until the pending registry items in `config/business.ts` are confirmed — at
minimum the business display name, dedicated phone line, and domain. This is the
safety gate described above, not a misconfiguration. Fill those facts in first,
then the build passes and deploys.

To preview the site before those facts exist, run `npm run dev` locally.

## Status

Phase 0–1 scaffold. The reference page pattern is
`app/service-areas/[slug]/page.tsx`; all 21 location routes generate from it.
Remaining Phase 1 pages (home, services, about, contact, reviews) and Phases 2–5
are tracked in `docs/BUILD-PHASES.md`.
