import { BUSINESS as B } from "@/content/business";

/** Near the hero on every page. Reviews, hours, access — Master Plan Standard 05. */
export default function TrustStrip() {
  const items = [
    `${B.rating}★ · ${B.reviewCount} Google reviews`,
    "Open 7 days, including Sunday",
    "Walk-ins welcome",
    "Wheelchair accessible",
  ];
  return (
    <ul className="board flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-wider text-ink/70 border-y border-chrome/40 py-3">
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  );
}
