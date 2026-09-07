import type { Barber } from "@/content/barbers";
import { ROUTES } from "@/lib/routes";

/** E-E-A-T block, first person, named. Master Plan on-page contract block 2. */
export default function BarberCard({ barber }: { barber: Barber }) {
  return (
    <a href={ROUTES.barber(barber.slug)} className="block border border-chrome/40 p-5">
      <p className="display text-xl">{barber.name}</p>
      <p className="board text-xs text-meta mt-1">
        {barber.yearsBehindChair} yrs behind the chair
      </p>
      <p className="mt-3 text-sm">{barber.specialties.join(" · ")}</p>
    </a>
  );
}
