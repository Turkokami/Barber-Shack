"use client";

/**
 * TICKET P2-01 — booking decision gate.
 * Must accept walk-in AND appointment. Walk-ins are part of the wedge; a
 * booking flow that hides the walk-in option undercuts the positioning.
 *
 * Appointments use Vagaro's *embedded* widget (inline, same window) rather than
 * the new-tab popup. The loader injects an iframe into its own `.vagaro`
 * container, so the script is appended there on mount (a script set via
 * innerHTML/dangerouslySetInnerHTML never executes). If the widget fails to
 * load — script blocked, JS off, slow network — the fallback link below still
 * opens booking, so we never strand a customer.
 */
import { useEffect, useRef } from "react";
import { BUSINESS as B } from "@/content/business";

const VAGARO_EMBED_LOADER =
  "https://www.vagaro.com//resources/WidgetEmbeddedLoader/OZqnDJOnCpWcT3qmV35y6RuSdBuOc1WJD1wOc1WO61Ctdg4tjxMG9pUxapkUcvCu7gevEhAJDXwOapcUbfY?v=KKmVqJkETGTQWFS6yvAToDLfx0pElIJ90odLGDtSGnA";

export default function BookingEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current || !containerRef.current) return;
    injected.current = true;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = VAGARO_EMBED_LOADER;
    script.async = true;
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="border border-chrome/40 bg-paper p-6 my-8 rounded-xl">
      <p className="eyebrow mb-2">Booking</p>
      <p className="mb-4">
        Walk in any day we are open, including Sunday — no appointment needed.
        Prefer a set time or a specific barber? Book below.
      </p>

      {/* Vagaro embedded widget. The loader injects its iframe into this container. */}
      <div
        className="vagaro"
        ref={containerRef}
        style={{ width: "100%", padding: 0, border: 0, margin: "0 auto", textAlign: "center" }}
      >
        <style>{`.vagaro a{font-size:14px;color:#AAA;text-decoration:none;}`}</style>
        <a href="https://www.vagaro.com/pro/">Powered by Vagaro</a>&nbsp;
        <a href="https://www.vagaro.com/pro/salon-software">Salon Software</a>,&nbsp;
        <a href="https://www.vagaro.com/pro/spa-software">Spa Software</a>&nbsp;&amp;&nbsp;
        <a href="https://www.vagaro.com/pro/fitness-software">Fitness Software</a>
      </div>

      {/* Always-available fallback so booking works even if the widget can't load. */}
      <p className="mt-4 text-sm text-chrome">
        Widget not loading?{" "}
        <a href={B.bookingUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-signal">
          Open booking on Vagaro →
        </a>
      </p>
    </div>
  );
}
