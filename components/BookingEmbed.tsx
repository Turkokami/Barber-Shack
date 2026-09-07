/**
 * TICKET P2-01 — booking decision gate.
 * Must accept walk-in AND appointment. Walk-ins are part of the wedge; a
 * booking flow that hides the walk-in option undercuts the positioning.
 *
 * THREE RULES FOR THIS FILE. All of them were learned the hard way, live.
 *
 * 1. THE SNIPPET IS VERBATIM. DO NOT EDIT IT.
 *
 * VAGARO_SNIPPET below is Vagaro's supplied embed code, character for
 * character. An earlier version "tidied" it — widened the container from
 * Vagaro's 250px to 100%, dropped the trailing "#" from the script src,
 * dropped the frameTitle element, and reflowed the markup across lines. The
 * widget then rendered nothing on the live site. The widget id was never the
 * problem; it is byte-identical to what Vagaro issued.
 *
 * If it needs to be wider, style the WRAPPER around it. Do not touch the
 * snippet. To replace it, paste a fresh block from the Vagaro dashboard whole.
 *
 * 2. IT MUST BE SERVER-RENDERED SO IT RUNS AT PARSE TIME.
 *
 * Vagaro's WidgetEmbeddedLoader is a parse-time script: it expects to run while
 * the browser is parsing the document, as an inline <script> inside its own
 * .vagaro container, and loaders of this generation build their iframe with
 * document.write(). An even earlier version appended it in a useEffect — after
 * load — where document.write is a no-op, so it silently did nothing.
 *
 * That was done on the premise that "a script set via dangerouslySetInnerHTML
 * never executes". Only half true: it holds for innerHTML assigned in the
 * BROWSER, not for markup rendered on the SERVER, which the browser parses as
 * part of the initial document and runs normally. Rendering it from the server
 * also means React never reconciles inside the subtree, so the injected iframe
 * cannot be torn out by a re-render.
 *
 * DO NOT "modernise" this into a useEffect that appends the script.
 *
 * 3. THE BUTTONS ARE NOT DECORATION.
 *
 * Booking must be reachable in one tap even if Vagaro never loads. For a while
 * it was not: when the widget failed, the only route was a line of grey text.
 * Keep a working booking path that does not depend on a third-party script.
 */
import { BUSINESS as B } from "@/content/business";

/** Vagaro's supplied embed code, verbatim. See rule 1 above. */
const VAGARO_SNIPPET = `<div id='frameTitle' class='embedded-widget-title' style='font-size: 23px; color: #333;font-family:Arial, Helvetica, sans-serif; line-height:24px; padding: 18px 10px 8px; text-align: center; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;'>Book Now</div>
<div class="vagaro" style="width:250px; padding:0; border:0; margin:0 auto; text-align:center;"><style>.vagaro a {font-size:14px; color:#AAA; text-decoration:none;}</style><a href="https://www.vagaro.com/pro/">Powered by Vagaro</a>&nbsp;<a href="https://www.vagaro.com/pro/salon-software">Salon Software</a>,&nbsp;<a href="https://www.vagaro.com/pro/spa-software">Spa Software</a>&nbsp;&amp;&nbsp;<a href="https://www.vagaro.com/pro/fitness-software">Fitness Software</a><script type="text/javascript" src="https://www.vagaro.com//resources/WidgetEmbeddedLoader/OZqnDJOnCpWcT3qmV35y6RuSdBuOc1WJD1wOc1WO61Ctdg4tjxMG9pUxapkUcvCu7gevEhAJDXwOapcUbfY?v=KKmVqJkETGTQWFS6yvAToDLfx0pElIJ90odLGDtSGnA#"></script></div>`;

export default function BookingEmbed() {
  return (
    <div className="border border-chrome/40 bg-paper p-6 my-8 rounded-xl">
      <p className="eyebrow mb-2">Booking</p>
      <p className="mb-4">
        Walk in any day we are open, including Sunday — no appointment needed.
        Prefer a set time or a specific barber? Book ahead here.
      </p>

      {/* Always works, with or without Vagaro. See rule 3 above. */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={B.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-signal text-white text-center px-5 py-3.5 rounded-lg font-bold tracking-wide transition hover:brightness-110"
        >
          Book on Vagaro
        </a>
        <a
          href={`tel:${B.phoneTel}`}
          className="flex-1 border-2 border-ink text-center px-5 py-3.5 rounded-lg font-bold tracking-wide transition hover:text-signal hover:border-signal"
        >
          Call {B.phoneDisplay}
        </a>
      </div>

      {/* Vagaro's own block, untouched. Width is set by Vagaro at 250px. */}
      <div className="mt-4 border-t border-chrome/25" dangerouslySetInnerHTML={{ __html: VAGARO_SNIPPET }} />
    </div>
  );
}
