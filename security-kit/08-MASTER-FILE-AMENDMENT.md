# DROP-IN: Security layer for any project's master build file

Paste the block below into the master/spec file of each build (as a new
amendment or section near the top). Keep the `security-kit/` folder in that
repo next to it. Fill in the `<…>` parts for the project.

---

## AMENDMENT — SECURITY LAYER

**This adds a security layer to every phase and every ticket. A ticket that passes its own
criteria but opens a security hole is a FAIL. Where a security requirement and a feature
conflict, scope the protection (allow-list), never silently drop the feature. Escalate if
they can't be reconciled.**

**Binding documents:** `security-kit/01-MASTER-SECURITY-PROMPT.md` in full, plus the add-on(s)
for this stack: `<02 Next.js/Vercel | 03 PHP/WordPress | 04 backend/API/database | 05 mobile>`.

**Tickets added**
| # | Ticket | Acceptance |
|---|---|---|
| SEC-1 | Security baseline (first phase) | Audit inventory done. Secrets out of repo/history. Dependency audit shows zero high/critical. Headers + CSP Report-Only live. Scanner paths blocked. `SECURITY.md` written. Security Report #1 filed. |
| SEC-2 | Feature check under protections | Every booking/form/payment/embed works under the CSP and rate limits. |
| SEC-3 | Pre-launch security gate | CSP enforcing. securityheaders.com A or better, SSL Labs A. Backups restore-tested (if there is data). Security Report #2 filed. |
| SEC-4 | Owner items cleared | 2FA on every account, registrar lock, SPF/DKIM/DMARC, access list cleaned (`06-OWNER-ACCOUNT-CHECKLIST.md`). |
| SEC-5 | Ongoing | Quarterly re-run of the master prompt + dependency audit. Report filed. |

**Per-route / per-screen gate:** security headers present · no CSP violations · no unescaped
user input · no secret in the client bundle · auth + authorization checked server-side on
every protected action.

**Phase report line:**
`Security: audit {n} high/critical · headers {grade} · CSP {report-only|enforced} · owner items open [#]`

**Prohibitions**
1. No secret, API key or private email address in source, git history or the client bundle.
2. No unescaped user input in HTML, `eval`, SQL strings or shell commands.
3. No deploy with a known high/critical dependency vulnerability.
4. No admin/staging/preview surface left public and unprotected.
5. No security protection that silently breaks a working customer feature.
