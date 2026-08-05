import type { MetadataRoute } from "next";
import { SERVICES } from "@/content/services";
import { NEIGHBORHOODS } from "@/content/neighborhoods";
import { PROGRAMS } from "@/content/community";
import { INTENTS } from "@/content/intents";
import { DEPARTMENTS } from "@/content/departments";
import { isPublishable, isProgramPublishable, isIntentPublishable, isDepartmentPublishable } from "@/lib/publishable";
import { ROUTES, abs } from "@/lib/routes";

/**
 * The sitemap is generated from the data files and gated by the publish rules.
 * Nothing is listed by hand, and a withheld row never appears here.
 *
 * Static list = pages that are actually built. Barbers, Bellingham, About,
 * Accessibility, and Reviews are added here as each one ships (Phases C/D).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const stat = [
    ROUTES.home, ROUTES.services, ROUTES.pricing, ROUTES.community,
    ROUTES.about, ROUTES.bellingham, ROUTES.gallery, ROUTES.reviews,
    ROUTES.book, ROUTES.contact,
  ];

  return [
    ...stat.map((p) => ({ url: abs(p), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...DEPARTMENTS.filter(isDepartmentPublishable)
      .map((d) => ({ url: abs(ROUTES.department(d.slug)), priority: 0.8 })),
    ...SERVICES.map((s) => ({ url: abs(ROUTES.service(s.slug)), priority: 0.9 })),
    ...PROGRAMS.filter(isProgramPublishable)
      .map((p) => ({ url: abs(ROUTES.program(p.slug)), priority: 0.7 })),
    ...INTENTS.filter(isIntentPublishable)
      .map((i) => ({ url: abs(`/${i.slug}`), priority: 0.7 })),
    ...NEIGHBORHOODS.filter(isPublishable)
      .map((n) => ({ url: abs(ROUTES.neighborhood(n.slug)), priority: 0.6 })),
  ];
}
