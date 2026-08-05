/**
 * SPECIALISTS — the named-expert E-E-A-T layer. Master Plan on-page contract, block 2.
 *
 * A credentialed, named, first-person voice carried consistently across every page
 * in that person's domain. Each specialist becomes a Person entity with a real
 * credential list and license numbers, referenced as `employee` from the root
 * LocalBusiness and as `author` / `reviewedBy` on the content they own.
 */
import { PLACEHOLDER } from "./business";

export type Credential = {
  name: string;
  /** WA Dept. of Licensing number — required for the schema credential node */
  licenseNumber: string;
  issuedBy: string;
};

export type Specialist = {
  slug: string;
  /** Exactly as the person spells their own name. Never normalised or corrected. */
  name: string;
  /** Optional surname, if she uses one professionally. Helps license verification. */
  surname?: string;
  /** how the name appears in first-person copy */
  firstName: string;
  role: string;
  credentials: Credential[];
  /** schema knowsAbout — the topical domains this person authors */
  knowsAbout: string[];
  /** first-person, in the specialist's own words. Never rewritten into marketing voice. */
  bio: string;
  /** clusters where this person is the named voice on every page */
  ownsClusters: string[];
  /** trained in-house — proof the apprentice program produces licensed professionals */
  alumniOfShop: boolean;
  /**
   * Employment relationship to Barber Shack.
   * "independent" — own business, own book, own prices. NOT an employee.
   * Nothing about this person publishes without the participation flags on
   * their resident studio in content/departments.ts.
   */
  relationship: "independent" | "employee";
  photo: string;
};

export const SPECIALISTS: Specialist[] = [
  {
    slug: "shaquana",
    // Registry #24 RESOLVED — spelled as she spells it herself. Do not "correct" this.
    name: "Shaquana",
    firstName: "Shaquana",
    role: "Licensed Cosmetologist, Barber & Instructor",
    credentials: [
      { name: "Licensed Cosmetologist", licenseNumber: PLACEHOLDER, issuedBy: "Washington State Department of Licensing" },
      { name: "Barber",                 licenseNumber: PLACEHOLDER, issuedBy: "Washington State Department of Licensing" },
      { name: "Licensed Instructor",    licenseNumber: PLACEHOLDER, issuedBy: "Washington State Department of Licensing" },
    ],
    knowsAbout: [
      "Textured hair",
      "Creative braid styles",
      "Loc care and maintenance",
      "Barbering",
      "Barbering and cosmetology instruction",
      "Non-surgical hair replacement",
    ],
    bio:
      "My name is Shaquana, and I am a licensed cosmetologist, trained barber from The Barber " +
      "Shack, professional braider, loctician, and licensed instructor. I specialize in creative " +
      "braid styles, healthy loc care, and textured hair for all hair lengths and textures. As an " +
      "instructor, I focus on teaching textured hair and barbering, helping students build the " +
      "skills and confidence to succeed in the industry. I am also building an apprenticeship " +
      "program from the ground up at The Barber Shack and collaborating with a fellow industry " +
      "professional to create a toupee business that offers customized hair replacement solutions " +
      "for all hair types. My passion is combining creativity, education, and innovation to " +
      "empower both my clients and my students.",
    ownsClusters: ["textured-hair", "apprenticeship", "toupee-studio", "salon"],
    alumniOfShop: true,       // trained AT The Barber Shack — the program's own proof
    relationship: "independent",
    photo: PLACEHOLDER,
  },
];

export const getSpecialist = (slug: string) => SPECIALISTS.find((s) => s.slug === slug);

/** Returns the named voice for a cluster — used by every template in that cluster. */
export const voiceFor = (cluster: string) =>
  SPECIALISTS.find((s) => s.ownsClusters.includes(cluster));
