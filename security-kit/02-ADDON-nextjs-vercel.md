# ADD-ON: Next.js / React on Vercel

Apply on top of the master prompt.

## Headers in `next.config.ts`
Add an `async headers()` block that applies the master-prompt headers to
`source: "/:path*"`, and set `poweredByHeader: false`.
- Build the CSP from the real third-party list. Typical entries for a small
  business site: booking widget (e.g. `https://www.vagaro.com` and its asset
  hosts in `script-src`, `frame-src`, `connect-src`, `img-src`), form service
  (e.g. `https://api.web3forms.com` in `connect-src`), maps, analytics.
  Find the exact hosts by loading the pages with the CSP in **Report-Only**
  and reading the console. Don't guess.
- Next.js inline scripts: if the app has inline scripts (JSON-LD,
  hydration), either use nonces via middleware or allow `'unsafe-inline'`
  for `script-src` **only** as a documented, temporary step. Never use
  `'unsafe-eval'` in production unless a vendor strictly requires it, and
  document which vendor needs it.
- JSON-LD rendered with `dangerouslySetInnerHTML` must escape `<` as `<`
  (e.g. `JSON.stringify(data).replace(/</g, "\\u003c")`) so a value can't close the script tag.

## Middleware (`middleware.ts`)
- Short-circuit scanner paths with a 404 before rendering: anything ending in
  `.php`, `/wp-*`, `/xmlrpc`, `/.env`, `/.git`, `/phpmyadmin`, `/cgi-bin`.
  Keep the matcher narrow so normal pages and `/_next/*` are untouched.

## Server code
- Every Route Handler and Server Action validates input (e.g. with `zod`)
  and checks authorization itself. Server Actions are public HTTP endpoints.
- Only `NEXT_PUBLIC_*` variables reach the browser. Make sure no secret has
  that prefix. Restrict any public key on the provider side (domain allow-list).
- Keep `next` on a patched release (check the Next.js security advisories,
  including middleware-bypass CVEs) and run `npm audit`.
- `images.remotePatterns`: list exact hosts only, no wildcards.
- Production source maps: don't serve them publicly unless they're scrubbed.

## Vercel dashboard (put these in the owner's to-do list)
- Turn on **Deployment Protection** for preview deployments.
- Turn on **Vercel Firewall / Attack Challenge Mode** when under attack. Add
  rate-limit rules for form and API paths.
- Environment variables: mark secrets **Sensitive**, scope them to the right environment.
- Team: 2FA on every member's account, remove anyone who no longer needs access.
- Domains: HTTPS is automatic, so confirm `www` and apex both redirect to one canonical host.

## Verify
- `npm run build` passes. Every page and the booking/contact flows work in a real browser.
- `curl -sI https://<site>/` shows the headers.
- `curl -sI https://<site>/wp-login.php` and `/.env` return 404.
- Score A or better at https://securityheaders.com and an A at
  https://www.ssllabs.com/ssltest/ (report the results).
