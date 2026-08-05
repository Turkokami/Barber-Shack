/**
 * COMMUNITY — the brand thesis, per Jared.
 * "Community hub first, barbershop second."
 *
 * This is NOT a marketing layer bolted onto a barbershop. It is the reason the
 * business exists, and it outranks every commercial consideration in this repo.
 * If a page's tone would embarrass the shop at the Autism Walk booth, rewrite it.
 */

export type CommunityProgram = {
  slug: string;
  name: string;
  /** AEO answer — 40–60 words, plain, no marketing register */
  answer: string;
  /** who it exists for — stated plainly, never euphemised */
  who: string;
  body: string;
  cadence: "annual" | "seasonal" | "ongoing" | "one-time";
  partners: string[];
  faqs: { q: string; a: string }[];
};

export const PROGRAMS: CommunityProgram[] = [
  {
    slug: "12-dollar-tuesdays",
    name: "$12 Tuesdays",
    answer:
      "Every Tuesday, haircuts at Barber Shack are $12. The program exists for people who need " +
      "the break — single parents, folks on Social Security or state assistance, and job seekers " +
      "getting ready to go back to work. No proof required, no questions asked. Walk in.",
    who:
      "Single parents, people on Social Security or state assistance, and job seekers " +
      "re-entering the workforce.",
    body:
      "A sharp haircut changes how you walk into a room. Financial hardship should not stand " +
      "between anyone and feeling good about themselves — so every Tuesday the price comes down " +
      "and stays down, for everybody, all day. No qualifying, no paperwork, no separate line.",
    cadence: "ongoing",
    partners: [],
    faqs: [
      { q: "Do I need to prove I qualify?", a: "No. $12 Tuesdays is open to everyone, all day, every Tuesday. Nobody is asked to explain themselves." },
      { q: "Which haircuts are $12 on Tuesday?", a: "[PLACEHOLDER — confirm with Jared which services the Tuesday rate covers]" },
    ],
  },
  {
    slug: "autism-walk",
    name: "Autism Walk",
    // Sensory-practice specifics were removed from this answer: they are claims
    // that need Jared's written sign-off (registry #22, Hard Prohibition #6).
    answer:
      "Barber Shack hosts a booth at the local Autism Walk every year — a standing commitment to " +
      "families in Whatcom County raising a child on the autism spectrum. It is part of why the " +
      "shop works the way it does: everyone is welcome, and every kind of haircut is a normal one here.",
    who: "Local families supporting a child on the autism spectrum.",
    body:
      "Every year, Barber Shack sets up a booth at the local Autism Walk. It has become a standing " +
      "part of the shop's calendar — not a one-time sponsorship, but a commitment the shop keeps " +
      "year after year to families in Whatcom County who are raising a child on the autism spectrum.\n\n" +
      "Showing up at the Walk is the visible version of something the shop holds to the rest of the " +
      "year as well: that a barbershop should be a place any family can walk into and feel at ease, " +
      "whatever a haircut looks like for their kid. If there is something that would make a visit " +
      "easier for your child, tell us when you come in — we would always rather know.",
    cadence: "annual",
    partners: [], // registry #18 — organizing body + years running, from Jared
    faqs: [],
  },
  {
    slug: "back-to-school",
    name: "Back-to-School Haircuts",
    answer:
      "Every year before school starts, Barber Shack runs a back-to-school program so kids walk " +
      "into the classroom on day one feeling confident and ready. Ask at the shop or check the " +
      "August schedule.",
    who: "Local school-age kids and their families.",
    body:
      "Before school starts each year, Barber Shack runs a back-to-school program so kids can walk " +
      "into the classroom on the first day feeling put-together and ready to go. A fresh cut is a " +
      "small thing that changes how a kid carries themselves, and the start of the year is exactly " +
      "when that matters most.\n\n" +
      "How it runs shifts a little from year to year depending on what families need. Ask at the " +
      "shop or check the August schedule to see how this year's back-to-school cuts are being handled.",
    cadence: "annual",
    partners: [],
    faqs: [],
  },
  {
    slug: "haircut-vouchers",
    name: "Shelter & Agency Haircut Vouchers",
    answer:
      "Barber Shack partners with local shelters and agencies to provide haircut vouchers for " +
      "people working toward self-sufficiency. If your organization serves people who could use " +
      "this, get in touch — the door is open.",
    who: "People experiencing homelessness or working toward self-sufficiency, referred through partner agencies.",
    body:
      "Barber Shack works with local shelters and agencies to put haircut vouchers in the hands of " +
      "people who are working their way back onto their feet — a clean cut before a job interview, " +
      "a court date, or a housing meeting, at no cost to the person in the chair.\n\n" +
      "The vouchers run through partner organizations rather than a sign-up at the shop, so the help " +
      "reaches people already being supported by someone who knows their situation. If your " +
      "organization serves people who could use this, reach out to the shop — the door is open to " +
      "new partnerships. Partner organizations are named here only with their written permission.",
    cadence: "ongoing",
    partners: [], // registry #19 — partner names, only with written permission
    faqs: [],
  },
  {
    slug: "rainbow-bridge",
    name: "The Rainbow Bridge on Northwest Avenue",
    answer:
      "Barber Shack was the driving force behind the Rainbow Bridge on Northwest Avenue in " +
      "Bellingham — a permanent, visible reminder of the inclusive community the shop is trying " +
      "to build. It is the neighborhood landmark we are proudest of.",
    who: "Everyone in Bellingham.",
    // Confirmed framing only. The origin specifics — the people, the build, the date —
    // are registry #20 and belong in Jared's own words; not invented here.
    body:
      "Barber Shack was the driving force behind the Rainbow Bridge on Northwest Avenue in " +
      "Bellingham — a permanent, painted landmark that stands as a visible reminder of the " +
      "inclusive community the shop is trying to build.\n\n" +
      "Of everything the shop has been part of, this is the one it is proudest of, because it is " +
      "not a slogan or a campaign that comes and goes. It is a real, physical place in the " +
      "neighborhood that anyone can walk or drive past, any day of the year. The fuller story of " +
      "how it came together — the people who made it happen and why it mattered to them — is one " +
      "the shop will tell here in its own words.",
    cadence: "one-time",
    partners: [],
    faqs: [],
  },
  {
    slug: "community-art-wall",
    name: "The Community Art Wall",
    answer:
      "The Community Art Wall inside Barber Shack is given over to local artists. It changes, it " +
      "is not curated to match the decor, and anyone waiting for a chair gets to look at it.",
    who: "Local artists and anyone in the shop.",
    body:
      "Inside the shop, one wall is given over to local artists. It changes regularly, it is not " +
      "curated to match the decor, and it is there for one reason: anyone waiting for a chair gets " +
      "something real to look at, made by someone from around here.\n\n" +
      "The shop would rather show a neighbor's work than a stock print on the wall. If you make " +
      "things and would like to be considered for the wall, ask at the shop — there is room for " +
      "more of Bellingham on it.",
    cadence: "ongoing",
    partners: [],
    faqs: [],
  },
];

export const getProgram = (slug: string) => PROGRAMS.find((p) => p.slug === slug);

/** A real photo to pair with a community program page, where one fits honestly. */
export const PROGRAM_IMAGE: Record<string, { src: string; alt: string }> = {
  "12-dollar-tuesdays": { src: "/images/tuesday-neon.webp", alt: "A neon Barber Shack sign reading Changes happen here on Tuesdays." },
  "autism-walk": { src: "/images/community-autism.webp", alt: "Barber Shack at the local Autism Walk with a banner reading Empowering everyone to shine, Home of the $12 Tuesday." },
  "rainbow-bridge": { src: "/images/community-rainbow-bridge.webp", alt: "The Rainbow Bridge on Northwest Avenue in Bellingham, its railings painted in rainbow colors and decorated with children's handprints." },
  "back-to-school": { src: "/images/cut-kids.webp", alt: "A young client getting a back-to-school cut at Barber Shack." },
  "community-art-wall": { src: "/images/family-artwall.webp", alt: "A client and his son in front of the Barber Shack community art wall." },
};
