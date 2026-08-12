/**
 * LOCATION REGISTRY
 *
 * Every location binds to exactly one permit jurisdiction. That binding decides
 * which services its page is allowed to render — see lib/scope-guard.ts.
 *
 * Location pages must carry material a competitor cannot copy: which utility
 * serves the town, the housing stock, whether it runs on septic or city sewer,
 * and real local work. A thin location page is worse than no location page.
 * `localFacts` is where that lives, and the linter enforces a minimum.
 */

import type { County } from './jurisdictions'

export type MarketTier =
  /** Home base. Zero competition. */
  | 'anchor'
  /** Primary revenue market. */
  | 'primary'
  /** High structural upside. */
  | 'growth'
  /** Long-tail capture only. */
  | 'tail'

export interface Location {
  slug: string
  name: string
  county: County
  /** Key into JURISDICTIONS. Decides the permitted service list for this page. */
  jurisdictionId: string
  tier: MarketTier
  phase: 2
  population?: number
  /** Distance from Charleston in minutes. Used for honest coverage language. */
  driveMinutes: number
  /** Water and sewer utility. Written into the page. */
  utility?: string
  /** Non-copyable local material. Linter requires >= 3 before publish. */
  localFacts: string[]
  /** Competitors active here, from the August 2026 market analysis. */
  competitorNote?: string
}

