# SECURITY REPORT: <project name>

Date: ____  Builder: ____  Stack/hosting: ____  Add-ons applied: ____

## 1. Summary
Overall status: 🟢 Secure / 🟡 Needs owner action / 🔴 Critical issue open
One-paragraph plain-English summary for the owner.

## 2. Inventory
- Pages/routes with user input: …
- Third-party scripts/embeds/APIs (and what each one receives): …
- Secrets/environment variables (names only, never values): …
- Logins/admin areas: …

## 3. Findings and fixes
| # | Severity (Critical/High/Medium/Low) | Issue | Fix applied | Commit | Verified how |
|---|---|---|---|---|---|

## 4. Master-prompt sections
| Section | Status (Done / N/A / Open) | Notes |
|---|---|---|
| 1 Secrets | | |
| 2 Dependencies | | |
| 3 HTTPS + headers | | |
| 4 Input handling | | |
| 5 Auth + sessions | | |
| 6 Bots + probing | | |
| 7 Errors + logging | | |
| 8 Privacy | | |
| 9 Backups | | |
| 10 Hosting + admin | | |

## 5. Evidence
Audit output, header check (`curl -I`), securityheaders.com / SSL Labs
grades, scanner-path test results, feature tests (booking, forms, payments still work).

## 6. Owner to-do (things the builder could not do)
- [ ] …  (e.g. rotate leaked key X in dashboard Y, turn on 2FA on Z, add DMARC record)

## 7. Not done / accepted risks
Anything skipped, and why.
