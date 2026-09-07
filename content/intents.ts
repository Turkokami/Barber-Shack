/**
 * INTENT PAGES (Template T3). One template, N data rows. Rule 1.
 *
 * These target a specific search intent and answer it directly. Every fact here
 * is confirmed (hours, walk-in policy, address, the $12 Tuesday program) — nothing
 * is invented. isIntentPublishable() gates the route: a body under 400 unique words,
 * or one carrying a placeholder, produces no page and no sitemap entry.
 *
 * No competitor is named on any page (Hard Prohibition #8). General statements about
 * "most shops" carry no name and no claim about a specific business.
 */

export type Intent = {
  slug: string;
  h1: string;
  title: string;
  description: string;
  /** AEO answer — 40–60 words, quotable */
  answer: string;
  /** the T3 payload — 400+ genuinely-unique words, split on blank lines */
  body: string;
  /** downward links — service slugs */
  related: string[];
  faqs: { q: string; a: string }[];
};

export const INTENTS: Intent[] = [
  {
    slug: "walk-in-barber-bellingham",
    h1: "Walk-In Barber in Bellingham",
    title: "Walk-In Barber in Bellingham, WA — No Appointment Needed",
    description:
      "Walk in for a haircut at Barber Shack in Bellingham any day of the week, including Sunday. No appointment, no account. $12 Tuesdays for everyone.",
    answer:
      "Barber Shack is a walk-in barbershop at 2500 Cedarwood Ave in Bellingham. No appointment " +
      "and no account needed — walk in during opening hours any day of the week, including Sunday, " +
      "put your name down, and take a seat. On Tuesdays our standard haircuts are $12.",
    body:
      "Barber Shack is a walk-in barbershop first. You do not need an appointment, an account, or " +
      "a phone call ahead. Walk in during opening hours, give your name at the front, and take a " +
      "seat — the next available barber takes you. It is the way a neighborhood barbershop is " +
      "supposed to work: you have twenty minutes, you want a clean cut, and you should be able to " +
      "get one without planning your week around it.\n\n" +
      "We are open seven days, which is the part most people do not expect. Monday through Friday " +
      "we are open nine in the morning to six in the evening, Saturday nine to five, and Sunday " +
      "ten to four. That Sunday window matters — it is the day most shops are closed, and it is " +
      "often the only day a working parent or a shift worker actually has free. Whatever the day, " +
      "the door is open and the chairs are staffed.\n\n" +
      "Any of the barbers can take a walk-in, and the full menu is available whether you booked or " +
      "not. A clipper cut, a skin fade, a long scissor cut, a beard trim, a straight-razor shave, " +
      "a kids' cut — walk-in gets the same work as an appointment, at the same price on the board. " +
      "Nothing about walking in puts you at the back of the line for the real service.\n\n" +
      "The shop is in the Birchwood neighborhood of northwest Bellingham, which puts it a short " +
      "drive from Cordata, Columbia, Sunnyland, Barkley, Fairhaven and most of the rest of town. " +
      "Barber Shack started out in Lake Stevens in 2011 and opened here in June 2014. Walking in " +
      "has been the point of the place from the beginning — no membership, no app, no minimum " +
      "spend, and no sense that you need an appointment to deserve a good haircut.\n\n" +
      "Every Tuesday, our standard haircuts are $12. That is not a loss-leader or a coupon — it " +
      "is an access program that exists for single parents, people on Social Security or state " +
      "assistance, and " +
      "anyone getting ready to go back to work. It runs all day, for everyone, and nobody is asked " +
      "to prove they qualify. There is no separate line and no paperwork. You walk in on a Tuesday, " +
      "you pay $12, you leave with a sharp cut.\n\n" +
      "If you would rather lock in a set time or a specific barber, you can book ahead on Vagaro — " +
      "but booking is an option, never a requirement, and a walk-in is never turned away in favor " +
      "of an app-only queue. The shop is at 2500 Cedarwood Avenue in Bellingham, it is wheelchair " +
      "accessible, and kids are welcome any day. If you want to check the wait before you head over, " +
      "give the shop a call and someone will tell you how the chairs are looking.",
    related: ["clipper-cut", "skin-fade", "kids-cut"],
    faqs: [
      { q: "Do I need an appointment?", a: "No. Walk in during opening hours any day of the week, including Sunday. Booking ahead is optional." },
      { q: "Are walk-ins open on Sunday?", a: "Yes. We are open Sunday from ten in the morning to four in the afternoon, walk-ins welcome." },
      { q: "Is the whole menu available to walk-ins?", a: "Yes — a walk-in gets the same services at the same prices as a booked appointment." },
    ],
  },
  {
    slug: "sunday-haircut-bellingham",
    h1: "Sunday Haircut in Bellingham",
    title: "Sunday Haircut in Bellingham, WA — Open 10am–4pm",
    description:
      "Need a haircut on Sunday in Bellingham? Barber Shack is open Sunday 10am–4pm, walk-ins welcome. Seven days a week at 2500 Cedarwood Ave.",
    answer:
      "Yes — Barber Shack is open on Sundays, ten in the morning to four in the afternoon, at 2500 " +
      "Cedarwood Ave in Bellingham. Walk in, no appointment needed. It is one of the few barbershops " +
      "in the area open a full seven days a week.",
    body:
      "If you need a haircut on a Sunday in Bellingham, Barber Shack is open. Our Sunday hours are " +
      "ten in the morning to four in the afternoon, walk-ins welcome, no appointment required. You " +
      "can simply come in, give your name, and wait for the next chair.\n\n" +
      "Sunday is the day the craft barbershops tend to be closed. Most shops run a Tuesday-to-" +
      "Saturday week and take Sunday and often Monday off, which leaves a real gap: the one " +
      "afternoon a lot of people finally have free is the one afternoon they cannot get a cut. We " +
      "kept Sunday open on purpose. A haircut before the work week starts, before school photos, " +
      "before a Monday interview, or just because Sunday is when the family has time — that is " +
      "exactly when people want a chair, and it should be there.\n\n" +
      "Sunday is not an outlier here — it is part of a genuine seven-day week. Monday through " +
      "Friday the shop is open nine in the morning to six in the evening, Saturday nine to five, " +
      "and Sunday ten to four. Those hours are posted, they hold every week, and Sunday is staffed " +
      "like any other day rather than run as a short reduced shift.\n\n" +
      "A Sunday cut is the full menu, not a stripped-down version. Clipper cuts, skin fades, long " +
      "scissor cuts, flat tops, beard trims, straight-razor shaves, and kids' cuts are all " +
      "available, at the prices posted on the board. Any of the barbers on that day can take you, " +
      "and a walk-in is treated the same as a booked appointment.\n\n" +
      "One honest note on price: the $12 rate is a Tuesday program, not a Sunday one, so a Sunday " +
      "cut is at the regular posted price. What Sunday gives you is availability — the ability to " +
      "actually get a good haircut on the day you have time for it. If a $12 cut is what you are " +
      "after, come back on a Tuesday, when our standard haircuts are $12 for everyone, all day, " +
      "with no qualifying and no separate line.\n\n" +
      "There is more going on here than haircuts, and Sunday is no exception. Local art hangs on " +
      "the wall, the shop keeps a booth at the Autism Walk every year, and Barber Shack was the " +
      "driving force behind the Rainbow Bridge on Northwest Avenue. Come in for a cut on a Sunday " +
      "afternoon and you are walking into a shop that has been trying to be useful to this town " +
      "since it opened here in June 2014.\n\n" +
      "The shop is at 2500 Cedarwood Avenue in Bellingham, wheelchair accessible, and set up to " +
      "take kids and families without a fuss. If you want to gauge the Sunday wait before driving " +
      "over, call the shop and someone will let you know how the afternoon is running. Otherwise, " +
      "just walk in — that is the whole idea.",
    related: ["clipper-cut", "long-haircut", "skin-fade"],
    faqs: [
      { q: "Is Barber Shack open on Sunday?", a: "Yes. Sunday hours are ten in the morning to four in the afternoon, walk-ins welcome." },
      { q: "Do I need an appointment for a Sunday haircut?", a: "No. Walk in during Sunday hours and take the next available chair. Booking ahead is optional." },
      { q: "Is the $12 price available on Sunday?", a: "The $12 rate is the Tuesday program. Sunday cuts are at the regular posted price." },
    ],
  },
];

export const getIntent = (slug: string) => INTENTS.find((i) => i.slug === slug);
