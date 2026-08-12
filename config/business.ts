/**
 * BUSINESS REGISTRY — SINGLE SOURCE OF TRUTH
 *
 * Every fact about this business lives here and nowhere else. No page, component,
 * or schema file may hardcode a business fact. If you need one, import it.
 *
 * Facts carry a status. `confirmed` facts render. `pending` facts throw at build
 * time in production. This is deliberate: it is how we guarantee that a
 * placeholder phone number or an unverified license claim can never ship.
 *
 * To resolve a pending item: change status to 'confirmed', add the value, and
 * record the date and source. Nothing else in the codebase needs to change.
 */

export type Fact<T> =
  | { status: 'confirmed'; value: T; source: string; confirmedOn: string }
  | { status: 'pending'; blocks: string[]; askedOn?: string }

export class PendingFactError extends Error {
  constructor(key: string, blocks: string[]) {
    super(
      `Registry item "${key}" is still pending and blocks: ${blocks.join(', ')}.\n` +
        `Resolve it in config/business.ts before building for production.`
    )
    this.name = 'PendingFactError'
  }
}

/** Read a fact. Throws in production if unresolved; returns null in dev so the site still renders. */
export function fact<T>(key: string, f: Fact<T>): T | null {
  if (f.status === 'confirmed') return f.value
  if (process.env.NODE_ENV === 'production') throw new PendingFactError(key, f.blocks)
  return null
}

/** Read a fact or fall back to visible placeholder text in dev. */
export function factOr<T>(key: string, f: Fact<T>, fallback: T): T {
  return fact(key, f) ?? fallback
}

// ---------------------------------------------------------------------------
// CONFIRMED — verified from the Tennessee license card, August 2026
// ---------------------------------------------------------------------------

export const LICENSE = {
  holderName: {
    status: 'confirmed',
    value: 'Kevin Alex-Clayton Krishan',
    source: 'TN license card, photographed Aug 2026',
    confirmedOn: '2026-08-12',
  } as Fact<string>,

  /** Spelling is fixed. Hyphenated middle. Never normalize or autocorrect. */
  number: {
    status: 'confirmed',
    value: '5045',
    source: 'TN license card',
    confirmedOn: '2026-08-12',
  } as Fact<string>,

  classification: {
    status: 'confirmed',
    value: 'Limited Licensed Plumber',
    source: 'TN license card',
    confirmedOn: '2026-08-12',
  } as Fact<string>,

  issuingAuthority: {
    status: 'confirmed',
    value: 'Tennessee Department of Commerce and Insurance, Board for Licensing Contractors',
    source: 'TN license card',
    confirmedOn: '2026-08-12',
  } as Fact<string>,

  /** ISO date. A build after this date must fail — see scripts/check-registry.ts */
  expiresOn: {
    status: 'confirmed',
    value: '2027-05-31',
    source: 'TN license card',
    confirmedOn: '2026-08-12',
  } as Fact<string>,

  /** Per-project ceiling in USD. Work above requires CMC-A. */
  projectCeilingUsd: {
    status: 'confirmed',
    value: 25000,
    source: 'Confirmed directly by license holder, Aug 2026',
    confirmedOn: '2026-08-12',
  } as Fact<number>,

  verifyUrl: {
    status: 'confirmed',
    value: 'https://verify.tn.gov/',
    source: 'TN Board for Licensing Contractors public lookup',
    confirmedOn: '2026-08-12',
  } as Fact<string>,

  /** Confirmed OUT of scope. See config/services.ts — these must never be sold. */
  excludedWork: {
    status: 'confirmed',
    value: [
      'Septic system installation, repair, or pumping',
      'Well system installation or repair',
      'Any single project above the per-project ceiling',
    ],
    source: 'Confirmed directly by license holder, Aug 2026',
    confirmedOn: '2026-08-12',
  } as Fact<string[]>,
} as const

// ---------------------------------------------------------------------------
// PENDING — blocks production build until resolved
// ---------------------------------------------------------------------------

export const IDENTITY = {
  legalName: {
    status: 'pending',
    blocks: ['domain', 'GBP listing', 'all schema', 'every page of copy', 'citations'],
    askedOn: '2026-08-12',
  } as Fact<string>,

  displayName: {
    status: 'pending',
    blocks: ['site header', 'title tags', 'schema @name', 'citations'],
    askedOn: '2026-08-12',
  } as Fact<string>,

  entityType: {
    status: 'pending',
    blocks: ['schema legalName', 'footer legal line'],
  } as Fact<string>,

  /** Must be a dedicated business line with call tracking. NOT a personal cell. */
  phone: {
    status: 'pending',
    blocks: ['NAP', 'all CTAs', 'schema telephone', 'every citation'],
    askedOn: '2026-08-12',
  } as Fact<string>,

  email: {
    status: 'pending',
    blocks: ['contact page', 'schema'],
  } as Fact<string>,

  domain: {
    status: 'pending',
    blocks: ['canonical URLs', 'sitemap', 'all schema @id values'],
  } as Fact<string>,

  yearsInTrade: {
    status: 'pending',
    blocks: ['E-E-A-T depth beyond the license itself', 'about page'],
  } as Fact<number>,

  foundedYear: {
    status: 'pending',
    blocks: ['schema foundingDate', 'about page'],
  } as Fact<number>,
} as const

export const OPERATIONS = {
  /**
   * Real availability. Not aspirational. If he does not actually answer at 2 AM,
   * this must say so — the emergency positioning depends on it being true.
   */
  hours: {
    status: 'pending',
    blocks: ['GBP hours', 'schema openingHours', 'emergency positioning'],
    askedOn: '2026-08-12',
  } as Fact<{ afterHours: boolean; weekends: boolean; note: string }>,

  serviceRadiusMiles: {
    status: 'pending',
    blocks: ['which location pages get built', 'areaServed'],
  } as Fact<number>,

  insurance: {
    status: 'pending',
    blocks: ['trust blocks', 'commercial page'],
  } as Fact<{ carrier: string; generalLiabilityUsd: number }>,

  /**
   * STANDING RULE: defined-term warranties only. Never publish unqualified
   * "lifetime" wording. A brandable guarantee name backed by written terms is fine.
   */
  warranty: {
    status: 'pending',
    blocks: ['all warranty language sitewide'],
  } as Fact<{ name: string; termMonths: number; terms: string }>,

  existingFacebookReviews: {
    status: 'pending',
    blocks: ['reviews baseline', 'review migration plan'],
  } as Fact<{ count: number; average: number }>,
} as const

// ---------------------------------------------------------------------------
// SERVICE AREA BUSINESS — hard constraint
// ---------------------------------------------------------------------------

/**
 * HOME-BASED. The street address is NEVER published — not on the site, not in
 * schema, not in a single citation, not on the GBP.
 *
 * There is intentionally no `streetAddress` field anywhere in this codebase.
 * Do not add one. Do not embed a map centered on the home. Do not write
 * "visit us". Publishing it risks GBP suspension and puts a residential
 * address into permanent circulation.
 */
export const SAB = {
  isServiceAreaBusiness: true,
  publishStreetAddress: false,
  addressLocality: 'Charleston',
  addressRegion: 'TN',
  postalCode: '37310',
  country: 'US',
  /** Town-center centroid for areaServed geometry. NOT the home address. */
  approximateCenter: { lat: 35.2856, lng: -84.7616 },
} as const

export const NAP_RULE = `
Canonical NAP is: {displayName} + {phone} + "Charleston, TN".
Use this exact string in every citation. No street address. No variants.
` as const
