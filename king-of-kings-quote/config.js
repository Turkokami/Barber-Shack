/**
 * KING OF KINGS — INSTANT ROOF QUOTE
 * ==================================
 * Single source of truth. Brand, business facts, pricing, and the question
 * flow all live here. Nothing in quote.js hardcodes a price or a phone number.
 *
 * Structure modelled on the Barber Shack repo's constants discipline: values
 * the owner has not personally confirmed are marked CONFIRM and listed in the
 * README's "Before you publish" section. Do not invent replacements.
 */

/* ---------------------------------------------------------------------------
 * 1. BUSINESS
 * CONFIRM every field below with the owner before this goes on a live domain.
 * Sources are directory listings, not the owner's own word.
 * ------------------------------------------------------------------------- */
const BUSINESS = {
  name: "King of Kings",
  legalName: "King of Kings Window Cleaning LLC",
  tagline: "Roof Cleaning & Moss Removal",

  // CONFIRM — from public directory listings, not owner-verified.
  phoneDisplay: "(360) 303-6806",
  phoneTel: "+13603036806",

  siteUrl: "https://www.kingofkingswindowcleaning.com/",
  serviceArea: "Bellingham · Whatcom & Skagit County",
};

/* ---------------------------------------------------------------------------
 * 2. TRUST PANEL
 * The block that sits below the question on every step — the equivalent of
 * Hydra Clean's "Forever Moss-Free Warranty" shield.
 *
 * NOTE: King of Kings has no published warranty program, so this does NOT
 * claim one. It uses credentials that appear in their own listings. If the
 * owner wants a warranty offer here, get the terms in writing first.
 * ------------------------------------------------------------------------- */
const TRUST = {
  // Kept short on purpose — these are set inside the shield SVG, which is only
  // ~88 user units wide. Long strings overflow the crest.
  badgeTitle: "LICENSED",
  badgeSubtitle: "BONDED & INSURED",
  headline: "Licensed, bonded and insured — backed by a $1,000,000 policy",
  // CONFIRM — award years from Nextdoor listing.
  body: "Nextdoor Neighborhood Fave <strong>2024 &amp; 2025</strong>. Serving Whatcom and Skagit County homeowners.",
};

/* ---------------------------------------------------------------------------
 * 3. PRICING MODEL  —  ⚠️ DRAFT RATES, OWNER MUST SET THESE ⚠️
 *
 * Every number below is a placeholder calibrated to typical Pacific Northwest
 * roof-cleaning pricing. They are NOT King of Kings' rates. Replace them with
 * the owner's real numbers before the tool quotes a single customer.
 *
 * Formula:
 *   base      = RATE_PER_SQFT × home size midpoint
 *   estimate  = base × material × condition × stories × lastCleaned × service
 *   shown     = estimate ±SPREAD, rounded to $25, low end clamped to MIN_JOB
 * ------------------------------------------------------------------------- */
const PRICING = {
  RATE_PER_SQFT: 0.35,   // DRAFT
  MIN_JOB: 375,          // DRAFT — the least you'll roll a truck for. Applied to
                         // the LOW end of the range, so the customer is never
                         // shown a number you would not honour.
  SPREAD: 0.12,          // ± band shown to the customer
  ROUND_TO: 25,

  material:    { asphalt: 1.00, tile: 1.25, cedar: 1.35, metal: 1.10 },
  condition:   { heavy: 1.35, medium: 1.15, light: 1.00, prevent: 0.80 },
  stories:     { "1": 1.00, "2": 1.15, "3": 1.30, "4": 1.45 },
  lastCleaned: { "1yr": 0.95, "2yr": 1.00, "3yr": 1.10, unsure: 1.05 },
  service:     { full: 1.00, debris: 0.55 },
};

/* ---------------------------------------------------------------------------
 * 4. LEAD DELIVERY
 * mode "none"    — no network call; the result screen shows the phone CTA only.
 * mode "webhook" — POST the full answer set as JSON to `endpoint`.
 * ------------------------------------------------------------------------- */
const LEAD_DELIVERY = {
  mode: "none",
  endpoint: "",
};

