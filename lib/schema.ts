/**
 * THE SINGLE SCHEMA EMITTER — Master Plan v1 §5.
 * No page writes JSON-LD inline. Every node is built here and referenced by @id.
 *
 * Subtype note: schema.org has no `BarberShop` type. The root is HairSalon.
 * Resident studios (tattoo, toupee, textured-hair, apprenticeship) are independent
 * operators — they attach via `containsPlace` / `containedInPlace`, NOT `department`
 * or `employee`. See Amendment C: modelling them as departments or staff would be
 * inaccurate structured data, and for licensed trades would misstate liability.
 */
import { BUSINESS as B, NAP } from "@/content/business";
import { SPECIALISTS } from "@/content/specialists";
import { RESIDENTS, mayPublish } from "@/content/departments";
import type { Department } from "@/content/departments";
import type { Service } from "@/content/services";
import type { Neighborhood } from "@/content/neighborhoods";
import type { Specialist } from "@/content/specialists";
import type { Review } from "@/content/reviews";
import { OWNER } from "@/content/owner";

export const ID = {
  website: `${B.url}/#website`,
  business: `${B.url}/#localbusiness`,
  logo: `${B.url}/#logo`,
  studio: (slug: string) => `${B.url}/#studio-${slug}`,
  barber: (slug: string) => `${B.url}/#barber-${slug}`,
  person: (slug: string) => `${B.url}/#person-${slug}`,
  service: (url: string) => `${url}#service`,
  webpage: (url: string) => `${url}#webpage`,
  faq: (url: string) => `${url}#faq`,
  crumbs: (url: string) => `${url}#breadcrumb`,
} as const;

const address = {
  "@type": "PostalAddress",
  streetAddress: B.street,
  addressLocality: B.city,
  addressRegion: B.region,
  postalCode: B.postal,
  addressCountry: B.country,
};

const openingHours = B.hours.map((h) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: `https://schema.org/${
    { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday",
      Fri: "Friday", Sat: "Saturday", Sun: "Sunday" }[h.day]
  }`,
  opens: h.opens,
  closes: h.closes,
}));

/** Root nodes. Declared once, referenced everywhere. */
export function rootNodes() {
  return [
    {
      "@type": "WebSite",
      "@id": ID.website,
      url: `${B.url}/`,
      name: B.name,
      publisher: { "@id": ID.business },
    },
    {
      "@type": ["LocalBusiness", "HairSalon"],
      "@id": ID.business,
      name: B.name,
      legalName: B.legalName,
      identifier: [
        { "@type": "PropertyValue", propertyID: "UBI", value: B.ubi },
        { "@type": "PropertyValue", propertyID: "WA Salon/Shop License", value: B.shopLicense },
      ],
      url: `${B.url}/`,
      telephone: B.phoneTel,
      email: B.email,
      priceRange: B.priceRange,
      foundingDate: B.founded,
      address,
      geo: { "@type": "GeoCoordinates", latitude: B.geo.lat, longitude: B.geo.lng },
      openingHoursSpecification: openingHours,
      areaServed: [
        { "@type": "City", name: "Bellingham" },
        { "@type": "City", name: "Ferndale" },
        { "@type": "City", name: "Lynden" },
        { "@type": "AdministrativeArea", name: "Whatcom County" },
      ],
      // Accessibility is a fact about this business, not a footer line.
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Wheelchair accessible entrance", value: true },
        { "@type": "LocationFeatureSpecification", name: "Walk-ins welcome", value: true },
        { "@type": "LocationFeatureSpecification", name: "Open seven days", value: true },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: B.rating,
        reviewCount: B.reviewCount,
      },
      sameAs: B.sameAs,
      // Independent operators are NOT employees. Modelling them as staff would
      // misstate the relationship and, for licensed trades, misstate liability.
      // The shop contains their studios; it does not employ them.
      containsPlace: RESIDENTS.map((d) => ({ "@id": ID.studio(d.slug) })),
    },
  ];
}

type Crumb = { name: string; item: string };

/** The 7-node page graph. Every route uses this. */
export function pageGraph(opts: {
  url: string;
  name: string;
  description: string;
  image?: string;
  primary?: Record<string, unknown>;
  faqs?: { q: string; a: string }[];
  crumbs: Crumb[];
}) {
  const { url, name, description, image, primary, faqs, crumbs } = opts;

  const nodes: Record<string, unknown>[] = [
    ...rootNodes(),
    {
      "@type": "WebPage",
      "@id": ID.webpage(url),
      url,
      name,
      description,
      isPartOf: { "@id": ID.website },
      about: { "@id": ID.business },
      ...(image && { primaryImageOfPage: { "@id": `${url}#image` } }),
    },
    ...(image
      ? [{ "@type": "ImageObject", "@id": `${url}#image`, url: image, contentUrl: image }]
      : []),
    ...(primary ? [primary] : []),
    ...(faqs && faqs.length
      ? [{
          "@type": "FAQPage",
          "@id": ID.faq(url),
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }]
      : []),
    {
      "@type": "BreadcrumbList",
      "@id": ID.crumbs(url),
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: c.item,
      })),
    },
  ];

  return { "@context": "https://schema.org", "@graph": nodes };
}

