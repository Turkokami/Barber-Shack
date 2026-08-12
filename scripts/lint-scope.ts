#!/usr/bin/env node
/**
 * SCOPE LINTER — runs before every build. Exit code 1 fails the build.
 *
 *   npm run lint:scope
 *
 * Nine checks, in the order they matter:
 *
 *   1  No street address anywhere in the repo (service-area business rule)
 *   2  License not expired
 *   3  No unqualified "lifetime" warranty language
 *   4  Out-of-scope work never appears as a sellable service
 *   5  Every location binds to a real jurisdiction
 *   6  Every location has enough non-copyable local material
 *   7  Permit-required services never render where he cannot pull
 *   8  Registry items pending, reported with what they block
 *   9  Unverified jurisdictions reported as the blocking gate
 *
 * Checks 1–7 are hard failures. Checks 8–9 are hard failures only when
 * BUILD_TARGET=production, so the site can be developed against placeholders.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { SERVICES, OUT_OF_SCOPE_SLUGS } from '../config/services'
import { LOCATIONS } from '../config/locations'
import { JURISDICTIONS, pendingVerification } from '../config/jurisdictions'
import { LICENSE, IDENTITY, OPERATIONS, type Fact } from '../config/business'
import { assertSellable } from '../lib/scope-guard'

const ROOT = join(__dirname, '..')
const IS_PROD = process.env.BUILD_TARGET === 'production'

const errors: string[] = []
const warnings: string[] = []

const fail = (m: string) => errors.push(m)
const warn = (m: string) => warnings.push(m)

// --- 1. Street address must never appear ------------------------------------
// The owner's residential street address must not exist anywhere in this codebase.
// The patterns below match its known form without spelling it out in prose.
const ADDRESS_PATTERNS = [
  /\b373\s+Forest\s+Hills/i,
  /Forest\s+Hills\s+(Dr|Drive)/i,
  /"streetAddress"\s*:/,
  /streetAddress\s*:/,
]

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (['node_modules', '.next', '.git', 'out'].includes(entry)) continue
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (['.ts', '.tsx', '.json', '.md', '.mdx'].includes(extname(p))) out.push(p)
  }
  return out
}

const files = walk(ROOT)
for (const f of files) {
  if (f.includes('lint-scope.ts')) continue
  const text = readFileSync(f, 'utf8')
  for (const pattern of ADDRESS_PATTERNS) {
    if (pattern.test(text)) {
      fail(
        `[1] Street address or streetAddress field found in ${f.replace(ROOT, '.')}. ` +
          `This is a service-area business — the home address must never be published.`
      )
    }
  }
}

// --- 2. License expiry -------------------------------------------------------
if (LICENSE.expiresOn.status === 'confirmed') {
  const expiry = new Date(LICENSE.expiresOn.value)
  const now = new Date()
  const daysLeft = Math.floor((expiry.getTime() - now.getTime()) / 86_400_000)
  if (daysLeft < 0) {
    fail(`[2] License #5045 expired on ${LICENSE.expiresOn.value}. The site cannot claim it.`)
  } else if (daysLeft < 90) {
    warn(`[2] License expires in ${daysLeft} days (${LICENSE.expiresOn.value}). Renew and update.`)
  }
}

// --- 3. No unqualified "lifetime" warranty language --------------------------
const LIFETIME = /\blifetime\s+(warranty|guarantee|coverage|protection)\b/i
for (const f of files) {
  if (f.includes('lint-scope.ts')) continue
  const text = readFileSync(f, 'utf8')
  if (LIFETIME.test(text)) {
    fail(
      `[3] Unqualified "lifetime" warranty language in ${f.replace(ROOT, '.')}. ` +
        `Standing rule: defined-term warranties only.`
    )
  }
}

// --- 4. Out-of-scope work never sellable -------------------------------------
for (const slug of OUT_OF_SCOPE_SLUGS) {
  if (SERVICES.some((s) => s.slug === slug)) {
    fail(`[4] "${slug}" is confirmed out of license scope but appears in SERVICES.`)
  }
  const decision = assertSellable(slug)
  if (decision.sellable) {
    fail(`[4] Scope guard returned sellable for out-of-scope "${slug}".`)
  }
}

// --- 5. Location → jurisdiction binding --------------------------------------
for (const loc of LOCATIONS) {
  if (!JURISDICTIONS[loc.jurisdictionId]) {
    fail(`[5] Location "${loc.slug}" binds to unknown jurisdiction "${loc.jurisdictionId}".`)
  }
}

// --- 6. Location content depth ------------------------------------------------
// A thin location page is worse than no location page.
for (const loc of LOCATIONS) {
  if (loc.localFacts.length < 3) {
    fail(
      `[6] Location "${loc.slug}" has ${loc.localFacts.length} local facts. ` +
        `Minimum is 3 non-copyable specifics before it may publish.`
    )
  }
}

// --- 7. Permit-required services never render where he cannot pull ------------
let blockedCount = 0
for (const loc of LOCATIONS) {
  for (const svc of SERVICES) {
    const decision = assertSellable(svc.slug, loc.slug)
    const j = JURISDICTIONS[loc.jurisdictionId]
    if (svc.requiresPermit && j?.permitAuthority !== 'full' && decision.sellable) {
      fail(
        `[7] "${svc.slug}" is permit-required and rendered sellable in ${loc.name} ` +
          `where permit authority is "${j?.permitAuthority}".`
      )
    }
    if (!decision.sellable) blockedCount++
  }
}

// --- 8. Pending registry items -------------------------------------------------
function reportPending(group: string, obj: Record<string, Fact<unknown>>) {
  for (const [key, f] of Object.entries(obj)) {
    if (f.status === 'pending') {
      const msg = `[8] ${group}.${key} is pending. Blocks: ${f.blocks.join(', ')}.`
      IS_PROD ? fail(msg) : warn(msg)
    }
  }
}
reportPending('LICENSE', LICENSE as never)
reportPending('IDENTITY', IDENTITY as never)
reportPending('OPERATIONS', OPERATIONS as never)

// --- 9. Unverified jurisdictions ------------------------------------------------
const unverified = pendingVerification()
if (unverified.length) {
  const msg =
    `[9] ${unverified.length} jurisdiction(s) have unverified permit authority and are ` +
    `restricted to permit-free services:\n` +
    unverified.map((j) => `      · ${j.name}${j.verificationContact ? ` — call ${j.verificationContact}` : ''}`).join('\n')
  IS_PROD ? fail(msg) : warn(msg)
}

// --- Report --------------------------------------------------------------------
const line = '─'.repeat(74)
console.log(`\n${line}\n  SCOPE LINT — license, permit, and registry gates\n${line}`)

console.log(`\n  Services registered      ${SERVICES.length}`)
console.log(`  Locations registered     ${LOCATIONS.length}`)
console.log(`  Jurisdictions            ${Object.keys(JURISDICTIONS).length}`)
console.log(`  Service×location blocked ${blockedCount} combinations withheld by the guard`)
console.log(`  Build target             ${IS_PROD ? 'production (strict)' : 'development'}`)

if (warnings.length) {
  console.log(`\n  WARNINGS (${warnings.length})\n`)
  warnings.forEach((w) => console.log(`  ⚠  ${w}`))
}

if (errors.length) {
  console.log(`\n  ERRORS (${errors.length})\n`)
  errors.forEach((e) => console.log(`  ✗  ${e}`))
  console.log(`\n${line}\n  BUILD BLOCKED\n${line}\n`)
  process.exit(1)
}

console.log(`\n${line}`)
console.log(
  IS_PROD
    ? '  PASS — safe to publish\n'
    : '  PASS (development) — resolve warnings before production\n'
)
console.log(`${line}\n`)