export const LOCATIONS: Location[] = [
  // --- ANCHOR — the seam nobody occupies ---------------------------------
  {
    slug: 'charleston-tn',
    name: 'Charleston',
    county: 'Bradley',
    jurisdictionId: 'bradley-county',
    tier: 'anchor',
    phase: 2,
    driveMinutes: 0,
    utility: 'Hiwassee Utility Commission',
    localFacts: [
      'Sits on US-11 at the Bradley–McMinn line, on the north bank of the Hiwassee River.',
      'A search for plumbers based in Charleston returns no local results — every operator serving the town drives in from Cleveland or Athens.',
      'Mixed city water and private well supply, with septic common outside the town center.',
    ],
    competitorNote: 'Zero dedicated coverage from any competitor in the August 2026 analysis.',
  },
  {
    slug: 'calhoun-tn',
    name: 'Calhoun',
    county: 'McMinn',
    jurisdictionId: 'mcminn-county',
    tier: 'anchor',
    phase: 2,
    driveMinutes: 4,
    localFacts: [
      'Directly across the Hiwassee River from Charleston on US-11.',
      'Small incorporated town with a high share of older housing stock.',
      'Well and septic properties common outside the town center.',
    ],
  },

  // --- PRIMARY -----------------------------------------------------------
  {
    slug: 'cleveland-tn',
    name: 'Cleveland',
    county: 'Bradley',
    jurisdictionId: 'city-of-cleveland',
    tier: 'primary',
    phase: 2,
    driveMinutes: 15,
    utility: 'Cleveland Utilities',
    localFacts: [
      'The largest city in Bradley County and the primary revenue market for this service area.',
      'Housing stock spans mid-century neighborhoods near the center and newer subdivisions toward the bypass.',
      'City sewer through most of the built-up area, septic on the rural edges.',
    ],
    competitorNote:
      'Two heavyweights hold the market, then a long tail of operators under 50 reviews. Nothing sits in the middle.',
  },
  {
    slug: 'athens-tn',
    name: 'Athens',
    county: 'McMinn',
    jurisdictionId: 'city-of-athens',
    tier: 'primary',
    phase: 2,
    driveMinutes: 18,
    utility: 'Athens Utilities Board',
    localFacts: [
      'County seat of McMinn County, roughly 18 minutes north of Charleston on US-11.',
      'The best-reviewed plumbing option in town is primarily an electrical contractor.',
      'Weekend coverage in McMinn County is close to nonexistent among established operators.',
    ],
    competitorNote:
      'Weakest competitor field in the entire footprint. Highest structural upside.',
  },

  // --- GROWTH ------------------------------------------------------------
  {
    slug: 'ooltewah-tn',
    name: 'Ooltewah',
    county: 'Hamilton',
    jurisdictionId: 'hamilton-county',
    tier: 'growth',
    phase: 2,
    driveMinutes: 35,
    localFacts: [
      'One of the fastest-growing residential areas in the Chattanooga metro.',
      'Heavy new-construction share, which changes what fails and when.',
      'Only one competitor here combines real depth with full-hours availability.',
    ],
    competitorNote: 'The established local operator closes at 3:30 PM and does not work weekends.',
  },
  {
    slug: 'collegedale-tn',
    name: 'Collegedale',
    county: 'Hamilton',
    jurisdictionId: 'city-of-collegedale',
    tier: 'growth',
    phase: 2,
    driveMinutes: 35,
    localFacts: [
      'Administers its own building permits separately from Hamilton County.',
      'Mixed residential and institutional demand.',
      'Adjacent to Apison and Ooltewah growth corridor.',
    ],
  },
  {
    slug: 'apison-tn',
    name: 'Apison',
    county: 'Hamilton',
    jurisdictionId: 'hamilton-county',
    tier: 'growth',
    phase: 2,
    driveMinutes: 40,
    localFacts: [
      'Rural-residential edge of the Hamilton County growth corridor.',
      'High share of private well and septic properties.',
      'Long driveways and crawlspace construction are common.',
    ],
  },
  {
    slug: 'harrison-tn',
    name: 'Harrison',
    county: 'Hamilton',
    jurisdictionId: 'hamilton-county',
    tier: 'growth',
    phase: 2,
    driveMinutes: 35,
    localFacts: [
      'Sits along the Chickamauga Lake shoreline northeast of Chattanooga.',
      'Mix of lake-adjacent older homes and newer subdivisions.',
      'Septic common on lake-side lots.',
    ],
  },

  // --- CORRIDOR TOWNS — the uncontested stretch ---------------------------
  {
    slug: 'riceville-tn',
    name: 'Riceville',
    county: 'McMinn',
    jurisdictionId: 'mcminn-county',
    tier: 'tail',
    phase: 2,
    driveMinutes: 12,
    localFacts: [
      'Unincorporated community on US-11 between Charleston and Athens.',
      'Predominantly well and septic properties.',
      'Served today only by operators driving out from Athens or Cleveland.',
    ],
  },
  {
    slug: 'niota-tn',
    name: 'Niota',
    county: 'McMinn',
    jurisdictionId: 'mcminn-county',
    tier: 'tail',
    phase: 2,
    driveMinutes: 25,
    localFacts: [
      'Small city north of Athens with a notably old housing stock.',
      'Galvanized supply line failure is common in the older core.',
      'Home to one of the oldest surviving railroad depots in Tennessee.',
    ],
  },
  {
    slug: 'etowah-tn',
    name: 'Etowah',
    county: 'McMinn',
    jurisdictionId: 'mcminn-county',
    tier: 'tail',
    phase: 2,
    driveMinutes: 30,
    localFacts: [
      'Built as a railroad town in the early 1900s; much of the core housing dates from that era.',
      'Older cast iron and galvanized systems are common.',
      'Weekend plumbing coverage in this part of McMinn County is effectively absent.',
    ],
  },
  {
    slug: 'englewood-tn',
    name: 'Englewood',
    county: 'McMinn',
    jurisdictionId: 'mcminn-county',
    tier: 'tail',
    phase: 2,
    driveMinutes: 35,
    localFacts: [
      'Former mill town at the eastern edge of McMinn County.',
      'High share of early-1900s housing stock.',
      'Well and septic common outside the town center.',
    ],
  },
  {
    slug: 'benton-tn',
    name: 'Benton',
    county: 'Polk',
    jurisdictionId: 'polk-county',
    tier: 'tail',
    phase: 2,
    driveMinutes: 20,
    localFacts: [
      'County seat of Polk County, east of Charleston toward the Ocoee.',
      'Rural service area with heavy well and septic use.',
      'No plumbing operator in the market is anchored here.',
    ],
  },
  {
    slug: 'ocoee-tn',
    name: 'Ocoee',
    county: 'Polk',
    jurisdictionId: 'polk-county',
    tier: 'tail',
    phase: 2,
    driveMinutes: 18,
    localFacts: [
      'Sits between Cleveland and the Ocoee River recreation corridor.',
      'Mix of year-round rural homes and seasonal river-adjacent property.',
      'Freeze exposure is higher on unheated seasonal structures.',
    ],
  },
  {
    slug: 'old-fort-tn',
    name: 'Old Fort',
    county: 'Polk',
    jurisdictionId: 'polk-county',
    tier: 'tail',
    phase: 2,
    driveMinutes: 15,
    localFacts: [
      'Rural community south of Charleston in northern Polk County.',
      'Predominantly private well and septic.',
      'Long service runs from the road to the house are common.',
    ],
  },
  {
    slug: 'delano-tn',
    name: 'Delano',
    county: 'Polk',
    jurisdictionId: 'polk-county',
    tier: 'tail',
    phase: 2,
    driveMinutes: 22,
    localFacts: [
      'Small community on the Hiwassee River in northern Polk County.',
      'Almost entirely well and septic.',
      'River-adjacent properties with seasonal occupancy.',
    ],
  },
  {
    slug: 'georgetown-tn',
    name: 'Georgetown',
    county: 'Hamilton',
    jurisdictionId: 'hamilton-county',
    tier: 'tail',
    phase: 2,
    driveMinutes: 20,
    localFacts: [
      'Sits at the Hamilton–Meigs–Bradley county convergence.',
      'Rural residential with heavy well and septic use.',
      'Closer to Charleston than to any Chattanooga-based operator.',
    ],
  },
  {
    slug: 'birchwood-tn',
    name: 'Birchwood',
    county: 'Hamilton',
    jurisdictionId: 'hamilton-county',
    tier: 'tail',
    phase: 2,
    driveMinutes: 25,
    localFacts: [
      'Rural northern Hamilton County community near the Chickamauga Lake headwaters.',
      'Predominantly well and septic.',
      'Chattanooga-based operators treat this as drive-time overflow.',
    ],
  },
  {
    slug: 'decatur-tn',
    name: 'Decatur',
    county: 'Meigs',
    jurisdictionId: 'meigs-county',
    tier: 'tail',
    phase: 2,
    driveMinutes: 30,
    localFacts: [
      'County seat of Meigs County, north across the Hiwassee.',
      'Rural county with almost no resident plumbing coverage.',
      'Heavy private well and septic use.',
    ],
  },
  {
    slug: 'soddy-daisy-tn',
    name: 'Soddy-Daisy',
    county: 'Hamilton',
    jurisdictionId: 'city-of-soddy-daisy',
    tier: 'tail',
    phase: 2,
    driveMinutes: 40,
    localFacts: [
      'Administers its own permitting separately from the City of Chattanooga.',
      'Former mining community with a wide range of housing ages.',
      'Lake-adjacent and ridge properties both common.',
    ],
  },

  // --- CHATTANOOGA — permit-free work only --------------------------------
  {
    slug: 'chattanooga-tn',
    name: 'Chattanooga',
    county: 'Hamilton',
    jurisdictionId: 'city-of-chattanooga',
    tier: 'tail',
    phase: 2,
    driveMinutes: 50,
    utility: 'Tennessee American Water',
    localFacts: [
      'Drain cleaning, emergency leak repair, and fixture work need no permit — those are what we do inside the city.',
      'Older neighborhoods carry cast iron and clay sewer lines prone to root intrusion.',
      'Six large operators hold roughly 12,000 reviews between them here; we compete on response, not volume.',
    ],
    competitorNote:
      'Saturated. Enter on permit-free, high-urgency work only. Never fight the head term.',
  },
]

export function getLocation(slug: string): Location | undefined {
  return LOCATIONS.find((l) => l.slug === slug)
}

export function locationsByTier(tier: MarketTier): Location[] {
  return LOCATIONS.filter((l) => l.tier === tier)
}
