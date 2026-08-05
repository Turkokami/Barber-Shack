/** P4-01. Each barber becomes a Person entity referenced as employee from the LocalBusiness. */
export type Barber = {
  slug: string;
  name: string;
  yearsBehindChair: number;
  specialties: string[];
  /** first-person voice — Master Plan on-page contract, block 2 */
  bio: string;
  photo: string;
  services: string[];
};

export const BARBERS: Barber[] = []; // registry #9 — roster from owner

export const getBarber = (slug: string) => BARBERS.find((b) => b.slug === slug);
