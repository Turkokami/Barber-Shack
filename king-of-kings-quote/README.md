# King of Kings — Instant Roof Quote

A standalone, 9-step instant-quote tool for **King of Kings Window Cleaning LLC**,
modelled on the flow at `quote.callhydraclean.com` and rebranded.

No framework, no build step, no dependencies. Five files. Open `index.html` and
it runs — from a static host, an S3 bucket, or straight off disk.

```
king-of-kings-quote/
├── index.html          page shell
├── styles.css          all styling; every colour is a token on :root
├── config.js           business facts, pricing model, and the 9 questions
├── illustrations.js    inline SVG art for the picture-card steps
└── quote.js            flow engine, pricing, result screen
```

---

## ⚠️ Before you publish

Three things are **not** owner-confirmed. Fix them before this quotes a real customer.

| # | What | Where | Why it matters |
|---|------|-------|----------------|
| 1 | **Every pricing number is a draft.** `RATE_PER_SQFT`, `MIN_JOB`, and all six multiplier tables are placeholders calibrated to typical PNW roof-cleaning rates — they are *not* King of Kings' rates. | `config.js` → `PRICING` | The tool quotes dollar figures to customers. Wrong rates mean either lost margin or a quote you can't honour. |
| 2 | **Phone number and trust claims** come from public directory listings (Yelp, Nextdoor, BBB), not from the owner. | `config.js` → `BUSINESS`, `TRUST` | Publishing a wrong number silently kills every lead. |
| 3 | **Brand palette is an interpretation.** Royal blue + gold with a crown mark, chosen to fit the name. I could not reach `kingofkingswindowcleaning.com` from the build sandbox to match their real colours or logo. | `styles.css` → `:root`, and the crown SVGs in `index.html` / `quote.js` | Should match their existing site and van livery. |

There is no warranty claim anywhere in this tool. Hydra Clean's version leans on
a "Forever Moss-Free Warranty"; King of Kings has no published equivalent, so the
trust panel uses licensing and insurance instead. **Do not add a warranty offer
without the terms in writing.**

---

## The flow

| Step | Question | Type |
|------|----------|------|
| 1 | What Type of Roof Do You Have? | picture cards — asphalt, tile, cedar, metal |
| 2 | What Are You Looking For? | full clean & moss treatment · debris removal only |
| 3 | How Big is Your Home? | 10 sq.ft. brackets |
| 4 | What Condition is Your Roof In? | picture cards — heavy / medium / light moss, or preventative |
| 5 | How Tall is Your Home? | 1–4 storeys |
| 6 | When Was Your Roof Last Cleaned? | 1 yr · 2 yr · 3+ yr · not sure |
| 7 | What is Your Name? | text |
| 8 | What is Your Phone Number? | tel |
| 9 | What is Your Email Address? | email — the lead capture |
| → | Estimate range, itemised summary, call CTA | result |

## Pricing model

```
base     = RATE_PER_SQFT × home-size midpoint
estimate = base × material × condition × stories × lastCleaned × service
shown    = estimate ±SPREAD, rounded to $25, low end clamped to MIN_JOB
```

The clamp is applied to the **low end of the range**, not the midpoint —
clamping the midpoint lets the band dip below the minimum and quote a job you'd
refuse to take.

To retune, edit `PRICING` in `config.js`. Nothing else needs to change.

## Editing the questions

`STEPS` in `config.js` drives everything. Add, remove, or reorder entries and
the progress bar, "Step N of 9" counter, Back button, and keyboard shortcuts all
follow automatically. Three step types:

- `cards` — 2-up illustrated grid; each option needs an `art` key from `illustrations.js`
- `list` — lettered full-width rows (A, B, C…)
- `text` — single field with an optional `validate(value)` returning an error string or `null`

## Capturing leads

Out of the box the tool makes **no network call** — the result screen just shows
the estimate and a tap-to-call button. To send leads somewhere:

```js
const LEAD_DELIVERY = {
  mode: "webhook",
  endpoint: "https://your-endpoint.example.com/leads",
};
```

It POSTs JSON containing the estimate range, raw answers, and human-readable
labels. Delivery failures are logged to the console and never block the result
screen — the customer keeps their number either way.

Works with Zapier / Make catch hooks, a Netlify or Vercel function, or any CRM
that accepts JSON. **Add server-side spam protection before going live** — a
public endpoint with no rate limiting will collect junk.

## Notes

- **Illustrations are vector, not photos.** No stock licensing, no image hosting,
  crisp at any density, and they render offline. Swap in photography by replacing
  the `art` functions in `illustrations.js`.
- **Accessibility:** semantic buttons, visible focus rings, `role="status"` step
  announcements, `role="alert"` validation errors, and reduced-motion support.
- **Keyboard:** press A/B/C… to pick an option, Enter to submit a text field.
- Customer-entered text is HTML-escaped before it re-enters the DOM.

## Verified

Driven end-to-end in headless Chromium: all 9 steps, keyboard selection, Back,
Restart, validation rejection on all three text fields, the minimum-price clamp,
and HTML escaping of customer input. No console errors; no horizontal overflow
at 360px or 1280px.
