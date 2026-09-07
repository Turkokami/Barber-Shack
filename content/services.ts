/**
 * Service data drives /services/[service]. One template, N spokes. Rule 1.
 *
 * price: regular walk-in price. tuesdayPrice: the $12 Tuesday rate where it applies.
 * priceNote: qualifier shown next to the price (e.g. "up to") — keeps the board honest.
 *
 * Registry #8 — RESOLVED. Prices are the owner-confirmed menu effective September 1, 2026.
 * Hard Prohibition #9: no price on-site that does not match the price at the chair.
 *
 * PROVISIONAL: which services carry the $12 Tuesday rate is mapped here to the haircut
 * services only. This is registry #23 / #32 and must be confirmed by Jared before launch —
 * the program's credibility is that it is unconditional, so a wrong flag here is costly.
 *
 * Answers and durations below are provisional drafts pending owner review (Phase 2 content).
 */

export type Service = {
  slug: string;
  name: string;
  serviceType: string;
  /** AEO answer block — 40–60 words, direct, quotable. Master Plan Standard 03. */
  answer: string;
  price: string;
  tuesdayPrice?: string;
  /** display qualifier for non-fixed prices, e.g. "up to" */
  priceNote?: string;
  durationMin: number;
  includes: string[];
  whoItsFor: string;
  faqs: { q: string; a: string }[];
  /** barber slugs who perform this service — populated in P4-01 */
  barbers: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "clipper-cut",
    name: "Clipper Cut",
    serviceType: "Men's haircut",
    answer:
      "A clipper cut at Barber Shack is a clean, guarded all-over cut with a neckline and edge " +
      "cleanup, about 25 minutes. Walk in any day of the week, including Sunday. On Tuesdays it is $12.",
    price: "29",
    tuesdayPrice: "12",
    durationMin: 25,
    includes: ["Guarded clipper cut", "Neckline and edge cleanup", "Hot towel finish"],
    whoItsFor: "Anyone who needs a clean, reliable cut without booking a week out.",
    faqs: [
      { q: "Do I need an appointment?", a: "No. Walk-ins are welcome every day we are open, including Sunday." },
      { q: "How long does a clipper cut take?", a: "About 25 minutes for a standard cut." },
    ],
    barbers: [],
  },
  {
    slug: "long-haircut",
    name: "Long Haircut",
    serviceType: "Haircut",
    answer:
      "A long haircut is scissor-led work for hair worn longer on top and through the sides, " +
      "shaped and blended to grow out cleanly. Walk in any day, including Sunday. $12 on Tuesdays.",
    price: "30",
    tuesdayPrice: "12",
    durationMin: 35,
    includes: ["Scissor cut and shaping", "Blend through the sides", "Style finish"],
    whoItsFor: "Anyone wearing their hair longer who wants it shaped rather than clipped down.",
    faqs: [],
    barbers: [],
  },
  {
    slug: "clean-up",
    name: "Clean Up",
    serviceType: "Neckline and edge cleanup",
    answer:
      "A clean up sharpens your existing cut between visits — neckline, around the ears, and edges " +
      "lined up. Quick, walk-in, any day of the week.",
    price: "19",
    durationMin: 15,
    includes: ["Neckline cleanup", "Around-the-ears detail", "Edge line-up"],
    whoItsFor: "Anyone stretching a fresh cut a little longer.",
    faqs: [],
    barbers: [],
  },
  {
    slug: "skin-fade",
    name: "Skin Fade",
    serviceType: "Fade haircut",
    answer:
      "A skin fade blends from bare skin up through the sides and back into the length on top. " +
      "About 30 minutes, walk in any day including Sunday, and $12 on Tuesdays.",
    price: "33",
    tuesdayPrice: "12",
    durationMin: 30,
    includes: ["Skin fade through sides and back", "Top blended and cut", "Edge line-up"],
    whoItsFor: "Anyone who wants a sharp, high-contrast fade.",
    faqs: [],
    barbers: [],
  },
  {
    slug: "flat-top",
    name: "Flat Top",
    serviceType: "Flat top haircut",
    answer:
      "A flat top is a precision cut squared off level across the top — one of the harder cuts to " +
      "do well, and one this shop is set up for. Walk in any day; $12 on Tuesdays.",
    price: "38",
    tuesdayPrice: "12",
    durationMin: 30,
    includes: ["Squared, level flat-top cut", "Clean tapered sides", "Edge line-up"],
    whoItsFor: "Anyone who wears a flat top and wants it cut properly.",
    faqs: [],
    barbers: [],
  },
  {
    slug: "straight-razor-face-shave",
    name: "Straight Razor Face Shave",
    serviceType: "Straight razor shave",
    answer:
      "A traditional hot-towel straight-razor face shave — hot towels, lather, a close razor shave, " +
      "and a cooling finish. About 30 minutes. Walk in any day of the week.",
    price: "38",
    durationMin: 30,
    includes: ["Hot towel prep", "Lather and straight-razor shave", "Cooling finish"],
    whoItsFor: "Anyone who wants the closest, most traditional shave there is.",
    faqs: [],
    barbers: [],
  },
  {
    slug: "straight-razor-head-shave",
    name: "Straight Razor Head Shave",
    serviceType: "Head shave",
    answer:
      "A full hot-towel straight-razor head shave — hot towels, lather, a close razor shave over the " +
      "scalp, and a cooling finish. About 30 minutes, walk in any day.",
    price: "39",
    durationMin: 30,
    includes: ["Hot towel prep", "Straight-razor head shave", "Cooling finish"],
    whoItsFor: "Anyone who keeps a clean-shaven head and wants it done right.",
    faqs: [],
    barbers: [],
  },
  {
    slug: "kids-cut",
    name: "Kids' Cut",
    serviceType: "Children's haircut",
    answer:
      "A kids' cut at Barber Shack is unhurried and on the child's schedule — including first " +
      "haircuts and kids who find the chair hard. Walk in any day, including Sunday. $12 on Tuesdays.",
    price: "25",
    tuesdayPrice: "12",
    durationMin: 20,
    includes: ["Cut to the child's comfort", "Neckline and edge cleanup"],
    whoItsFor: "Kids of any age, including first haircuts and kids who find the chair hard.",
    faqs: [],
    barbers: [],
  },
  {
    slug: "beard-trim",
    name: "Beard Trim",
    serviceType: "Beard trim",
    answer:
      "A beard trim shapes and lines up the beard to your face — cheek line, neckline, and length " +
      "evened out. Quick, walk-in, any day of the week.",
    price: "20",
    durationMin: 15,
    includes: ["Shape and even the length", "Cheek and neckline detail"],
    whoItsFor: "Anyone keeping a beard sharp between cuts.",
    faqs: [],
    barbers: [],
  },
  {
    // Menu label from Jared: "Beard removal (C)". The "(C)" is unexplained — CONFIRM
    // meaning before publishing (clipper-down vs. razor). Name kept neutral for now.
    slug: "beard-removal",
    name: "Beard Removal",
    serviceType: "Beard shave",
    answer:
      "Beard removal takes the beard all the way down clean. Walk in any day of the week.",
    price: "22",
    durationMin: 15,
    includes: ["Beard taken down clean", "Line and finish"],
    whoItsFor: "Anyone going from a beard back to clean-shaven.",
    faqs: [],
    barbers: [],
  },
  {
    slug: "senior-military-cut",
    name: "Senior & Military Cut",
    serviceType: "Senior and military haircut",
    answer:
      "A senior and military cut — a clean, regulation-ready clipper cut at a reduced rate. Walk in " +
      "any day, including Sunday. $12 on Tuesdays.",
    price: "23",
    tuesdayPrice: "12",
    durationMin: 25,
    includes: ["Regulation clipper cut", "Neckline and edge cleanup"],
    whoItsFor: "Seniors and active or veteran service members.",
    faqs: [],
    barbers: [],
  },
  {
    slug: "hair-art",
    name: "Hair Art",
    serviceType: "Hair design",
    answer:
      "Hair art is custom design work razored into the cut — lines, parts, and patterns, priced by " +
      "detail. Ask the barber. Walk in any day of the week.",
    price: "19",
    priceNote: "up to",
    durationMin: 20,
    includes: ["Custom razored design", "Priced by detail"],
    whoItsFor: "Anyone who wants a design worked into their cut.",
    faqs: [],
    barbers: [],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

/** Services that carry the $12 Tuesday rate — provisional, confirm registry #23/#32. */
export const TUESDAY_SERVICES = SERVICES.filter((s) => s.tuesdayPrice);

/** A real photo to pair with a service page. Kept beside the data (Rule 2). */
export const SERVICE_IMAGE: Record<string, { src: string; alt: string }> = {
  "clipper-cut": { src: "/images/cut-clipper-closeup.webp", alt: "Clippers lining up a clipper cut at Barber Shack in Bellingham." },
  "long-haircut": { src: "/images/cut-pompadour.webp", alt: "A longer scissor cut, shaped and styled at Barber Shack." },
  "skin-fade": { src: "/images/cut-fade-comb.webp", alt: "A clean skin fade taking shape under clipper and comb at Barber Shack." },
  "flat-top": { src: "/images/cut-fresh-fade.webp", alt: "A crisp, freshly finished cut at Barber Shack." },
  "straight-razor-face-shave": { src: "/images/shave-bw.webp", alt: "A traditional hot-towel straight-razor shave at Barber Shack, in black and white." },
  "straight-razor-head-shave": { src: "/images/chair-scissor-bw.webp", alt: "Traditional straight-razor barbering at Barber Shack, in black and white." },
  "kids-cut": { src: "/images/cut-kids2.webp", alt: "A young client's finished cut with a razored side design at Barber Shack." },
  "senior-military-cut": { src: "/images/cut-fade-comb2.webp", alt: "A clean, regulation-ready clipper cut taking shape at Barber Shack." },
  "beard-trim": { src: "/images/cut-beard.webp", alt: "A beard shaped and detailed at Barber Shack." },
  "beard-removal": { src: "/images/shave-bw.webp", alt: "A close razor shave at Barber Shack, in black and white." },
  "clean-up": { src: "/images/cut-lineup.webp", alt: "A sharp neckline and edge line-up at Barber Shack." },
  "hair-art": { src: "/images/cut-hairart.webp", alt: "Custom hair-art design razored into a cut at Barber Shack." },
};
