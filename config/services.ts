/**
 * SERVICE REGISTRY
 *
 * Every service carries two independent gates:
 *
 *   licenseScope   — can he legally do this at all?
 *   requiresPermit — does this job need a permit pulled?
 *
 * A service renders on a location page only when BOTH pass for that
 * jurisdiction. See lib/scope-guard.ts. Never render a service by writing its
 * name into JSX; always resolve it through the guard.
 */

import { LICENSE, fact } from './business'

export type LicenseScope =
  /** Clearly inside the Limited Licensed Plumber credential. */
  | 'in'
  /** Confirmed outside it. Content and referral only — never sold. */
  | 'out'
  /** In scope, but larger jobs can approach the per-project ceiling. */
  | 'size-dependent'

export type Pillar =
  | 'core'
  | 'water-heating'
  | 'water-quality'
  | 'well-septic-property'
  | 'problem'

export interface Service {
  slug: string
  name: string
  /** Short line used in nav and cards. Plain verbs, no marketing filler. */
  summary: string
  pillar: Pillar
  licenseScope: LicenseScope
  requiresPermit: boolean
  /** Set when permit status varies by job. Guard treats true as the safe default. */
  permitNote?: string
  /** Renders a ceiling disclosure block on the page. */
  ceilingRisk?: boolean
  /** Phase in which this page is written. See docs/BUILD-PHASES.md */
  phase: 1 | 3 | 4
  priority: 'lead' | 'primary' | 'secondary'
}

export const SERVICES: Service[] = [
  // --- CORE — permit-free, runs everywhere including Chattanooga ----------
  {
    slug: 'drain-cleaning',
    name: 'Drain Cleaning',
    summary: 'Clearing slow and blocked drains, main lines, and recurring backups.',
    pillar: 'core',
    licenseScope: 'in',
    requiresPermit: false,
    phase: 1,
    priority: 'lead',
  },
  {
    slug: 'emergency-plumbing',
    name: 'Emergency Plumbing',
    summary: 'Burst pipes, active leaks, and shutoffs, including after hours.',
    pillar: 'core',
    licenseScope: 'in',
    requiresPermit: false,
    phase: 1,
    priority: 'lead',
  },
  {
    slug: 'leak-detection',
    name: 'Leak Detection',
    summary: 'Locating hidden leaks in walls, slabs, and supply lines.',
    pillar: 'core',
    licenseScope: 'in',
    requiresPermit: false,
    phase: 1,
    priority: 'primary',
  },
  {
    slug: 'fixture-repair',
    name: 'Fixture Repair & Replacement',
    summary: 'Faucets, toilets, sinks, tubs, and shutoff valves.',
    pillar: 'core',
    licenseScope: 'in',
    requiresPermit: false,
    permitNote: 'Like-for-like fixture swaps are typically permit-free. Relocations are not.',
    phase: 1,
    priority: 'primary',
  },
  {
    slug: 'garbage-disposal',
    name: 'Garbage Disposal Repair & Install',
    summary: 'Replacing failed units and clearing jams.',
    pillar: 'core',
    licenseScope: 'in',
    requiresPermit: false,
    phase: 3,
    priority: 'secondary',
  },
  {
    slug: 'camera-inspection',
    name: 'Sewer Camera Inspection',
    summary: 'Seeing inside the line before anyone digs.',
    pillar: 'core',
    licenseScope: 'in',
    requiresPermit: false,
    phase: 3,
    priority: 'secondary',
  },
  {
    slug: 'water-heater-repair',
    name: 'Water Heater Repair',
    summary: 'No hot water, pilot problems, leaking tanks, and element failures.',
    pillar: 'water-heating',
    licenseScope: 'in',
    requiresPermit: false,
    permitNote: 'Repair is permit-free. Replacement is not.',
    phase: 1,
    priority: 'primary',
  },

  // --- WATER HEATING — permit required, corridor-targeted ------------------
  {
    slug: 'water-heater-replacement',
    name: 'Water Heater Replacement',
    summary: 'Tank replacement sized to the house, with the old unit hauled off.',
    pillar: 'water-heating',
    licenseScope: 'in',
    requiresPermit: true,
    phase: 1,
    priority: 'lead',
  },
  {
    slug: 'tankless-water-heater-installation',
    name: 'Tankless Water Heater Installation',
    summary: 'Converting from tank to tankless, including gas and venting.',
    pillar: 'water-heating',
    licenseScope: 'in',
    requiresPermit: true,
    phase: 1,
    priority: 'lead',
  },

  // --- WATER QUALITY -------------------------------------------------------
  {
    slug: 'whole-house-water-filtration',
    name: 'Whole-House Water Filtration',
    summary: 'Filtration for sediment, iron, sulfur, and taste at the main line.',
    pillar: 'water-quality',
    licenseScope: 'in',
    requiresPermit: true,
    permitNote: 'Verify per jurisdiction — some treat point-of-entry as permit-free.',
    phase: 3,
    priority: 'primary',
  },
  {
    slug: 'water-softener-installation',
    name: 'Water Softener Installation',
    summary: 'Softening hard water to protect heaters, fixtures, and appliances.',
    pillar: 'water-quality',
    licenseScope: 'in',
    requiresPermit: true,
    phase: 3,
    priority: 'primary',
  },
  {
    slug: 'well-water-treatment',
    name: 'Well Water Treatment',
    summary: 'Treating iron, sulfur smell, and sediment on private well supply.',
    pillar: 'water-quality',
    licenseScope: 'in',
    requiresPermit: true,
    permitNote:
      'Treats the water AFTER it reaches the house. Does not touch the well system itself.',
    phase: 3,
    priority: 'primary',
  },

  // --- WELL & SEPTIC PROPERTY — house side only ---------------------------
  {
    slug: 'well-property-plumbing',
    name: 'Plumbing for Well-Water Homes',
    summary: 'Water lines, fixtures, heaters, and treatment on private-well properties.',
    pillar: 'well-septic-property',
    licenseScope: 'in',
    requiresPermit: false,
    permitNote:
      'HOUSE SIDE ONLY. The well, pump, and pressure tank are separately licensed work ' +
      'and are referred out. Copy must never imply otherwise.',
    phase: 3,
    priority: 'primary',
  },
  {
    slug: 'septic-property-plumbing',
    name: 'Plumbing for Septic Homes',
    summary: 'Drain lines, fixtures, and septic-safe plumbing inside the house.',
    pillar: 'well-septic-property',
    licenseScope: 'in',
    requiresPermit: false,
    permitNote:
      'HOUSE SIDE ONLY. Tank, field lines, and pumping are referred out.',
    phase: 3,
    priority: 'primary',
  },

  // --- SIZE-DEPENDENT — ceiling disclosure required ------------------------
  {
    slug: 'repiping',
    name: 'Whole-House Repiping',
    summary: 'Replacing failing galvanized or polybutylene supply lines.',
    pillar: 'core',
    licenseScope: 'size-dependent',
    requiresPermit: true,
    ceilingRisk: true,
    phase: 3,
    priority: 'secondary',
  },
  {
    slug: 'water-service-line',
    name: 'Water Service Line Replacement',
    summary: 'Replacing the line from the meter to the house.',
    pillar: 'core',
    licenseScope: 'size-dependent',
    requiresPermit: true,
    ceilingRisk: true,
    phase: 3,
    priority: 'secondary',
  },
  {
    slug: 'sewer-line-repair',
    name: 'Sewer Line Repair & Replacement',
    summary: 'Repairing collapsed, root-bound, or broken sewer lines.',
    pillar: 'core',
    licenseScope: 'size-dependent',
    requiresPermit: true,
    ceilingRisk: true,
    phase: 3,
    priority: 'secondary',
  },
  {
    slug: 'gas-line-services',
    name: 'Gas Line Installation & Repair',
    summary: 'Running and repairing gas lines for appliances and heaters.',
    pillar: 'core',
    licenseScope: 'in',
    requiresPermit: true,
    phase: 3,
    priority: 'secondary',
  },
]

