"use client";
import { useState } from "react";
import { ROUTES } from "@/lib/routes";

/**
 * Site navigation. Inline on desktop, a clean hamburger disclosure on mobile —
 * so the header stays a single tidy row instead of wrapping into a block of links.
 * Book is a highlighted button, the way the best barber sites keep the primary CTA
 * visible at all times.
 */
const LINKS = [
  { name: "Services", href: ROUTES.services },
  { name: "Prices", href: ROUTES.pricing },
  { name: "Community", href: ROUTES.community },
  { name: "Bellingham", href: ROUTES.bellingham },
  { name: "Gallery", href: ROUTES.gallery },
  { name: "Reviews", href: ROUTES.reviews },
  { name: "About", href: ROUTES.about },
  { name: "Contact", href: ROUTES.contact },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-end">
      {/* Desktop */}
      <nav className="hidden md:flex items-center gap-x-5 board text-xs uppercase tracking-wider">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="py-1 hover:text-signal transition-colors">
            {l.name}
          </a>
        ))}
        <a
          href={ROUTES.book}
          className="bg-signal text-white px-4 py-2 rounded-lg font-bold tracking-wide transition hover:brightness-110"
        >
          Book
        </a>
      </nav>

      {/* Mobile toggle */}
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="md:hidden inline-flex flex-col justify-center gap-[5px] p-2 -mr-2"
      >
        <span className="block h-0.5 w-6 bg-ink" />
        <span className="block h-0.5 w-6 bg-ink" />
        <span className="block h-0.5 w-6 bg-ink" />
      </button>

      {/* Mobile panel */}
      {open && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-shopwhite border-b-2 border-ink shadow-lg flex flex-col">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="board text-sm uppercase tracking-wider px-5 py-4 border-t border-chrome/30 hover:text-signal"
            >
              {l.name}
            </a>
          ))}
          <a
            href={ROUTES.book}
            onClick={() => setOpen(false)}
            className="bg-signal text-white text-center px-5 py-4 font-bold uppercase tracking-wider"
          >
            Book Now
          </a>
        </nav>
      )}
    </div>
  );
}
