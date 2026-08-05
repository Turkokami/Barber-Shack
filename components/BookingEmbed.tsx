import { BUSINESS as B } from "@/content/business";

/**
 * TICKET P2-01 — booking decision gate.
 * Must accept walk-in AND appointment. Walk-ins are part of the wedge; a
 * booking flow that hides the walk-in option undercuts the positioning.
 */
export default function BookingEmbed() {
  return (
    <div className="border border-chrome/40 bg-paper p-6 my-8 rounded-xl">
      <p className="eyebrow mb-2">Booking</p>
      <p className="mb-4">
        Walk in any day we are open, including Sunday — no appointment needed.
        Prefer a set time or a specific barber? Book below.
      </p>
      {/* Replace with the selected platform embed once P2-01 resolves. */}
      <a href={B.bookingUrl}
         className="inline-block bg-signal text-white px-7 py-3.5 rounded-lg font-bold uppercase tracking-wide text-sm transition hover:brightness-110">
        Book a chair
      </a>
    </div>
  );
}
