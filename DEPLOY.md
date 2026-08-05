# Deploying Barber Shack to Vercel

This is a standard Next.js (App Router) app. Vercel installs dependencies and
builds it in its own cloud, so it does not matter that it was authored offline.

## Fastest path (drag-and-drop, ~3 minutes)

1. Go to https://vercel.com and sign in (free "Hobby" plan is fine).
2. Click **Add New… → Project**.
3. Choose **Deploy without Git** (or install the Vercel CLI — see below) and
   upload this whole `barber-shack` folder.
4. Framework preset should auto-detect **Next.js**. Leave build settings default:
   - Build command: `next build`
   - Output: (Next.js default)
5. Click **Deploy**. In ~1–2 minutes you get a live URL like
   `barber-shack-xyz.vercel.app` — open it, navigate it, and share that link
   with Jared.

## CLI path (if you prefer the terminal)

```bash
npm i -g vercel      # once
cd barber-shack
vercel               # follow prompts → gives a preview URL
vercel --prod        # promotes to a production URL
```

## Connecting the real domain later

Once you are happy with it, add `bellinghambarbershack.com` under the project's
**Settings → Domains**, then point DNS at Vercel. Do the Wix → new-site 301
redirects (in `next.config.ts`) before flipping DNS — see SPEC.md Phase 5.

## Contact form (one env var to go live)

The Contact and Apprenticeship pages have a working message form. It sends via
[Web3Forms](https://web3forms.com) so the site stays static and the shop's email
address is never published on the page (only an opaque key is).

To turn it on:

1. Go to https://web3forms.com, enter the inbox that should receive submissions
   (e.g. the shop's forwarding mailbox), and copy the **Access Key** they email you.
2. In Vercel → Project → **Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` = the key from step 1
3. Redeploy. Submissions now arrive in that inbox.

Until the key is set, the form still renders but tells visitors to call the shop
instead of silently dropping a message.

## Still open before a public launch (not blockers for a preview)

- `content/business.ts`: domain email + the GBP "leave a review" link.
- Confirm which services carry the $12 Tuesday rate.
- Barber roster + Shaquana's resident-studio pages (need names/licenses/consent).
- A real `next build` will also confirm the Tailwind v4 utilities render as intended.
