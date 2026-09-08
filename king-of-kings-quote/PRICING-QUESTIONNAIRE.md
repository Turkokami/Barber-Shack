# Pricing questionnaire — King of Kings instant roof quote

**For:** the owner · **Takes:** about 10 minutes · **Purpose:** the quote tool
currently runs on placeholder rates. Nothing goes live until these are your
real numbers.

**How to answer:** everything is either a dollar amount, a percentage, or
"same". Where you'd rather not put a price online at all, write **CALL** and the
tool will collect the lead and skip the number for that case.

One thing to keep in mind throughout: the tool asks the *homeowner* for their
**home's square footage** (living area), because that is the only number a
homeowner actually knows. It does not ask for roof area. So price these as
"a house that size", the way you would over the phone.

---

## Part 1 — Four anchor prices

These four set the whole scale. Everything else in the questionnaire is an
adjustment away from them, so take the most care here.

**All four assume the same job:** full roof cleaning & moss treatment ·
asphalt/composition roof · single story · medium moss · last cleaned about
2 years ago.

| # | Home size | Your price |
|---|-----------|-----------|
| 1 | 1,000 – 1,500 sq ft | $ |
| 2 | 2,000 – 2,500 sq ft | $ |
| 3 | 3,000 – 3,500 sq ft | $ |
| 4 | 4,500 – 5,000 sq ft | $ |

> Four sizes rather than one because it shows whether your pricing rises in a
> straight line with size or flattens out on bigger homes. Those produce
> noticeably different quotes at the top end.

---

## Part 2 — Roof material

Same job as Part 1, but a different roof. Compared with asphalt/composition:

| Material | Same price? | Or add / subtract |
|----------|-------------|-------------------|
| Tile | ☐ same | +/− ______ % or $ ______ |
| Cedar shake | ☐ same | +/− ______ % or $ ______ |
| Metal | ☐ same | +/− ______ % or $ ______ |

**Any material you won't quote online, or won't clean at all?**
_______________________________________________

---

## Part 3 — Roof condition

Compared with **medium moss**:

| Condition | Same price? | Or add / subtract |
|-----------|-------------|-------------------|
| Heavy moss | ☐ same | +/− ______ % or $ ______ |
| Light moss / just starting | ☐ same | +/− ______ % or $ ______ |
| Already clean — wants prevention only | ☐ same | +/− ______ % or $ ______ |

**Is there a point where heavy moss stops being a price and becomes "I need to
look at it first"?**  ☐ No ☐ Yes — when: _______________________

---

## Part 4 — How tall the home is

Compared with a **single storey**:

| Height | Same price? | Or add / subtract |
|--------|-------------|-------------------|
| 2 storey | ☐ same | +/− ______ % or $ ______ |
| 3 storey | ☐ same | +/− ______ % or $ ______ |
| 4 storey | ☐ same | +/− ______ % or $ ______ · ☐ CALL instead |

---

## Part 5 — Time since the last cleaning

The tool asks this. It may or may not change your price — plenty of shops let
Part 3 (condition) cover it entirely.

☐ **It doesn't change my price** — skip the rest of this section.

Otherwise, compared with **2 years ago**:

| Last cleaned | Add / subtract |
|--------------|----------------|
| 1 year ago | +/− ______ % or $ ______ |
| 3 or more years ago | +/− ______ % or $ ______ |
| Not sure | +/− ______ % or $ ______ |

---

## Part 6 — Debris removal only

The second option customers can pick: blow-off and debris clearing, no moss
treatment.

- Is it a **percentage of the full clean**? ______ %
- Or a **flat price** regardless of home size? $ ______
- Or **priced by size** like Part 1? ☐ yes — give me the same four numbers:

| Home size | Debris-only price |
|-----------|------------------|
| 1,000 – 1,500 sq ft | $ |
| 2,000 – 2,500 sq ft | $ |
| 3,000 – 3,500 sq ft | $ |
| 4,500 – 5,000 sq ft | $ |

---

## Part 7 — Your minimum

- **Smallest total you'll take a roof job for:** $ ______
- When the math lands under that, should the tool:
  ☐ show the minimum  ☐ show "call for a quote"

---

## Part 8 — How the price should look

- Show a **range** ($800 – $1,000) or a **single number** ($900)?
  ☐ range ☐ single
- If a range, how wide? ☐ ±10% ☐ ±15% ☐ ±20% ☐ other: ______
- Round prices to the nearest: ☐ $25 ☐ $50 ☐ $100

> A range converts better than a single number — it feels honest and leaves you
> room on inspection. But it's your call, and the tool does either.

---

## Part 9 — When should it NOT show a price?

Tick anything where you'd rather the tool take the lead and have you call, than
put a number on screen:

☐ 4-storey homes ☐ Cedar roofs ☐ Tile roofs ☐ Metal roofs
☐ Heavy moss ☐ Homes over 5,000 sq ft ☐ Commercial buildings
☐ Other: _______________________________________________

---

## Part 10 — Add-ons (optional — for the next version)

Not in the tool today. Worth capturing while you're thinking about it.

- Gutter cleaning added to a roof clean: $ ______ or ______ %
- Window cleaning bundled with a roof clean — any discount? ______
- Do you offer a re-treat / guarantee period? ☐ no ☐ yes: ______________
- Travel charge beyond a certain distance? ☐ no ☐ yes: beyond ______ miles, $ ______

---

## Part 11 — Confirm your details

These are currently pulled from your Yelp / Nextdoor / BBB listings, not from
you. Please correct anything wrong — a wrong phone number silently kills every
lead the tool generates.

| Field | We have | Correct? |
|-------|---------|----------|
| Business name | King of Kings Window Cleaning LLC | ☐ yes / fix: |
| Phone | (360) 303-6806 | ☐ yes / fix: |
| Service area | Bellingham · Whatcom & Skagit County | ☐ yes / fix: |
| Insurance wording | "Licensed, bonded and insured — backed by a $1,000,000 policy" | ☐ yes / fix: |
| Awards | "Nextdoor Neighborhood Fave 2024 & 2025" | ☐ yes / fix: |

- **Where should new leads go?** email: ____________________  and/or text: ____________________
- **Is there a warranty or guarantee you want featured?** (right now the tool
  claims none, deliberately) ☐ no ☐ yes: _______________________

---

## What happens next

Your answers map straight onto `PRICING` in `config.js`:

| Questionnaire | Config |
|---------------|--------|
| Part 1 | `RATE_PER_SQFT` and the size curve |
| Part 2 | `material` |
| Part 3 | `condition` |
| Part 4 | `stories` |
| Part 5 | `lastCleaned` |
| Part 6 | `service.debris` |
| Part 7 | `MIN_JOB` |
| Part 8 | `SPREAD`, `ROUND_TO` |

Once they're in, I'll run a dozen realistic jobs through the tool and send back
the quotes it produces, so you can sanity-check the output against what you'd
actually charge before a single customer sees it.