/**
 * Service + Offer. THE highest-leverage node in this build.
 * The $12 Tuesday rate is currently invisible at the moment of decision.
 * This is what makes it machine-readable to Google and to answer engines.
 */
export function serviceNode(svc: Service, url: string) {
  return {
    "@type": "Service",
    "@id": ID.service(url),
    name: svc.name,
    serviceType: svc.serviceType,
    description: svc.answer,
    provider: { "@id": ID.business },
    areaServed: { "@type": "City", name: B.city },
    offers: {
      "@type": "Offer",
      price: svc.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      ...(svc.tuesdayPrice && {
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: svc.tuesdayPrice,
          priceCurrency: "USD",
          name: "$12 Tuesdays",
          description:
            "Tuesday access rate, available to everyone all day, no qualifying required.",
        },
      }),
    },
  };
}


/**
 * Person node for a named specialist — the E-E-A-T spine.
 *
 * `hasCredential` with real WA license numbers is what separates a credentialed
 * expert from a staff bio. `alumniOf` pointing at the business itself is unusual
 * and true here: Shaquana trained at The Barber Shack and now teaches there.
 */
export function personNode(sp: Specialist) {
  return {
    "@type": "Person",
    "@id": ID.person(sp.slug),
    name: sp.name,
    jobTitle: sp.role,
    description: sp.bio,
    image: sp.photo,
    // An independent operator does not `worksFor` the shop. Where she owns a
    // resident studio, that studio is the employer relationship. `alumniOf` the
    // shop is separately true and is the strongest signal on this node.
    ...(sp.alumniOfShop && { alumniOf: { "@id": ID.business } }),
    workLocation: { "@id": ID.business },
    knowsAbout: sp.knowsAbout,
    hasCredential: sp.credentials.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: c.name,
      identifier: c.licenseNumber,
      recognizedBy: { "@type": "GovernmentOrganization", name: c.issuedBy },
    })),
  };
}


/**
 * Resident studio node — an independent operator working out of Barber Shack.
 *
 * `containedInPlace` is the accurate relationship. NOT `department` (implies the
 * shop runs it), NOT `subOrganization` (implies corporate ownership), NOT
 * `employee` (implies staff). The shop is the venue and the front door; the
 * operator is their own business.
 *
 * Nothing belonging to the operator is emitted without their written agreement.
 */
export function residentNode(d: Department) {
  const lead = d.ledBy ? SPECIALISTS.find((sp) => sp.slug === d.ledBy) : undefined;
  return {
    "@type": ["LocalBusiness", d.schemaType],
    "@id": ID.studio(d.slug),
    name: d.name,
    address,
    containedInPlace: { "@id": ID.business },
    ...(lead && mayPublish(d, "bioAndPhoto") && { founder: { "@id": ID.person(lead.slug) } }),
  };
}

export function neighborhoodNode(n: Neighborhood, url: string) {
  return {
    "@type": "Service",
    "@id": ID.service(url),
    name: `Barbering in ${n.name}, ${B.city}`,
    provider: { "@id": ID.business },
    areaServed: { "@type": "Place", name: `${n.name}, ${NAP.cityState}` },
  };
}

/**
 * Verified Review nodes, attributed to the root LocalBusiness. Only ever built
 * from real, verbatim reviews (Hard Prohibition #5) — the array is empty until
 * genuine reviews are pasted into content/reviews.ts.
 */
/**
 * Owner Person node — Jared. A named, credentialed founder is a top-tier E-E-A-T
 * signal. `alumniOf` his training school and `hasCredential` for the WA instructor
 * license (identifier added once the number is on file) make it verifiable.
 */
export function ownerNode() {
  return {
    "@type": "Person",
    "@id": `${B.url}/#owner`,
    name: OWNER.name,
    jobTitle: OWNER.role,
    description: OWNER.bio.join(" "),
    image: `${B.url}${OWNER.photo}`,
    worksFor: { "@id": ID.business },
    knowsAbout: OWNER.knowsAbout,
    alumniOf: { "@type": "EducationalOrganization", name: "Paroba Cosmetology School, Everett" },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: "Cosmetologist",
        identifier: OWNER.cosmetologistLicense,
        recognizedBy: { "@type": "GovernmentOrganization", name: "Washington State Department of Licensing" },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: "Instructor, Cosmetology",
        identifier: OWNER.instructorLicense,
        recognizedBy: { "@type": "GovernmentOrganization", name: "Washington State Department of Licensing" },
      },
    ],
  };
}

export function reviewNodes(reviews: Review[], url: string) {
  return reviews.map((r, i) => ({
    "@type": "Review",
    "@id": `${url}#review-${i}`,
    itemReviewed: { "@id": ID.business },
    author: { "@type": "Person", name: r.author },
    reviewRating: { "@type": "Rating", ratingValue: String(r.rating), bestRating: "5" },
    reviewBody: r.text,
    ...(r.date && { datePublished: r.date }),
  }));
}
