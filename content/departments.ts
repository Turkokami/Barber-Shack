/**
 * RESIDENT STUDIOS — not departments.
 *
 * Barber Shack runs the common barbershop model: independent operators working
 * out of the shop. The shop is the HUB — the venue, the brand, the front door.
 * Each specialty is a SPOKE run by its own operator, and several are their own
 * legal entities.
 *
 * This is NOT a corporate parent/subsidiary structure, and modelling it as one
 * would be inaccurate. In schema terms the shop `containsPlace` each resident
 * studio; each studio is `containedInPlace` the shop. Nobody is anybody's
 * subsidiary and nobody is anybody's employee.
 *
 * CONSEQUENCE — read before writing any price, offer, or bio:
 * An independent operator sets their own prices, keeps their own book, and owns
 * their own client relationships. The shop cannot publish a price, a promotion,
 * or a person on their behalf without their agreement. See `participation`.
 */

export type Department = {
  slug: string;
  /** trading name — a spoke may trade under its own name while operating out of the hub */
  name: string;
  /** schema.org type for the department node */
  schemaType: string;
  /**
   * "house"    — operated by Barber Shack itself. The shop sets the price.
   * "resident" — an independent operator working out of the shop, often its own
   *              legal entity. The OPERATOR sets the price and owns the book.
   */
  entity: "house" | "resident";
  /** specialist slug who owns or leads this spoke */
  ledBy?: string;
  /**
   * What this operator has agreed IN WRITING to have published on the Barber Shack
   * site. Nothing may be published unless the corresponding flag is true.
   * Registry #30. Default is false for every field — silence is not consent.
   */
  participation: {
    listPrices: boolean;      // may we publish their price list + Offer schema?
    tuesdayProgram: boolean;  // do they participate in $12 Tuesdays?
    bioAndPhoto: boolean;     // may we publish their name, bio, photo?
    licenseDisplay: boolean;  // may we display their license number?
    bookingLink: boolean;     // may we link to their booking platform?
  };
  answer: string;
  /** why it belongs on this site rather than a separate brand */
  rationale: string;
  /** service slugs served by this department */
  services: string[];
  /** search opportunity note for the build queue */
  opportunity: string;
};

