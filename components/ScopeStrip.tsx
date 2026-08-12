/**
 * SIGNATURE COMPONENTS
 *
 * CredentialStrip renders the license as verifiable data — number, class,
 * issuing body, expiry, verification link. Across the eighteen competitors in
 * the August 2026 analysis, none surface a license number publicly. Showing it
 * as spec-sheet data rather than a marketing badge is the whole point.
 *
 * ScopeStrip renders, per location, exactly what he can and cannot do there.
 * It is the honest form of the permit constraint. A visitor in Chattanooga sees
 * that drain and emergency work is covered and that permitted work is referred
 * out — which builds more trust than a service list that quietly omits things.
 */

import { LICENSE, fact } from '@/config/business'
import { JURISDICTIONS } from '@/config/jurisdictions'
import { sellableServices, withheldServices } from '@/lib/scope-guard'
import { OUT_OF_SCOPE } from '@/config/services'
import type { Location } from '@/config/locations'

export function CredentialStrip() {
  const holder = fact('LICENSE.holderName', LICENSE.holderName)
  const number = fact('LICENSE.number', LICENSE.number)
  const classification = fact('LICENSE.classification', LICENSE.classification)
  const authority = fact('LICENSE.issuingAuthority', LICENSE.issuingAuthority)
  const expires = fact('LICENSE.expiresOn', LICENSE.expiresOn)
  const verifyUrl = fact('LICENSE.verifyUrl', LICENSE.verifyUrl)

  return (
    <section aria-labelledby="credential-heading" className="border border-ink/15 bg-galv p-6">
      <h2 id="credential-heading" className="font-mono text-spec uppercase text-steel">
        State license
      </h2>
      <dl className="mt-4">
        <div className="spec-row">
          <dt className="spec-label">Holder</dt>
          <dd className="spec-value">{holder}</dd>
        </div>
        <div className="spec-row">
          <dt className="spec-label">License no.</dt>
          {/* The number itself, at size. This is the argument. */}
          <dd className="spec-value text-lg font-mono tracking-wider text-verdigris">{number}</dd>
        </div>
        <div className="spec-row">
          <dt className="spec-label">Classification</dt>
          <dd className="spec-value">{classification}</dd>
        </div>
        <div className="spec-row">
          <dt className="spec-label">Issued by</dt>
          <dd className="spec-value text-right">{authority}</dd>
        </div>
        <div className="spec-row border-b-0">
          <dt className="spec-label">Active through</dt>
          <dd className="spec-value">{expires}</dd>
        </div>
      </dl>
      <a
        href={verifyUrl ?? '#'}
        className="mt-4 inline-block font-mono text-spec uppercase text-copper underline underline-offset-4"
        rel="noopener"
      >
        Verify this license with the State of Tennessee →
      </a>
    </section>
  )
}

export function ScopeStrip({ location }: { location: Location }) {
  const jurisdiction = JURISDICTIONS[location.jurisdictionId]
  const covered = sellableServices(location.slug)
  const withheld = withheldServices(location.slug).filter(
    (w) => w.decision.publicExplanation.length > 0
  )
  const confirmedExclusion = jurisdiction?.permitAuthority === 'none'

  return (
    <section aria-labelledby="scope-heading" className="border-l-2 border-verdigris bg-galv p-6">
      <h2 id="scope-heading" className="font-mono text-spec uppercase text-steel">
        What we cover in {location.name}
      </h2>

      <ul className="mt-4 grid gap-1 sm:grid-cols-2">
        {covered.map((s) => (
          <li key={s.slug} className="font-body text-sm">
            <a href={`/services/${s.slug}`} className="text-ink hover:text-copper">
              {s.name}
            </a>
          </li>
        ))}
      </ul>

      {confirmedExclusion && withheld.length > 0 && (
        <div className="mt-6 border-t border-ink/10 pt-4">
          <h3 className="font-mono text-spec uppercase text-steel">Referred to a partner here</h3>
          <p className="mt-2 max-w-prose font-body text-sm text-steel">
            Permit-required work inside {jurisdiction.name} is handled by a licensed partner. We
            still take the call and make the introduction.
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {withheld.map((w) => (
              <li key={w.service.slug} className="font-body text-sm text-steel">
                {w.service.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 border-t border-ink/10 pt-4">
        <h3 className="font-mono text-spec uppercase text-steel">Not our trade</h3>
        <ul className="mt-2 space-y-1">
          {OUT_OF_SCOPE.map((o) => (
            <li key={o.slug} className="font-body text-sm text-steel">
              {o.name} — referred to a {o.referTo}.
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
