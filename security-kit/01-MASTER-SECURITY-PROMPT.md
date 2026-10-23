# MASTER SECURITY PROMPT (apply to every website and application)

You are hardening this project against real-world attacks. Security is a
release requirement, not an extra. Follow every section below. Where a
section doesn't apply to this project, say so in the report and explain why.

## Ground rules

1. **Audit before you change.** First list the stack, hosting, every place
   user input enters, every third-party script/embed/API, every secret and
   every login. Then fix things.
2. **Never break working features.** Booking widgets, contact forms, payments,
   maps, analytics and embeds must still work after hardening. Test each one.
   If a protection would break one, scope it (allow-list that one provider)
   and don't drop the feature. If you can't resolve it, stop and report.
3. **Don't invent values.** Don't make up domains, keys, emails or account
   IDs. Leave a clearly marked TODO and list it in the report.
4. **Smallest effective change.** Prefer built-in, well-maintained platform
   features over custom security code. Never write your own crypto.
5. **Verify every fix** with a command, test or request you actually ran,
   and include the evidence in the report.

## 1. Secrets and credentials
- No API keys, passwords, tokens, private keys or database URLs in source
  code, git history, client-side bundles, logs or error messages.
- Scan the repo **and its git history** for leaked secrets. If any are
  found: report them as CRITICAL and tell the owner to **rotate** them (a
  deleted secret is still compromised once it has been in git).
- Secrets live in the host's environment-variable settings only. Commit a
  `.env.example` with names but no values. Make sure `.env*` is in `.gitignore`.
- Anything exposed to the browser (e.g. `NEXT_PUBLIC_*`, `VITE_*`,
  `REACT_APP_*`) is public. Confirm each one is *meant* to be public and is
  restricted on the provider's side (domain allow-list, rate limit).

## 2. Dependencies and supply chain
- Run the ecosystem audit (`npm audit`, `pnpm audit`, `composer audit`,
  `pip-audit`, etc.) and fix every high/critical issue. Upgrade within major
  versions first, and note any that need a major upgrade.
- Commit the lockfile. Remove unused dependencies.
- Load third-party scripts only from the vendor's official URL over HTTPS.
  No random CDNs and no copy-pasted minified code of unknown origin.
- Turn on automated dependency alerts (GitHub Dependabot or equivalent) if the repo lives on GitHub.

## 3. HTTPS and security headers
Serve everything over HTTPS and redirect HTTP to HTTPS. Send these headers on every response:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains`
  (add `preload` only after the owner confirms *every* subdomain is HTTPS)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN` **and** CSP `frame-ancestors 'self'`
  (stops clickjacking)
- `Permissions-Policy` that disables what the site doesn't use, e.g.
  `camera=(), microphone=(), geolocation=(), payment=()`. Leave enabled
  anything a booking or payment widget needs.
- `Content-Security-Policy`: build it from the actual list of third-party
  origins found in the audit. **Ship it as `Content-Security-Policy-Report-Only`
  first**, browse every page (especially booking/forms/payments), fix
  violations, then switch to enforcing. Include at minimum `default-src 'self'`,
  `object-src 'none'`, `base-uri 'self'`, `form-action` limited to real form
  targets and `frame-ancestors 'self'`.
- Remove the `X-Powered-By` header and any other header that reveals the server software or version.

## 4. Input handling (forms, URLs, uploads, APIs)
- Treat **all** input as hostile: form fields, query strings, headers,
  cookies, file names, webhook bodies, data from third-party APIs.
- Validate on the server (type, length, format, allow-list). Browser-side
  validation is only a convenience for users.
- Output-encode everything rendered into HTML. Never put user input into
  `innerHTML`, `dangerouslySetInnerHTML`, `eval`, `new Function`, template
  strings that become HTML, or shell commands.
- Database: parameterized queries / ORM only. Never build SQL by string concatenation.
- File uploads: allow-list types (check the content, not just the extension),
  cap the size, rename to random names, store outside the web root or in object
  storage, and never execute uploaded files.
- Contact/lead forms: honeypot field + rate limit + CAPTCHA/Turnstile if spam
  shows up. Never publish a raw email address as the form destination.
- Redirects: only to allow-listed destinations (no open redirects via `?next=`).

## 5. Authentication and sessions (if there are any logins)
- Use a proven auth provider or framework module. Don't hand-roll password storage.
- Passwords hashed with bcrypt/argon2. Minimum length 12. Check against
  breached-password lists where possible.
- Offer, and for admin accounts **require**, two-factor authentication.
- Rate-limit and lock out after repeated failed logins. Use the same error
  message whether it was the username or the password that was wrong.
- Session cookies: `HttpOnly`, `Secure`, `SameSite=Lax` (or `Strict`), sensible expiry,
  rotated on login, invalidated on logout and password change.
- CSRF protection on every state-changing request.
- Every server action/API route checks **authorization** (is *this* user
  allowed to touch *this* record?), not just "is someone logged in".
- Password-reset tokens: single-use, short-lived, random.

## 6. Bots, probing and abuse
- Return a fast 404/410 for scanner paths that don't exist on this stack
  (e.g. `*.php`, `/wp-admin`, `/wp-login.php`, `/xmlrpc.php`, `/.env`,
  `/.git`, `/phpmyadmin`, `/cgi-bin`), without touching application code.
- Make sure `/.git`, `/.env`, backups (`*.bak`, `*.sql`, `*.zip`), source maps
  with secrets, and config files are **never** publicly downloadable. Test by
  requesting them.
- Rate-limit forms, logins and API endpoints. Turn on the host's WAF/bot
  protection where it exists (Vercel Firewall, Cloudflare, Wordfence, etc.).

## 7. Errors, logging and monitoring
- Production shows friendly error pages. No stack traces, SQL errors, file
  paths or debug mode in production.
- Log security-relevant events (logins, failed logins, admin changes, payment
  events) **without** logging passwords, card data, full tokens or other
  personal data you don't need.
- Set up uptime monitoring and error alerts that reach the owner.

## 8. Privacy and data minimization
- Collect only what the business needs. Don't store card numbers. Use the
  payment provider's hosted fields/checkout.
- Publish a privacy policy that matches what is actually collected and which
  third parties receive it (form service, booking, analytics).
- Personal data is encrypted in transit (HTTPS) and at rest where the host supports it.

## 9. Backups and recovery
- Confirm the code is in version control off the server (e.g. GitHub).
- For anything with a database or uploads: automated backups, stored off
  the server, with at least one **tested restore**. Document how to restore.
- Document how to roll back a bad deploy.

## 10. Hosting and admin surfaces
- Admin panels, databases, staging sites and preview deployments are not
  publicly indexable and are protected (auth, IP allow-list or the host's
  deployment protection).
- Principle of least privilege for every API key, database user and team
  member.
- `robots.txt` is **not** security. Never rely on it to hide anything.

## Deliverables
1. The fixes, committed with clear messages (one concern per commit where practical).
2. A `SECURITY.md` in the repo: what is protected, where secrets live, how to
   rotate keys, how to restore backups, and who to contact.
3. A filled-in **Security Report** (format in `07-SECURITY-REPORT-TEMPLATE.md`),
   including every item the **owner** must do by hand (dashboards, DNS, 2FA, key rotation).