export const DEPARTMENTS: Department[] = [
  {
    slug: "barbering",
    participation: { listPrices: true, tuesdayProgram: true, bioAndPhoto: true, licenseDisplay: true, bookingLink: true },
    entity: "house",
    name: "Barbering",
    schemaType: "HairSalon",
    answer: "[DRAFT]",
    rationale: "The core trade. Ten service spokes, walk-in led, open seven days.",
    services: ["mens-haircut", "kids-haircut", "fade", "buzz-cut", "beard-trim",
               "straight-razor-shave", "line-up", "senior-cut", "military-cut", "wash-and-style"],
    opportunity: "High volume, high competition. Wins on hours, price, and walk-in availability.",
  },
  {
    slug: "salon",
    participation: { listPrices: false, tuesdayProgram: false, bioAndPhoto: false, licenseDisplay: false, bookingLink: false },
    entity: "house",
    name: "Full Salon",
    schemaType: "HairSalon",
    answer: "[DRAFT]",
    rationale: "Barber Shack is not men-only. The salon side needs its own surface or half the market never learns it exists.",
    services: ["[PLACEHOLDER — salon service list from Jared]"],
    opportunity: "Currently invisible. Anyone searching salon terms has no reason to find this shop.",
  },
  {
    slug: "textured-hair",
    participation: { listPrices: false, tuesdayProgram: false, bioAndPhoto: false, licenseDisplay: false, bookingLink: false },
    entity: "resident",
    ledBy: "shaquana",
    name: "Textured Hair, Braids & Locs",
    schemaType: "HairSalon",
    answer: "[DRAFT — Shaquana's voice, first person]",
    rationale:
      "A specialist trade with its own techniques, its own vocabulary, and its own customer. " +
      "Shaquana is a professional braider, loctician, and licensed instructor who teaches " +
      "textured hair — this is credentialed expertise, not a service line item.",
    services: ["[PLACEHOLDER — braid styles, loc maintenance, starter locs, retwist, " +
               "silk press, protective styles, natural cuts — from Shaquana]"],
    opportunity:
      "MOST UNDERSERVED CLUSTER IN THE MARKET. Whatcom County has very thin textured-hair " +
      "provision, and people routinely drive to Seattle for braids and loc care. Searchers use " +
      "highly specific terms (knotless braids, retwist, starter locs, silk press, protective " +
      "styles) that no local competitor targets. This also IS the inclusivity thesis in " +
      "practice — the shop that says everyone is welcome and can actually do everyone's hair. " +
      "Build in Phase 2 alongside the toupee studio.",
  },
  {
    slug: "toupee-studio",
    participation: { listPrices: false, tuesdayProgram: false, bioAndPhoto: false, licenseDisplay: false, bookingLink: false },
    entity: "resident",
    ledBy: "shaquana",
    name: "Toupee Studio",
    schemaType: "HealthAndBeautyBusiness",
    answer: "[DRAFT]",
    rationale:
      "Non-surgical hair systems, customized for all hair types. Co-founded by Shaquana with a " +
      "fellow industry professional, operating out of Barber Shack. ENTITY GATE RESOLVED: " +
      "Barber Shack is the HUB, the toupee studio is a SPECIALTY SPOKE. It carries its own named " +
      "node parented to Barber Shack — not folded into the root business — which is honest either " +
      "way and leaves the door open to spin it onto its own domain later without a rebuild.",
    services: ["[PLACEHOLDER — hair system services from Jared]"],
    opportunity:
      "HIGHEST-VALUE UNBUILT CLUSTER. High ticket, high intent, long consideration cycle, and " +
      "almost no local competition. Searchers use very specific language (hair system, hairpiece, " +
      "non-surgical replacement, topper) and are underserved everywhere. Prioritise in Phase 2.",
  },
  {
    slug: "tattoo-studio",
    participation: { listPrices: false, tuesdayProgram: false, bioAndPhoto: false, licenseDisplay: false, bookingLink: false },
    entity: "resident",
    name: "Tattoo Studio",
    schemaType: "TattooParlor",
    answer: "[DRAFT]",
    rationale: "A separate trade under the same roof. Needs artist pages, not just a service page.",
    services: ["[PLACEHOLDER — tattoo services and artists from Jared]"],
    opportunity:
      "Tattoo search is artist-led, not shop-led. Build per-artist pages with portfolio and " +
      "booking, or the cluster will not rank. Confirm licensing display requirements for WA.",
  },
  {
    slug: "apprenticeship",
    participation: { listPrices: false, tuesdayProgram: false, bioAndPhoto: false, licenseDisplay: false, bookingLink: false },
    entity: "resident",
    ledBy: "shaquana",
    name: "Apprentice Program",
    schemaType: "EducationalOrganization",
    answer: "[DRAFT]",
    rationale:
      "The shop trains barbers. That is a genuine E-E-A-T signal — a business that teaches its " +
      "trade is treated as an authority in it — and it doubles as the recruiting funnel. " +
      "Built from the ground up by Shaquana, a licensed instructor who was herself trained at " +
      "The Barber Shack. That loop is the strongest proof the program works.",
    services: [],
    opportunity:
      "Two audiences on one page set: prospective apprentices (recruiting) and customers " +
      "(credibility). Split them. Confirm WA licensing and apprenticeship-hour requirements.",
  },
];

export const getDepartment = (slug: string) => DEPARTMENTS.find((d) => d.slug === slug);

/** Accessibility is a first-class fact here, not a footer line. */
export const ACCESSIBILITY = {
  wheelchairAccessible: true,
  sensoryFriendly: true,
  /** Every claim below requires Jared's written confirmation before publish. */
  practices: [
    "[CONFIRM] Quiet chair available on request",
    "[CONFIRM] Same barber each visit where possible",
    "[CONFIRM] Clipper-free options",
    "[CONFIRM] Parent can stay with the child in the chair",
    "[CONFIRM] Appointment outside busy hours to avoid the wait",
  ],
} as const;

/** Resident studios get their own containedInPlace schema node. House departments do not. */
export const RESIDENTS = DEPARTMENTS.filter((d) => d.entity === "resident");

/** Publish gate for anything belonging to an independent operator. */
export function mayPublish(
  d: Department,
  field: keyof Department["participation"]
): boolean {
  if (d.entity === "house") return true;
  return d.participation[field] === true;
}
