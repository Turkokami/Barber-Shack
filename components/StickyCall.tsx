import { BUSINESS as B } from "@/content/business";
import { ROUTES } from "@/lib/routes";

/** Mobile only. Booking is one tap from every route — acceptance gate item. */
export default function StickyCall() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 grid grid-cols-2 shadow-[0_-3px_14px_rgba(0,0,0,0.18)]">
      <a href={`tel:${B.phoneTel}`}
         className="bg-ink text-white text-center py-4 font-bold uppercase tracking-wider text-base border-t-2 border-signal">
        Call
      </a>
      <a href={ROUTES.book}
         className="bg-signal text-white text-center py-4 font-bold uppercase tracking-wider text-base border-t-2 border-signal">
        Book Now
      </a>
    </div>
  );
}
