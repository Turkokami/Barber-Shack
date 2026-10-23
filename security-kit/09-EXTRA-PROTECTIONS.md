# EXTRA PROTECTIONS (no effect on site speed)

None of these touch how fast your pages load. Most live in account
dashboards and DNS, outside the website. Do the 🔴 items first.

## 🔴 Do first: account takeover is the most common way small businesses get hit

1. **Passkeys or a security key on the "master" accounts.** These are email,
   domain registrar, Vercel/host and GitHub. They stop phishing, which
   texted codes don't. A YubiKey costs about $25–55. Phone passkeys are free.
2. **Audit Google Business Profile managers.** GBP hijacking (a stranger adds
   themselves as owner, then changes your phone number or website) is very
   common for local shops. In GBP, under *Business Profile settings → Managers*,
   remove anyone you don't know. Do the same in Meta Business Suite and Vagaro staff logins.
3. **A separate private admin email** used only for account logins (registrar,
   host, GitHub, GBP). Never published and never given out, so it can't be phished.
4. **Turn on spending limits and billing alerts at Vercel and any paid API.**
   Bot floods can turn into surprise bills ("denial of wallet").

## 🟡 DNS and domain (set once, free)

5. **Registrar lock + auto-renew + WHOIS privacy.** Domain theft and expiry are unrecoverable disasters.
6. **DNSSEC** if your registrar supports it. It stops attackers from faking your DNS answers.
7. **CAA record.** Only your real certificate issuer can make HTTPS certificates for your
   domain. For Vercel: `0 issue "letsencrypt.org"`. Confirm with your host first.
8. **Email anti-spoofing.** SPF + DKIM + DMARC. Start DMARC at `p=none` with
   reports, then move to `p=quarantine` and later `p=reject` once legitimate
   mail passes. This stops scammers from emailing your customers "as" you.
9. **Lock down unused domains.** Any domain you own that doesn't send email gets
   `v=spf1 -all` and a `p=reject` DMARC, so nobody can spoof it.

## 🟡 Code and deployment (no runtime cost)

10. **GitHub: require 2FA, protect the `main` branch** (no force-push, no direct
    pushes, reviews required) and turn on **secret scanning with push protection**
    and **Dependabot alerts**. All free.
11. **Vercel: Deployment Protection on previews**, env vars marked **Sensitive**,
    and remove old team members. Firewall rules run at Vercel's edge, ahead of your
    site, so they cost no page speed.
12. **`/.well-known/security.txt`**: a tiny text file telling honest
    researchers how to report a problem to you (contact + expiry date).
13. **Don't put a second CDN/proxy (e.g. Cloudflare) in front of Vercel.** It adds
    latency and can break caching. Vercel's firewall already covers this.

## 🟢 Early warning (free monitoring)

14. **Uptime + SSL-expiry monitor** (UptimeRobot, Better Stack free tier) that
    texts or emails you if the site goes down or a certificate nears expiry.
15. **Google Search Console**: verify every site. Google emails you about
    "Security issues" (hacked content, malware) and manual actions.
16. **Have I Been Pwned domain search**: free alerts when any email at your
    domain appears in a data breach.
17. **GitHub security alerts and Vercel notifications** routed to an email you actually read.

## 🟢 Recovery insurance

18. **Store recovery/backup codes offline** (printed, in a safe place) for every account with 2FA.
19. **Keep an account inventory**: one document listing each site, its registrar,
    host, repo, form service, booking system and who has access. That makes it
    fast to respond if something happens, and a great handover document.
20. **Export your irreplaceable data** a few times a year: GBP photos, the
    review list, booking-system client list, form submissions.

## Speed impact summary
| Item | Speed impact |
|---|---|
| Everything in this file | None. It's account, DNS or monitoring settings. |
| Security headers (master prompt §3) | Negligible: a few hundred bytes per response |
| Scanner-path middleware (Next.js add-on) | None on real pages when the matcher is kept narrow |
| CSP | None on speed. Test it so it doesn't block your booking widget. |
