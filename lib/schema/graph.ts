/**
 * JSON-LD @graph — 7 nodes, one shared root entity.
 *
 * Binding rules:
 *   · Every page's @graph references the SAME root #localbusiness @id.
 *   · The root is type Plumber (a LocalBusiness subtype). Never plain LocalBusiness.
 *   · NO streetAddress. Ever. This is a service-area business. The PostalAddress
 *     node carries locality, region, and postal code only.
 *   · areaServed is built from config/locations.ts, not hand-written.
 *   · The Person node carries the license. That is the E-E-A-T anchor and the
 *     single strongest differentiator in this market.
 *
 * Nodes: WebSite · WebPage · BreadcrumbList · Organization(Plumber) · Person ·
 *        Service · FAQPage
 */

import { LICENSE, IDENTITY, SAB, fact, factOr } from '../../config/business'
import { LOCATIONS } from '../../config/locations'
import type { Service } from '../../config/services'

const DEV_DOMAIN = 'https://example.invalid'

export function origin(): string {
  return factOr('IDENTITY.domain', IDENTITY.domain, DEV_DOMAIN)
}

export const ID = {
  website: () => `${origin()}/#website`,
  business: () => `${origin()}/#localbusiness`,
  owner: () => `${origin()}/#owner`,
  page: (path: string) => `${origin()}${path}#webpage`,
  breadcrumb: (path: string) => `${origin()}${path}#breadcrumb`,
  service: (slug: string) => `${origin()}/services/${slug}#service`,
  faq: (path: string) => `${origin()}${path}#faq`,
}

/** The Person node. Carries the license. Referenced by every service page. */
export function ownerNode() {
  const name = fact('LICENSE.holderName', LICENSE.holderName)
  return {
    '@type': 'Person',
    '@id': ID.owner(),
    name,
    jobTitle: fact('LICENSE.classification', LICENSE.classification),
    worksFor: { '@id': ID.business() },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'license',
      name: fact('LICENSE.classification', LICENSE.classification),
      identifier: fact('LICENSE.number', LICENSE.number),
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: fact('LICENSE.issuingAuthority', LICENSE.issuingAuthority),
      },
      validThrough: fact('LICENSE.expiresOn', LICENSE.expiresOn),
    },
  }
}

/** Root business node. Shared @id across every page on the site. */
export function businessNode() {
  return {
    '@type': 'Plumber',
    '@id': ID.business(),
    name: factOr('IDENTITY.displayName', IDENTITY.displayName, '[PENDING: display name]'),
    legalName: factOr('IDENTITY.legalName', IDENTITY.legalName, '[PENDING: legal name]'),
    url: origin(),
    telephone: factOr('IDENTITY.phone', IDENTITY.phone, '[PENDING: phone]'),
    email: factOr('IDENTITY.email', IDENTITY.email, '[PENDING: email]'),
    // Service-area business: locality only. No streetAddress property exists here
    // and none may be added. See scripts/lint-scope.ts check [1].
    address: {
      '@type': 'PostalAddress',
      addressLocality: SAB.addressLocality,
      addressRegion: SAB.addressRegion,
      postalCode: SAB.postalCode,
      addressCountry: SAB.country,
    },
    areaServed: LOCATIONS.map((l) => ({
      '@type': 'City',
      name: l.name,
      containedInPlace: { '@type': 'AdministrativeArea', name: `${l.county} County, TN` },
    })),
    founder: { '@id': ID.owner() },
    employee: { '@id': ID.owner() },
    priceRange: '$$',
  }
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ID.website(),
    url: origin(),
    name: factOr('IDENTITY.displayName', IDENTITY.displayName, '[PENDING: display name]'),
    publisher: { '@id': ID.business() },
  }
}

export function webPageNode(path: string, title: string, description: string) {
  return {
    '@type': 'WebPage',
    '@id': ID.page(path),
    url: `${origin()}${path}`,
    name: title,
    description,
    isPartOf: { '@id': ID.website() },
    about: { '@id': ID.business() },
    breadcrumb: { '@id': ID.breadcrumb(path) },
  }
}

export function breadcrumbNode(path: string, crumbs: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    '@id': ID.breadcrumb(path),
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${origin()}${c.url}`,
    })),
  }
}

/**
 * Service node. `areaServed` MUST come from the scope guard, never from the full
 * location list — a Service node claiming coverage where he cannot pull a permit
 * is the same violation as putting it in the page copy.
 */
export function serviceNode(service: Service, areaServedSlugs: string[]) {
  const areas = LOCATIONS.filter((l) => areaServedSlugs.includes(l.slug))
  return {
    '@type': 'Service',
    '@id': ID.service(service.slug),
    name: service.name,
    description: service.summary,
    serviceType: service.name,
    provider: { '@id': ID.business() },
    areaServed: areas.map((l) => ({ '@type': 'City', name: l.name })),
  }
}

export function faqNode(path: string, qa: Array<{ q: string; a: string }>) {
  return {
    '@type': 'FAQPage',
    '@id': ID.faq(path),
    mainEntity: qa.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function buildGraph(nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}
