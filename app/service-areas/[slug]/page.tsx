/**
 * REFERENCE IMPLEMENTATION — location page.
 *
 * This is the canonical pattern. Every other page type follows its shape:
 *   1. Resolve config. Never hardcode a business fact.
 *   2. Ask the scope guard what may be rendered. Never map over SERVICES directly.
 *   3. Build the @graph from the SAME data the page renders, so markup and copy
 *      can never disagree.
 *
 * Note what this page does NOT do: it does not list services and then hide some
 * with CSS, and it does not write a service name into JSX. The guard decides.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LOCATIONS, getLocation } from '@/config/locations'
import { JURISDICTIONS } from '@/config/jurisdictions'
import { sellableServices } from '@/lib/scope-guard'
import { ScopeStrip, CredentialStrip } from '@/components/ScopeStrip'
import {
  buildGraph,
  websiteNode,
  webPageNode,
  breadcrumbNode,
  businessNode,
  ownerNode,
  faqNode,
} from '@/lib/schema/graph'
import { IDENTITY, factOr } from '@/config/business'

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const location = getLocation(slug)
  if (!location) return {}
  const name = factOr('IDENTITY.displayName', IDENTITY.displayName, 'Licensed TN Plumber')
  return {
    title: `Plumber in ${location.name}, TN | ${name}`,
    description:
      `Licensed plumbing in ${location.name}, ${location.county} County. ` +
      `Tennessee license #5045. ${location.localFacts[0]}`,
    alternates: { canonical: `/service-areas/${location.slug}` },
  }
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const location = getLocation(slug)
  if (!location) notFound()

  const jurisdiction = JURISDICTIONS[location.jurisdictionId]
  const services = sellableServices(location.slug)
  const path = `/service-areas/${location.slug}`

  // AEO quick-answer. Must state the true coverage, including limits.
  const quickAnswer =
    jurisdiction?.permitAuthority === 'none'
      ? `We cover ${location.name} for drain cleaning, emergency leak repair, and fixture work — ` +
        `the jobs that need no permit. Permit-required work inside the city goes to a licensed partner.`
      : `We cover ${location.name} and the surrounding ${location.county} County area, ` +
        `${location.driveMinutes} minutes from our base in Charleston.`

  const faqs = [
    {
      q: `Do you actually serve ${location.name}, or just list it?`,
      a: `${location.name} is ${location.driveMinutes} minutes from our base in Charleston. ${location.localFacts[0]}`,
    },
    {
      q: `Are you licensed to work in ${location.name}?`,
      a: `Yes. Tennessee Limited Licensed Plumber #5045, issued by the Board for Licensing Contractors and verifiable through the state's public lookup.`,
    },
  ]

  const graph = buildGraph([
    websiteNode(),
    businessNode(),
    ownerNode(),
    webPageNode(path, `Plumber in ${location.name}, TN`, quickAnswer),
    breadcrumbNode(path, [
      { name: 'Home', url: '/' },
      { name: 'Service Areas', url: '/service-areas' },
      { name: location.name, url: path },
    ]),
    faqNode(path, faqs),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      <article className="mx-auto max-w-4xl px-5 py-12">
        <p className="font-mono text-spec uppercase text-steel">
          {location.county} County · {location.driveMinutes} min from Charleston
        </p>
        <h1 className="mt-2 text-display-xl">Plumber in {location.name}, Tennessee</h1>

        {/* AEO quick answer — first substantive block on every page. */}
        <p className="mt-6 max-w-prose border-l-2 border-copper pl-4 text-lg text-ink">
          {quickAnswer}
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-display-lg">What we see in {location.name}</h2>
            <ul className="mt-4 space-y-3">
              {location.localFacts.map((f) => (
                <li key={f} className="max-w-prose text-ink/90">
                  {f}
                </li>
              ))}
            </ul>
            {location.utility && (
              <p className="mt-6 font-mono text-spec uppercase text-steel">
                Water utility · <span className="spec-value">{location.utility}</span>
              </p>
            )}
          </div>

          <div className="space-y-6">
            <ScopeStrip location={location} />
            <CredentialStrip />
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-display-lg">Common questions</h2>
          <dl className="mt-4 space-y-6">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-display text-lg">{f.q}</dt>
                <dd className="mt-1 max-w-prose text-ink/90">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-10 font-mono text-spec uppercase text-steel">
          {services.length} services available in this jurisdiction
        </p>
      </article>
    </>
  )
}
