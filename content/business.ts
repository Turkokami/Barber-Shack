/**
 * THE CONSTANTS FILE — Master Plan v1, Rule 2.
 * Define once, inject everywhere. No string literal for name, phone, address,
 * or hours appears anywhere else in this repo.
 *
 * PLACEHOLDER values are unresolved entries from the Open Placeholder Registry.
 * Do NOT invent values. requireResolved() throws at build time if one reaches
 * a rendered page — that is deliberate.
 */

export const PLACEHOLDER = "[PLACEHOLDER]" as const;

export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export const BUSINESS = {
  name: "Barber Shack",
  // registry #12 — owner-confirmed (Jared): "Barber Shack LLC".
  legalName: "Barber Shack LLC",
  ubi: "604616657",        // WA Unified Business Identifier (public record)
  shopLicense: "21030257", // WA salon/shop license number (public record)
  url: "https://bellinghambarbershack.com",

  street: "2500 Cedarwood Ave",
  city: "Bellingham",
  region: "WA",
  postal: "98225",
  country: "US",

  // registry #1 — confirmed by owner (Jared) and by Yelp / Vagaro / Square listings.
  phoneDisplay: "(360) 296-9190",
  phoneTel: "+13602969190",
  // registry #2 — STILL A PLACEHOLDER BY DESIGN. Jared's preferred address is a
  // gmail (Mrjjv360@gmail.com), but the spec (registry #2, ticket 0.5, Hard Rule)
  // requires a DOMAIN mailbox published here, with gmail used only as a forward
  // target. Set up e.g. jared@bellinghambarbershack.com → forwards to the gmail,
  // then resolve this. Do NOT publish the gmail as the business email.
  email: PLACEHOLDER,              // registry #2 — @bellinghambarbershack.com, NOT gmail
  // registry #4 — owner-confirmed (Jared). The BUSINESS was founded in Lake
  // Stevens in 2011; the Bellingham shop opened later. Keep the two distinct —
  // "on Cedarwood since 2011" was wrong and is what these fields exist to prevent.
  founded: "2011",
  foundedCity: "Lake Stevens",
  /** When the Bellingham (Birchwood) shop opened — owner-confirmed. */
  bellinghamSince: "June 2014",
  // registry #5 — owner-confirmed. Professional form used for the About byline;
  // full legal name is "Jared Rame Jones Valentine" if the byline should carry it.
  owner: "Jared Jones-Valentine",

  // registry #6 — rooftop geocode of the street address (US Census geocoder,
  // Public_AR_Current). Accurate to the parcel; reconcile with the GBP pin at launch.
  geo: { lat: "48.773751", lng: "-122.496339" },

  /** registry #3 — all seven days, explicitly. Sunday is a differentiator; never omit it.
   *  Values below extracted from the shop's current site (ticket 0.1). 24h format for
   *  schema.org OpeningHoursSpecification. CONFIRM against GBP before launch (0.6). */
  hours: [
    { day: "Mon" as Day, opens: "09:00", closes: "18:00" },
    { day: "Tue" as Day, opens: "09:00", closes: "18:00" },
    { day: "Wed" as Day, opens: "09:00", closes: "18:00" },
    { day: "Thu" as Day, opens: "09:00", closes: "18:00" },
    { day: "Fri" as Day, opens: "09:00", closes: "18:00" },
    { day: "Sat" as Day, opens: "09:00", closes: "17:00" },
    { day: "Sun" as Day, opens: "10:00", closes: "16:00" },
  ],

  priceRange: "$",

  /** Verified GBP figures ONLY. Never hand-entered. Refresh quarterly (P6-04). */
  rating: "4.5",
  reviewCount: "702",

  // registry #7 — GBP place URL, derived from the CID in the owner's Maps link
  // (feature id 0x5485a36c763d0623:0xfd610d82a6c92f98 → cid 18257889219131813784).
  gbpUrl: "https://www.google.com/maps?cid=18257889219131813784",
  // registry #7 — the QR "leave a review" link. A raw CID opens the listing but
  // NOT the review box. Grab the true one-tap link from the GBP dashboard
  // ("Ask for reviews" → g.page/r/…/review) before printing QR cards.
  reviewUrl: "https://g.page/r/CZgvyaaCDWH9EAE/review", // registry #7 — opens the Google review box; for QR cards
  // registry #11 — P2-01 RESOLVED: Vagaro is the primary book (owner's call).
  // Must still present walk-in AND appointment paths in the UI (BookingEmbed).
  bookingUrl: "https://www.vagaro.com/barbershackllc",

  // registry #7 — canonical social profiles from the shop's own site. GBP URL to
  // be appended once resolved. Never the facebook/google "share" short links.
  sameAs: [
    "https://www.facebook.com/bellinghambarbershack",
    "https://www.instagram.com/bellinghambarbershack",
  ] as string[],
} as const;

/** Build-time guard. Any unresolved placeholder reaching a rendered page fails the build. */
export function requireResolved<T>(value: T, registryItem: string): T {
  if (value === PLACEHOLDER || (Array.isArray(value) && value.includes(PLACEHOLDER))) {
    throw new Error(
      `[UNRESOLVED PLACEHOLDER] ${registryItem} — see Open Placeholder Registry. ` +
      `Do not invent a value. Resolve it with the owner, then rebuild.`
    );
  }
  return value;
}

/**
 * Type-safe "is this field filled in?" check. Because BUSINESS is `as const`,
 * a resolved field has a narrow literal type, and a raw `field !== PLACEHOLDER`
 * comparison is rejected by TypeScript as a no-overlap comparison (TS2367).
 * Widening the argument to `string` here makes the check valid whether or not
 * the field is still a placeholder.
 */
export const isResolved = (value: string): boolean => value !== PLACEHOLDER;

export const NAP = {
  full: `${BUSINESS.street}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postal}`,
  cityState: `${BUSINESS.city}, ${BUSINESS.region}`,
} as const;
