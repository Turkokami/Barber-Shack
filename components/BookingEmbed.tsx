/**
 * TICKET P2-01 — booking decision gate.
 * Must accept walk-in AND appointment. Walk-ins are part of the wedge; a
 * booking flow that hides the walk-in option undercuts the positioning.
 *
 * WHY THIS IS A SERVER COMPONENT, AND WHY THE SNIPPET IS RENDERED AS RAW HTML
 *
 * Vagaro's WidgetEmbeddedLoader is a parse-time widget script: it expects to run
 * while the browser is still parsing the document, as an inline <script> sitting
 * inside its own `.vagaro` container. Loaders of this generation build their
 * iframe with document.write().
 *
 * That is the whole bug this replaces. The previous version appended the loader
 * in a useEffect — i.e. after the document had finished loading — on the premise
 * that "a script set via dangerouslySetInnerHTML never executes". That premise is
 * only half true: it holds for innerHTML assigned in the BROWSER, but NOT for
 * markup rendered on the SERVER. Server-rendered HTML is part of the initial
 * document, so the browser parses it and runs the script normally.
 *
 * Appending the loader post-load meant its document.write() calls were no-ops —
 * browsers discard document.write after load — so the widget silently never
 * appeared. No error, no crash, just nothing, with the fallback link still fine.
 *
 * Rendering the exact snippet through dangerouslySetInnerHTML from the server
 * fixes it and is safer besides: React never reconciles inside a
 * dangerouslySetInnerHTML subtree, so the iframe Vagaro injects cannot be torn
 * out by a later re-render. It also keeps the widget a direct child of the top
 * document, so Vagaro's postMessage auto-resize still works.
 *
 * DO NOT "modernise" this back into a useEffect that appends the script.
 */
import { BUSINESS as B } from "@/content/business";

const VAGARO_LOADER =
  "https://www.vagaro.com//resources/WidgetEmbeddedLoader/OZqnDJOnCpWcT3qmV35y6RuSdBuOc1WJD1wOc1WO61Ctdg4tjxMG9pUxapkUcvCu7gevEhAJDXwOapcUbfY?v=KKmVqJkETGTQWFS6yvAToDLfx0pElIJ90odLGDtSGnA";

/**
 * Vagaro's snippet, reproduced verbatim. The attribution links and the <style>
 * rule are part of what Vagaro supplies; the loader replaces them once it runs.
 */
const VAGARO_SNIPPET = `
<div class="vagaro" style="width:100%;padding:0;border:0;margin:0 auto;text-align:center;">
<style type="text/css">.vagaro a{font-size:14px;color:#AAA;text-decoration:none;}</style>
<a href="https://www.vagaro.com/pro/">Powered by Vagaro</a>&nbsp;
<a href="https://www.vagaro.com/pro/salon-software">Salon Software</a>,&nbsp;
<a href="https://www.vagaro.com/pro/spa-software">Spa Software</a>&nbsp;&amp;&nbsp;
<a href="https://www.vagaro.com/pro/fitness-software">Fitness Software</a>
<script type="text/javascript" src="${VAGARO_LOADER}"></script>
</div>`;

export default function BookingEmbed() {
  return (
    <div className="border border-chrome/40 bg-paper p-6 my-8 rounded-xl">
      <p className="eyebrow mb-2">Booking</p>
      <p className="mb-4">
        Walk in any day we are open, including Sunday — no appointment needed.
        Prefer a set time or a specific barber? Book below.
      </p>

      {/* Rendered on the server so the loader runs at parse time. See the note above. */}
      <div dangerouslySetInnerHTML={{ __html: VAGARO_SNIPPET }} />

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
