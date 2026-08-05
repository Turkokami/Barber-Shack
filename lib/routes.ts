import { BUSINESS as B } from "@/content/business";

export const abs = (path: string) => `${B.url}${path}`;

export const ROUTES = {
  home: "/",
  services: "/services",
  service: (slug: string) => `/services/${slug}`,
  pricing: "/pricing",
  community: "/community",
  program: (slug: string) => `/community/${slug}`,
  department: (slug: string) => `/${slug}`,
  bellingham: "/locations/bellingham",
  neighborhood: (slug: string) => `/locations/bellingham/${slug}`,
  city: (slug: string) => `/locations/${slug}`,
  barbers: "/barbers",
  barber: (slug: string) => `/barbers/${slug}`,
  accessibility: "/accessibility",
  book: "/book",
  reviews: "/reviews",
  about: "/about",
  gallery: "/gallery",
  contact: "/contact",
} as const;

/** Confirmed brand copy taken from the shop's own signage and team banner. */
export const BRAND = {
  tagline: "Empowering everyone to shine.",
  homeOfTuesday: "Home of the $12 Tuesday",
  promise: "Look Good. Feel Good. Leave Confident.",
  style: "Classic Cuts · Modern Style",
} as const;
