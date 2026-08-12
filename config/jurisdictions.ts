/**
 * PERMIT JURISDICTION MAP
 *
 * A Tennessee Limited Licensed Plumber is accepted to pull permits statewide
 * EXCEPT in the largest municipalities. Chattanooga is confirmed excluded and
 * sits inside the service footprint.
 *
 * This is a GEOGRAPHIC constraint, not a service constraint. Work can still be
 * performed inside Chattanooga — only permit-required work is off the table.
 *
 * Every jurisdiction below starts as 'unverified'. Unverified jurisdictions may
 * publish a location page, but that page renders ONLY permit-free services.
 * This fails safe: we under-sell rather than advertise work he cannot permit.
 *
 * Advertising permitted work in a jurisdiction where he cannot pull is the one
 * mistake in this project that risks the license rather than a ranking.
 */

export type PermitAuthority =
  /** Confirmed he can pull permits here. Full service list renders. */
  | 'full'
  /** Confirmed he cannot. Permit-free services only. */
  | 'none'
  /** Not yet verified. Treated as 'none' until someone calls the office. */
  | 'unverified'

export type County =
  | 'Bradley'
  | 'McMinn'
  | 'Hamilton'
  | 'Polk'
  | 'Meigs'
  | 'Rhea'

export interface Jurisdiction {
  /** The body that issues plumbing permits here. */
  id: string
  name: string
  county: County
  permitAuthority: PermitAuthority
  /** Who to call to verify. Fill in as verification proceeds. */
  verificationContact?: string
  verifiedOn?: string
  note?: string
}

export const JURISDICTIONS: Record<string, Jurisdiction> = {
  // --- CONFIRMED --------------------------------------------------------
  'city-of-chattanooga': {
    id: 'city-of-chattanooga',
    name: 'City of Chattanooga',
    county: 'Hamilton',
    permitAuthority: 'none',
    verifiedOn: '2026-08-12',
    note:
      'Confirmed by license holder: LLP is not accepted to pull permits in Chattanooga, ' +
      'Knoxville, or Nashville. Permit-free work only. Drain cleaning is the wedge here.',
  },

  // --- UNVERIFIED — BLOCKING ---------------------------------------------
  // Each of these must be called individually. Do not assume county rules
  // apply inside incorporated towns; most administer their own permitting.

  'bradley-county': {
    id: 'bradley-county',
    name: 'Bradley County',
    county: 'Bradley',
    permitAuthority: 'unverified',
    verificationContact: 'Bradley County Building & Codes',
  },
  'city-of-cleveland': {
    id: 'city-of-cleveland',
    name: 'City of Cleveland',
    county: 'Bradley',
    permitAuthority: 'unverified',
    verificationContact: 'Cleveland Building & Codes Department',
    note: 'Primary revenue market. Highest-priority verification.',
  },
  'mcminn-county': {
    id: 'mcminn-county',
    name: 'McMinn County',
    county: 'McMinn',
    permitAuthority: 'unverified',
    verificationContact: 'McMinn County Building Inspector',
  },
  'city-of-athens': {
    id: 'city-of-athens',
    name: 'City of Athens',
    county: 'McMinn',
    permitAuthority: 'unverified',
    verificationContact: 'Athens Codes Enforcement',
    note: 'Weakest competitor field in the footprint. High-priority verification.',
  },
  'hamilton-county': {
    id: 'hamilton-county',
    name: 'Hamilton County (unincorporated)',
    county: 'Hamilton',
    permitAuthority: 'unverified',
    verificationContact: 'Hamilton County Building Inspection',
    note: 'Covers Ooltewah, Apison, Harrison, Birchwood, Georgetown, Hixson.',
  },
  'city-of-collegedale': {
    id: 'city-of-collegedale',
    name: 'City of Collegedale',
    county: 'Hamilton',
    permitAuthority: 'unverified',
    verificationContact: 'Collegedale Building & Codes',
  },
  'city-of-soddy-daisy': {
    id: 'city-of-soddy-daisy',
    name: 'City of Soddy-Daisy',
    county: 'Hamilton',
    permitAuthority: 'unverified',
  },
  'city-of-red-bank': {
    id: 'city-of-red-bank',
    name: 'City of Red Bank',
    county: 'Hamilton',
    permitAuthority: 'unverified',
  },
  'city-of-east-ridge': {
    id: 'city-of-east-ridge',
    name: 'City of East Ridge',
    county: 'Hamilton',
    permitAuthority: 'unverified',
  },
  'town-of-signal-mountain': {
    id: 'town-of-signal-mountain',
    name: 'Town of Signal Mountain',
    county: 'Hamilton',
    permitAuthority: 'unverified',
  },
  'polk-county': {
    id: 'polk-county',
    name: 'Polk County',
    county: 'Polk',
    permitAuthority: 'unverified',
    note: 'Covers Benton, Ocoee, Old Fort, Delano.',
  },
  'meigs-county': {
    id: 'meigs-county',
    name: 'Meigs County',
    county: 'Meigs',
    permitAuthority: 'unverified',
    note: 'Covers Decatur.',
  },
  'rhea-county': {
    id: 'rhea-county',
    name: 'Rhea County',
    county: 'Rhea',
    permitAuthority: 'unverified',
    note: 'Covers Dayton. Edge of radius — confirm before building the page.',
  },
}

/** Fails safe: anything not explicitly 'full' cannot carry permitted work. */
export function canPullPermit(jurisdictionId: string): boolean {
  return JURISDICTIONS[jurisdictionId]?.permitAuthority === 'full'
}

export function pendingVerification(): Jurisdiction[] {
  return Object.values(JURISDICTIONS).filter((j) => j.permitAuthority === 'unverified')
}
