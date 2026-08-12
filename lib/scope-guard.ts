/**
 * SCOPE GUARD
 *
 * The license and permit constraints are enforced here, in code, rather than
 * left as prose in a strategy document. A page cannot render a service it is
 * not allowed to sell in that jurisdiction, because the guard will not return it.
 *
 * This is the same pattern as an assertSellable() gate: the machine holds the
 * line so a copywriter or an agent cannot accidentally cross it at 2 AM.
 *
 * Three rules, in order:
 *   1. OUT-OF-SCOPE services are never sellable anywhere. Hard stop.
 *   2. PERMIT-REQUIRED services are sellable only where permitAuthority is 'full'.
 *      Anything 'unverified' fails safe to not sellable.
 *   3. SIZE-DEPENDENT services are sellable but must carry ceiling disclosure.
 */

import { SERVICES, OUT_OF_SCOPE_SLUGS, type Service } from '../config/services'
import { JURISDICTIONS, canPullPermit } from '../config/jurisdictions'
import { getLocation, type Location } from '../config/locations'

export class ScopeViolationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ScopeViolationError'
  }
}

export type SellDecision =
  | { sellable: true; requiresCeilingDisclosure: boolean }
  | { sellable: false; reason: string; publicExplanation: string }

/**
 * The single gate. Ask before rendering any service in any location context.
 */
export function assertSellable(serviceSlug: string, locationSlug?: string): SellDecision {
  if (OUT_OF_SCOPE_SLUGS.has(serviceSlug)) {
    return {
      sellable: false,
      reason: `"${serviceSlug}" is outside the Limited Licensed Plumber credential.`,
      publicExplanation:
        'This is separately licensed work in Tennessee. We refer it to a contractor we trust.',
    }
  }

  const service = SERVICES.find((s) => s.slug === serviceSlug)
  if (!service) {
    throw new ScopeViolationError(
      `Unknown service "${serviceSlug}". Add it to config/services.ts or remove the reference.`
    )
  }

  if (service.licenseScope === 'out') {
    return {
      sellable: false,
      reason: `"${serviceSlug}" is marked out of license scope.`,
      publicExplanation: 'Separately licensed work. We refer it out.',
    }
  }

  // Service-level page with no location context: permit status is disclosed on
  // the page rather than gating it, because the page covers the whole footprint.
  if (!locationSlug) {
    return {
      sellable: true,
      requiresCeilingDisclosure: service.licenseScope === 'size-dependent',
    }
  }

  const location = getLocation(locationSlug)
  if (!location) {
    throw new ScopeViolationError(
      `Unknown location "${locationSlug}". Add it to config/locations.ts.`
    )
  }

  if (service.requiresPermit && !canPullPermit(location.jurisdictionId)) {
    const j = JURISDICTIONS[location.jurisdictionId]
    const unverified = j?.permitAuthority === 'unverified'
    return {
      sellable: false,
      reason: unverified
        ? `Permit authority in ${j.name} is unverified. Failing safe.`
        : `Cannot pull permits in ${j?.name ?? location.jurisdictionId}.`,
      publicExplanation: unverified
        ? '' // renders nothing publicly — we simply omit the service
        : `Permit-required work in ${location.name} is handled by a licensed partner.`,
    }
  }

  return {
    sellable: true,
    requiresCeilingDisclosure: service.licenseScope === 'size-dependent',
  }
}

/** The services a given location page is allowed to render. Use this, not SERVICES. */
export function sellableServices(locationSlug: string): Service[] {
  return SERVICES.filter((s) => assertSellable(s.slug, locationSlug).sellable)
}

/** Services withheld from a location, with the reason. Powers the honesty block. */
export function withheldServices(
  locationSlug: string
): Array<{ service: Service; decision: Extract<SellDecision, { sellable: false }> }> {
  return SERVICES.map((s) => ({ service: s, decision: assertSellable(s.slug, locationSlug) }))
    .filter((r): r is { service: Service; decision: Extract<SellDecision, { sellable: false }> } =>
      !r.decision.sellable
    )
}

/** Human-readable scope summary for a location. Renders in the ScopeStrip component. */
export function scopeSummary(location: Location) {
  const j = JURISDICTIONS[location.jurisdictionId]
  const sellable = sellableServices(location.slug)
  return {
    jurisdiction: j?.name ?? location.jurisdictionId,
    permitAuthority: j?.permitAuthority ?? 'unverified',
    sellableCount: sellable.length,
    permitFreeOnly: j?.permitAuthority !== 'full',
  }
}
