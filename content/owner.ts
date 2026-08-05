/**
 * OWNER — Jared Jones-Valentine. First-person bio in his own words. This is the
 * strongest E-E-A-T signal on the site: a real, named, credentialed owner with a
 * verifiable career and licenses. Do not rewrite it into marketing voice.
 *
 * NOTE: "founded 2011" (business.ts) is the confirmed business founding year and is
 * what schema foundingDate uses. The dates in this bio (Bellingham 2014, Cedarwood
 * 2017) are Jared's personal career timeline — his own words, not contradicted in
 * on-page prose.
 */
export const OWNER = {
  name: "Jared Jones-Valentine",
  role: "Owner, Master Barber & Licensed Washington State Instructor",
  headline: "From Community Advocate to Master Barber & Educator",
  photo: "/images/chair-scissor-bw.webp",
  /** WA Dept. of Licensing numbers — publicly verifiable. */
  cosmetologistLicense: "89237",   // Cosmetologist, licensed since 2011
  instructorLicense: "25031433",   // Instructor, Cosmetology
  licensedSince: "2011",
  credentials: [
    "Licensed Cosmetologist, Washington State · License #89237 (since 2011)",
    "Licensed Cosmetology Instructor, Washington State · License #25031433",
    "Regional educator for Hanzo Shears",
    "Paroba Cosmetology School, Everett",
  ],
  knowsAbout: [
    "Barbering",
    "Advanced cutting techniques",
    "Textured and ethnic hair",
    "Barbering and cosmetology instruction",
    "Straight-razor work",
  ],
  /** First-person, verbatim from Jared. Split into paragraphs. */
  bio: [
    "My journey into barbering began after a 10-year career as a HUD case manager in Seattle. " +
      "Ready for a new creative path, I attended Paroba Cosmetology School in Everett, specializing " +
      "in ethnic hair before running a successful studio in Lake Stevens serving local " +
      "professionals, government staff, and first responders.",
    "A Sehome High graduate, I returned home to Bellingham in 2014 to open a local shop on East " +
      "Maplewood. In 2017, I relocated to our current home on Cedarwood Avenue, eventually expanding " +
      "to found additional local shops like Midtown Barbershop.",
    "Today, alongside working behind the chair, I'm dedicated to raising the bar for our industry. " +
      "As a licensed Washington State Instructor and a regional educator for Hanzo Shears, I travel " +
      "throughout the state training barbers and stylists in advanced techniques.",
  ],
} as const;
