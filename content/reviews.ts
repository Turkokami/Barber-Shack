/**
 * VERIFIED REVIEWS — verbatim only, never hand-written (Hard Prohibition #5).
 *
 * Paste real Google reviews here exactly as they appear on the Google Business
 * Profile: the reviewer's name as Google shows it (first name + last initial),
 * the star rating, the exact text, and the date. Do not edit, tidy, or invent
 * review text — a fabricated review is worse than none.
 *
 * The section and the /reviews page render ONLY when this array has entries, so
 * everything stays cleanly hidden while it is empty. The 4.5 / 702 aggregate
 * lives in content/business.ts and is not duplicated here.
 */
export type Review = {
  /** exactly as shown on Google, e.g. "Marcus T." */
  author: string;
  /** 1–5 */
  rating: number;
  /** verbatim review text */
  text: string;
  /** ISO date, optional */
  date?: string;
  source?: "Google";
};

export const REVIEWS: Review[] = [
  {
    author: "Jack Chapman",
    rating: 5,
    source: "Google",
    text:
      "Absolutely love this barber shop. I've been coming here since I was about 10 years old " +
      "when my dad first brought me here and I will continue to keep coming back.",
  },
  {
    author: "Denise Gomez",
    rating: 5,
    source: "Google",
    text:
      "The atmosphere in here is amazing, so friendly and they all feel like friends, have been " +
      "getting my hair cut her for a couple of years and have never had a cut i wasn't thrilled " +
      "with, and the prices are the best in town and incredible people and products, I always " +
      "leave with a smile!",
  },
  {
    author: "Donald Kinley",
    rating: 5,
    source: "Google",
    text:
      "Best service ever, Great patience, understandable good prices great atmosphere! The owners " +
      "and their workers are amazing here!",
  },
  {
    author: "Jon Judd",
    rating: 5,
    source: "Google",
    text:
      "Made an appointment with Shelby and there was a little mix up and had to wait 30 mins. " +
      "Super friendly, apologized, didn't charge me, and refused to take any payment. Great " +
      "customer service and would book again anyday. Thank you!",
  },
  {
    author: "Toxxic Vixxen",
    rating: 5,
    source: "Google",
    text:
      "I have been coming here for 3 years now and I can't rave enough about this place!! Excellent " +
      "customer service here. We came as a walk in and now my son will only get his hair cut here!! " +
      "On more than 2 occasions I have messaged short notice needing my sons haircut and they always " +
      "fit him in. I have also got my haircut here and they did a amazing job. And the vibe here is " +
      "great always music and always a happy greeting from everyone!! If you're looking for a fun " +
      "happy laid back place that does excellent work please come visit barber shack!!",
  },
];

/** For the homepage: the two or three strongest, if we have them. */
export const FEATURED_REVIEWS = REVIEWS.slice(0, 3);