/**
 * CONFIRMED OUT OF SCOPE.
 *
 * These exist ONLY so the linter can catch them if they ever appear as a service
 * page, and so the site can honestly explain what it does not do and refer out.
 * They must never appear in a service list, a schema Service node, or a CTA.
 */
export const OUT_OF_SCOPE = [
  {
    slug: 'septic-system-service',
    name: 'Septic tank installation, repair, or pumping',
    reason: 'Separately licensed in Tennessee. Not covered by a Limited Licensed Plumber credential.',
    referTo: 'licensed septic contractor',
  },
  {
    slug: 'well-system-service',
    name: 'Well drilling, pump replacement, or pressure tank service',
    reason: 'Separately licensed in Tennessee.',
    referTo: 'licensed well contractor',
  },
  {
    slug: 'commercial-new-construction',
    name: 'Commercial new construction plumbing',
    reason: 'Project values routinely exceed the per-project ceiling.',
    referTo: 'CMC-A licensed contractor',
  },
] as const

export const OUT_OF_SCOPE_SLUGS = new Set<string>(OUT_OF_SCOPE.map((s) => s.slug))

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug)
}

export function servicesByPillar(pillar: Pillar): Service[] {
  return SERVICES.filter((s) => s.pillar === pillar)
}

/** Services that need no permit — the only ones that run everywhere. */
export function permitFreeServices(): Service[] {
  return SERVICES.filter((s) => !s.requiresPermit)
}

export function projectCeilingUsd(): number | null {
  return fact('LICENSE.projectCeilingUsd', LICENSE.projectCeilingUsd)
}
