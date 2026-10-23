# OWNER CHECKLIST: things only you can do

Most small-business break-ins come through a stolen account password, not
the code. Go through this once and check it again every few months.

## Passwords and 2FA (most important)
- [ ] Use a **password manager** (1Password, Bitwarden, or Apple/Google's
      built-in one). Every account gets a different, long, random password.
- [ ] Turn on **two-factor authentication** (app or passkey, not SMS where
      possible) for: email, domain registrar, website host (Vercel, GoDaddy,
      Bluehost, etc.), GitHub, Wix/WordPress admin, booking system (Vagaro),
      payment processor, Google Business Profile, Facebook/Instagram, bank.
- [ ] **Your email account is the master key.** Whoever controls it can reset
      everything else, so it gets the strongest password and 2FA first.
- [ ] Save your 2FA backup/recovery codes somewhere safe and offline.

## Domain name
- [ ] Turn on **registrar lock / transfer lock** and auto-renew. Keep the card on file current.
- [ ] Make sure the domain is registered in **your** name and email, not a
      former web designer's.
- [ ] Email anti-spoofing DNS records set up (ask your builder): **SPF, DKIM, DMARC**.

## Who has access
- [ ] List everyone with access to your host, domain, GitHub, booking and
      payment accounts. Remove anyone who no longer needs it (former staff,
      old freelancers).
- [ ] Give helpers their own logins, never your password.

## Backups and recovery
- [ ] Know where your site's code lives (e.g. GitHub) and that you own that account.
- [ ] For WordPress/PHP sites: automatic off-site backups are on, and you
      have seen a restore work at least once.

## Scams that target business owners
- [ ] Never give a code that was texted to you to anyone who calls or
      messages, including someone claiming to be Google, Meta, Vagaro or your bank.
- [ ] Ignore "your domain/listing is expiring, pay here" emails. Log in
      directly to the real site instead of clicking the link.
- [ ] Watch for invoice/payment-change emails from "vendors". Confirm by phone.

## When something looks wrong
1. Change the password of the affected account from a clean device, and sign out all sessions.
2. Check that 2FA is still on and the recovery email/phone are still yours.
3. Tell your builder/host. For a hacked site, take a backup first, then restore a clean version.
4. Rotate any API keys the site uses.
