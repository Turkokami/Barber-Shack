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

/** Long-form hub copy for a department page that has actually shipped. */
export type DeptSection = {
  heading: string;
  body?: string;
  /** named sub-offerings under the section, e.g. "Buzz Cut & Line-Up" */
  items?: { name: string; detail: string }[];
};
export type DeptOverview = {
  intro: string;
  sections: DeptSection[];
};

/**
 * How a department's conversion block behaves. Defaults by entity when unset:
 * house → "services" (shop price board + booking), resident → "studio"
 * (booked with the independent operator). "coming-soon" is for a pre-launch
 * program that collects interest via the contact page rather than a booking.
 */
export type DeptCta =
  | { kind: "services" }
  | { kind: "studio" }
  | { kind: "coming-soon"; note: string };

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
  /** page FAQs — optional, per department. An FAQPage node is emitted only if present. */
  faqs?: { q: string; a: string }[];
  /** external booking URL for a resident operator — rendered only when participation.bookingLink is true */
  bookingUrl?: string;
  /** conversion block behavior. Falls back to an entity default when unset. */
  cta?: DeptCta;
  /** long-form page copy — present only once the hub has shipped with real content */
  overview?: DeptOverview;
};

export const DEPARTMENTS: Department[] = [
  {
    slug: "barbering",
    participation: { listPrices: true, tuesdayProgram: true, bioAndPhoto: true, licenseDisplay: true, bookingLink: true },
    entity: "house",
    name: "Barbering",
    schemaType: "HairSalon",
    answer:
      "Barbering is the core trade at Barber Shack: precision haircuts, beard and facial-hair " +
      "design, and traditional hot-towel straight-razor shaves. We pair classic barbering with " +
      "modern technique — walk-in led, open seven days a week including Sunday, with $12 haircuts " +
      "for everyone every Tuesday.",
    rationale: "The core trade. Ten service spokes, walk-in led, open seven days.",
    services: ["mens-haircut", "kids-haircut", "fade", "buzz-cut", "beard-trim",
               "straight-razor-shave", "line-up", "senior-cut", "military-cut", "wash-and-style"],
    opportunity: "High volume, high competition. Wins on hours, price, and walk-in availability.",
    faqs: [
      { q: "Do I need an appointment for a haircut?", a: "No — walk-ins are welcome every day we're open, including Sunday. You can also book ahead if you'd rather lock in a time." },
      { q: "Are haircuts really $12 on Tuesdays?", a: "Yes. Every Tuesday, haircuts are $12 for everyone, all day — no qualifying and no questions asked." },
    ],
    overview: {
      intro:
        "At Barber Shack, getting a haircut isn't just an item on your to-do list — it's an " +
        "experience. We combine classic, time-honored barbering traditions with modern techniques " +
        "to make sure you leave looking sharp, feeling refreshed, and ready to take on the week.",
      sections: [
        {
          heading: "The Full Barber Experience",
          body:
            "Our hallmark service. Step into the chair for a complete top-to-bottom refresh. This " +
            "package includes a custom precision haircut, a tailored beard trim or line-up, hot " +
            "towel service, and a classic neck shave to finish strong.",
        },
        {
          heading: "Precision Haircuts",
          body:
            "Tailored entirely to your style, head shape, and hair type. Every cut includes a " +
            "detailed consultation, a clean neckline, a hot towel finish, and professional styling " +
            "with premium product.",
          items: [
            { name: "Classic & Modern Cuts", detail: "Fades, side parts, pompadours, crop tops, and traditional scissor cuts." },
            { name: "Buzz Cut & Line-Up", detail: "Clean, sharp, and low-maintenance." },
          ],
        },
        {
          heading: "Beard & Facial Hair Design",
          body: "Keep your facial hair structured, healthy, and pristine.",
          items: [
            { name: "Beard Sculpting & Trim", detail: "Full beard shaping, bulk reduction, and precise lines using clippers and shears, finished with nourishing beard oil." },
            { name: "Beard Detail & Edge-Up", detail: "Quick maintenance to clean up the cheeks, mustache, and neckline between full cuts." },
          ],
        },
        {
          heading: "Traditional Hot Towel Shaves",
          body:
            "The ultimate classic barbering service. Relax with warm steam towels, pre-shave oils, " +
            "and rich lather, then a smooth straight-razor shave, followed by a cool towel finish " +
            "and a soothing post-shave treatment.",
        },
      ],
    },
  },
  {
    slug: "salon",
    participation: { listPrices: false, tuesdayProgram: false, bioAndPhoto: false, licenseDisplay: false, bookingLink: false },
    entity: "house",
    name: "Full Salon",
    schemaType: "HairSalon",
    answer:
      "The salon at Barber Shack — Studio A, the Hair Hut — offers full hair design and custom " +
      "styling: precision cuts, blowouts, and event styling; advanced color from balayage and " +
      "highlights to gray coverage and corrective color; and hair-health treatments like deep " +
      "conditioning and keratin smoothing. Open seven days in Bellingham.",
    rationale: "Barber Shack is not men-only. The salon side needs its own surface or half the market never learns it exists.",
    services: ["[PLACEHOLDER — salon service list from Jared]"],
    opportunity: "Currently invisible. Anyone searching salon terms has no reason to find this shop.",
    faqs: [
      { q: "What does the salon offer?", a: "Hair design and custom styling, advanced color, and hair-health treatments — from precision cuts and event styling to balayage, gray coverage, and keratin smoothing." },
      { q: "Should I book ahead for color or treatments?", a: "For color and treatment services, booking ahead helps your stylist set aside enough time — book online or call the shop. For a cut or style, you're welcome to walk in any day we're open." },
    ],
    overview: {
      intro:
        "Step into Studio A, the Hair Hut — designed for relaxation, renewal, and transformation. " +
        "The salon offers comprehensive services to help you look and feel your absolute best.",
      sections: [
        {
          heading: "Hair Design & Custom Styling",
          body:
            "From everyday maintenance to complete transformations, our stylists deliver precision " +
            "cuts, vibrant color, and healthy hair care tailored to your unique lifestyle and aesthetic.",
          items: [
            { name: "Custom Cuts & Styling", detail: "Precision cuts, layers, blowouts, special-occasion updos, and event styling." },
            { name: "Advanced Color Services", detail: "Full and partial balayage, highlights, lowlights, gray coverage, vivid colors, and corrective color solutions." },
            { name: "Hair Health & Restoration", detail: "Deep conditioning, keratin smoothing treatments, scalp detoxes, and moisture-locking therapies." },
          ],
        },
      ],
    },
  },
  {
    slug: "textured-hair",
    participation: { listPrices: false, tuesdayProgram: false, bioAndPhoto: false, licenseDisplay: false, bookingLink: false },
    entity: "resident",
    ledBy: "shaquana",
    name: "Textured Hair, Braids & Locs",
    schemaType: "HairSalon",
    answer:
      "Barber Shack's textured-hair studio specializes in coily, curly, and wavy hair: precision " +
      "cuts and fades for textured hair, curl shaping, and deep-moisture scalp treatments; full " +
      "loc care from starter locs to retwists, detoxes, and styling; plus box and knotless braids, " +
      "cornrows, and twists — protective styles built to last, in Bellingham.",
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
    faqs: [
      { q: "Do you do knotless braids and locs?", a: "Yes — the textured-hair studio does box and knotless braids, cornrows, and twists, plus full loc care from starter locs to retwists, detoxes, and styling." },
      { q: "Do you cut curly and coily hair?", a: "Yes. Textured precision cuts and fades are shaped to your curl pattern, with curl consultation and deep-moisture scalp treatments to keep it healthy." },
    ],
    overview: {
      intro:
        "At Barber Shack, we specialize in textured, coiled, curly, and wavy hair care. Whether " +
        "you're maintaining established locs, getting a fresh set of protective braids, or looking " +
        "for precision cuts and moisture care tailored to your natural curl pattern, our services " +
        "are designed to protect your hair's natural health while delivering clean, long-lasting style.",
      sections: [
        {
          heading: "Textured Hair Precision Cuts & Care",
          body:
            "Curls and coils require specialized cutting and hydration techniques to maintain their " +
            "natural bounce, definition, and structural integrity.",
          items: [
            { name: "Textured Precision Cuts & Fades", detail: "Custom cuts designed specifically for curly, coily, and kinky hair textures, keeping lines crisp and volume balanced." },
            { name: "Curl Consultation & Shaping", detail: "Dry and wet cutting methods tailored to your unique curl pattern to enhance natural shape and prevent shrinkage distortion." },
            { name: "Deep Moisture & Scalp Treatments", detail: "Intensive hydration masks, hot oil therapies, and scalp detoxes designed to lock in moisture, combat dryness, and promote healthy growth." },
          ],
        },
        {
          heading: "Loc Maintenance & Styling",
          body:
            "From starter locs to mature loc care, we offer complete maintenance to keep your locs " +
            "healthy, neat, and strong from root to tip.",
          items: [
            { name: "Starter Locs", detail: "Professional palm rolling, comb coils, or two-strand twists to set a clean, solid foundation for your loc journey." },
            { name: "Loc Retwist & Maintenance", detail: "Clean palm-rolling and scalp care to keep roots tidy and secure fresh growth without causing tension or breakage." },
            { name: "Loc Detox & Deep Cleanse", detail: "An invigorating apple cider vinegar and essential oil soak to remove product buildup, lint, and deep-seated debris without stripping natural oils." },
            { name: "Loc Styling", detail: "Creative updos, barrel twists, braided loc styles, and rope twists for special occasions or low-maintenance daily wear." },
          ],
        },
        {
          heading: "Braids & Protective Styles",
          body:
            "Clean parts, balanced tension, and protective designs that prioritize both longevity " +
            "and edge protection.",
          items: [
            { name: "Box Braids & Knotless Braids", detail: "Traditional or knotless options designed for a lightweight feel and reduced tension on the scalp." },
            { name: "Cornrows & Feed-In Braids", detail: "Precise freestyle designs, classic stitch braids, or clean feed-ins tailored to your style." },
            { name: "Two-Strand Twists & Flat Twists", detail: "Low-manipulation styling that seals in moisture and keeps hair protected." },
            { name: "Braid & Twist Removal + Prep", detail: "Safe, gentle takedowns paired with a thorough wash, deep condition, and trim to reset your natural hair between styles." },
          ],
        },
      ],
    },
  },
  {
    slug: "toupee-studio",
    participation: { listPrices: false, tuesdayProgram: false, bioAndPhoto: false, licenseDisplay: false, bookingLink: false },
    entity: "resident",
    ledBy: "shaquana",
    name: "Toupee Studio",
    schemaType: "HealthAndBeautyBusiness",
    answer:
      "The toupee studio at Barber Shack fits non-surgical hair systems and hairpieces, customized " +
      "for all hair types. It runs as an independent specialty studio inside the shop — a discreet, " +
      "in-person alternative to surgical hair replacement, in Bellingham.",
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
    overview: {
      intro:
        "Barber Shack is home to an independent toupee studio offering non-surgical hair systems " +
        "and hairpieces, customized for all hair types. It operates as its own specialty studio " +
        "inside the shop, so you're fitted in a familiar, low-key setting rather than a clinic.",
      sections: [
        {
          heading: "Non-Surgical Hair Systems",
          body:
            "Custom, non-surgical hair systems and hairpieces, matched and fitted to your hair type " +
            "and goals. Because everyone's needs are different, the studio works with each client " +
            "one-on-one — ask at the shop to arrange a consultation.",
        },
      ],
    },
  },
  {
    slug: "tattoo-studio",
    participation: { listPrices: false, tuesdayProgram: false, bioAndPhoto: false, licenseDisplay: false, bookingLink: true },
    bookingUrl: "https://venue.ink/@tatt2girl",
    entity: "resident",
    name: "Tattoo Studio",
    schemaType: "TattooParlor",
    answer:
      "Barber Shack is home to an independent tattoo studio in Bellingham. The artist tattoos out " +
      "of the shop and books appointments directly online, so you can get tattooed and freshly cut " +
      "under one roof.",
    rationale: "A separate trade under the same roof. Needs artist pages, not just a service page.",
    services: ["[PLACEHOLDER — tattoo services and artists from Jared]"],
    opportunity:
      "Tattoo search is artist-led, not shop-led. Build per-artist pages with portfolio and " +
      "booking, or the cluster will not rank. Confirm licensing display requirements for WA.",
    overview: {
      intro:
        "Barber Shack is home to an independent tattoo studio. The artist tattoos out of the shop " +
        "and books appointments directly, so you can get inked and cleaned up under the same roof.",
      sections: [
        {
          heading: "Tattoos at Barber Shack",
          body:
            "The tattoo studio operates as its own business inside the shop, so you can line up a " +
            "tattoo and a fresh cut in the same visit. Appointments are booked directly with the " +
            "artist — use the button below to see availability and request a time.",
        },
      ],
    },
  },
  {
    slug: "apprenticeship",
    participation: { listPrices: false, tuesdayProgram: false, bioAndPhoto: false, licenseDisplay: false, bookingLink: false },
    entity: "resident",
    ledBy: "shaquana",
    name: "Apprenticeship Program",
    schemaType: "EducationalOrganization",
    answer:
      "Barber Shack's Apprenticeship Program is a hands-on barbering apprenticeship in Bellingham, " +
      "taking aspiring barbers from fundamental theory to shop-floor mastery — precision cutting, " +
      "straight-razor shaves, textured hair, and shop operations — with guidance toward state " +
      "licensing. Applications for the first cohort open soon.",
    rationale:
      "The shop trains barbers. That is a genuine E-E-A-T signal — a business that teaches its " +
      "trade is treated as an authority in it — and it doubles as the recruiting funnel. " +
      "Built from the ground up by Shaquana, a licensed instructor who was herself trained at " +
      "The Barber Shack. That loop is the strongest proof the program works.",
    services: [],
    opportunity:
      "Two audiences on one page set: prospective apprentices (recruiting) and customers " +
      "(credibility). Split them. Confirm WA licensing and apprenticeship-hour requirements.",
    cta: {
      kind: "coming-soon",
      note:
        "Applications for our inaugural cohort open soon. Contact us for program updates, tuition " +
        "information, and early application access.",
    },
    overview: {
      intro:
        "Master the craft from the inside out. Barber Shack's Apprenticeship Program is a hands-on, " +
        "immersive career path designed to take aspiring barbers from fundamental theory to " +
        "shop-floor mastery. Built on classic barbering principles, modern cutting techniques, and " +
        "real-world shop operations, our program prepares you to build a thriving, sustainable " +
        "career in the trade.",
      sections: [
        {
          heading: "Why Train at Barber Shack?",
          items: [
            { name: "Hands-On Floor Experience", detail: "Learn side-by-side with seasoned master barbers and licensed educators in an active shop environment." },
            { name: "Comprehensive Curriculum", detail: "Master everything from precision fades and straight-razor hot towel shaves to textured hair, beard sculpting, and client retention." },
            { name: "Business & Shop Operations", detail: "Go beyond the shears with practical training on shop management, chair leasing, client communication, and building a loyal clientele." },
            { name: "State Licensure Preparation", detail: "Gain the practical hours, technical expertise, and theory confidence to prepare for your state licensing exams." },
          ],
        },
        {
          heading: "What You'll Learn",
          items: [
            { name: "Precision Cutting & Styling", detail: "Clipper over comb, shear work, faded transitions, razor detailing, and custom hair designs." },
            { name: "Shaving & Facial Hair Specialty", detail: "Traditional straight-razor work, hot towel treatments, beard sculpting, and scalp care." },
            { name: "Chemical & Textured Hair Care", detail: "Curl pattern analysis, color blending, texturizing, and protective style fundamentals." },
            { name: "Sanitation, Safety & Tool Maintenance", detail: "Infection control, tool care, ergonomic discipline, and state board compliance." },
          ],
        },
        {
          heading: "How It Works",
          items: [
            { name: "Application & Interview", detail: "A direct conversation to discuss your goals, dedication, and alignment with our shop culture." },
            { name: "Mentorship & Theory", detail: "One-on-one instruction paired with foundational textbook and safety modules." },
            { name: "Hands-On Floor Training", detail: "Transition to live models and shop clients under direct supervision as your skills advance." },
            { name: "Licensing & Placement", detail: "Graduation guidance through state licensing and career-placement opportunities." },
          ],
        },
      ],
    },
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

/**
 * A real photo to pair with a department hub, where an honest one exists (Rule 2 —
 * kept beside the data). A department with no representative photo yet is simply
 * omitted here rather than paired with a mismatched image.
 */
export const DEPARTMENT_IMAGE: Record<string, { src: string; alt: string; caption?: string }> = {
  barbering: {
    src: "/images/chair-scissor-bw.webp",
    alt: "Owner and master barber Jared Jones-Valentine scissor-cutting a client at Barber Shack in Bellingham.",
    caption: "Classic barbering, modern technique — seven days a week.",
  },
  "textured-hair": {
    src: "/images/cut-braids.webp",
    alt: "Medium knotless braids styled at Barber Shack in Bellingham.",
    caption: "Textured cuts, loc care, and protective styles — natural-hair specialists.",
  },
  apprenticeship: {
    src: "/images/team.webp",
    alt: "The Barber Shack team in Bellingham holding a banner that reads Empowering everyone to shine, Home of the $12 Tuesday.",
    caption: "Learn the trade side-by-side with our barbers.",
  },
  salon: {
    src: "/images/interior-2.webp",
    alt: "A styling room inside Barber Shack in Bellingham — vintage chairs, mirrors, a ring light, and a wood accent wall.",
    caption: "Step into the studio.",
  },
};

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