/* ---------------------------------------------------------------------------
 * 5. THE FLOW — 9 steps, mirroring the reference tool question for question.
 * type "cards" — illustrated 2-up grid
 * type "list"  — lettered full-width rows
 * type "text"  — single field with an OK button
 * ------------------------------------------------------------------------- */
const STEPS = [
  {
    id: "material",
    type: "cards",
    title: "What Type of Roof Do You Have?",
    subtitle: "Select the option that best matches your roof material.",
    options: [
      { value: "asphalt", label: "Asphalt/Composition", art: "asphalt" },
      { value: "tile",    label: "Tile",                art: "tile" },
      { value: "cedar",   label: "Cedar",               art: "cedar" },
      { value: "metal",   label: "Metal",               art: "metal" },
    ],
  },
  {
    id: "service",
    type: "list",
    title: "What Are You Looking For?",
    options: [
      { value: "full",   label: "Full Roof Cleaning & Moss Treatment" },
      { value: "debris", label: "Debris Removal Only" },
    ],
  },
  {
    id: "size",
    type: "list",
    title: "How Big is Your Home?",
    subtitle: "Don't know exactly? Just pick your best estimate.",
    options: [
      { value: "0-1000",    label: "0 - 1000 sq.ft.",    sqft: 800 },
      { value: "1000-1500", label: "1000 - 1500 sq.ft.", sqft: 1250 },
      { value: "1500-2000", label: "1500 - 2000 sq.ft.", sqft: 1750 },
      { value: "2000-2500", label: "2000 - 2500 sq.ft.", sqft: 2250 },
      { value: "2500-3000", label: "2500 - 3000 sq.ft.", sqft: 2750 },
      { value: "3000-3500", label: "3000 - 3500 sq.ft.", sqft: 3250 },
      { value: "3500-4000", label: "3500 - 4000 sq.ft.", sqft: 3750 },
      { value: "4000-4500", label: "4000 - 4500 sq.ft.", sqft: 4250 },
      { value: "4500-5000", label: "4500 - 5000 sq.ft.", sqft: 4750 },
      { value: "5000+",     label: "5000+ sq.ft.",       sqft: 5500 },
    ],
  },
  {
    id: "condition",
    type: "cards",
    title: "What Condition is Your Roof In?",
    subtitle: "Please select your best guess as to the condition of your roof.",
    options: [
      { value: "heavy",   label: "Heavy Moss",                 art: "mossHeavy" },
      { value: "medium",  label: "Medium Moss",                art: "mossMedium" },
      { value: "light",   label: "Light Moss/Just Starting",   art: "mossLight" },
      { value: "prevent", label: "Its Clean but Want to Prevent", art: "mossNone" },
    ],
  },
  {
    id: "stories",
    type: "list",
    title: "How Tall is Your Home?",
    options: [
      { value: "1", label: "1 Story" },
      { value: "2", label: "2 Story" },
      { value: "3", label: "3 Story" },
      { value: "4", label: "4 Story" },
    ],
  },
  {
    id: "lastCleaned",
    type: "list",
    title: "When Was Your Roof Last Cleaned?",
    options: [
      { value: "1yr",    label: "1 Year Ago" },
      { value: "2yr",    label: "2 Years Ago" },
      { value: "3yr",    label: "3 or More Years Ago" },
      { value: "unsure", label: "Not Sure" },
    ],
  },
  {
    id: "name",
    type: "text",
    title: "What is Your Name?",
    label: "Your Name",
    inputType: "text",
    autocomplete: "name",
    validate: (v) => (v.trim().length >= 2 ? null : "Please enter your name."),
  },
  {
    id: "phone",
    type: "text",
    title: "What is Your Phone Number?",
    subtitle: "We'll only use this to contact you about your quote.",
    label: "Phone Number",
    inputType: "tel",
    inputMode: "numeric",
    autocomplete: "tel",
    validate: (v) =>
      v.replace(/\D/g, "").length >= 10 ? null : "Please enter a 10-digit phone number.",
  },
  {
    id: "email",
    type: "text",
    title: "What is Your Email Address?",
    subtitle: "We'll send a copy of your estimate here.",
    label: "Email Address",
    inputType: "email",
    autocomplete: "email",
    validate: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : "Please enter a valid email address."),
  },
];
