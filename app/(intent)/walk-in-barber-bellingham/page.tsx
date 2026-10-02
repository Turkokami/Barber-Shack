import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIntent } from "@/content/intents";
import { isIntentPublishable } from "@/lib/publishable";
import { abs } from "@/lib/routes";
import { fillRate } from "@/content/business";
import IntentView from "@/components/IntentView";

const SLUG = "walk-in-barber-bellingham";

export function generateMetadata(): Metadata {
  const i = getIntent(SLUG);
  if (!i) return {};
  return { title: fillRate(i.title), description: fillRate(i.description), alternates: { canonical: abs(`/${i.slug}`) } };
}

export default function Page() {
  const i = getIntent(SLUG);
  if (!i || !isIntentPublishable(i)) notFound();
  return <IntentView intent={i} />;
}
