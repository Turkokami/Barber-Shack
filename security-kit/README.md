# Security Kit: how to use it

This folder is a set of instructions you hand to whoever (or whatever AI) is
building each of your websites and apps. Every build gets the same baseline,
plus the add-on that matches its technology.

## For each build

1. **Always paste `01-MASTER-SECURITY-PROMPT.md` first.** It works for any website or app.
2. **Then paste the add-on that matches the project:**
   | The project is…                                         | Add this file                       |
   |---------------------------------------------------------|-------------------------------------|
   | Next.js / React site on Vercel (e.g. Barber Shack)       | `02-ADDON-nextjs-vercel.md`         |
   | PHP site, WordPress, cPanel / shared hosting            | `03-ADDON-php-wordpress.md`         |
   | Anything with logins, a database, an API or payments    | `04-ADDON-backend-api-database.md`  |
   | Phone / tablet app (iOS, Android, React Native, Flutter)| `05-ADDON-mobile-apps.md`           |
   If more than one fits (say a Next.js site that also has customer logins), paste all of them.
3. **Ask the builder to return its results in `07-SECURITY-REPORT-TEMPLATE.md`.**
   Keep the filled-in report. It shows you what was checked, what was fixed and what still needs you.
4. **Paste `08-MASTER-FILE-AMENDMENT.md` into the project's master/spec file** so the
   security layer becomes part of the build contract (tickets, gates, phase reports).
   Barber Shack already has it as Amendment D in `SPEC.md`.
5. **Work through `06-OWNER-ACCOUNT-CHECKLIST.md` once.** Most real break-ins
   come through a stolen password on a hosting, domain or email account, not
   through the code. Code can't fix that part, only you can.

## Sample message to start a build

> Read the attached security instructions and apply them to this project.
> Audit first, then fix, then fill in the security report. Don't remove any
> working feature (booking, forms, payments) while hardening. If a fix would
> break something, tell me instead of shipping it.

## About the "PHP attacks"

Bots try `/wp-login.php`, `/xmlrpc.php`, `/.env` and similar paths on **every**
website on the internet, all day, whatever the site is built with. On a site
with no PHP (like the Next.js Barber Shack site) those requests can't run
anything. They're noise, and the add-on shuts them out cheaply. On a real
PHP/WordPress site they're a real threat, and `03-ADDON-php-wordpress.md` covers that case.

## Re-run it

Give the master prompt to each project again **every 3 months** and before
any big launch. New holes show up in third-party packages all the time.
