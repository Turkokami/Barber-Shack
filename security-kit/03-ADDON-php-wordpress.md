# ADD-ON: PHP, WordPress and shared hosting

Apply on top of the master prompt. PHP sites are the #1 target of automated
attacks, so treat this add-on as mandatory for any PHP site.

## Platform
- PHP on a **currently supported** version (security-supported branch only).
- WordPress core, every theme and every plugin updated. **Delete** (don't
  just deactivate) unused themes/plugins. Replace abandoned plugins (no update
  in 12+ months, or pulled from the directory).
- Turn on automatic minor/security updates for core and trusted plugins.
- Only install plugins/themes from wordpress.org or the vendor directly.
  **Never "nulled"/pirated themes or plugins.** They are the most common source of backdoors.

## `php.ini` / hosting settings
`display_errors=Off`, `log_errors=On`, `expose_php=Off`,
`allow_url_include=Off`, `session.cookie_httponly=1`,
`session.cookie_secure=1`, `session.cookie_samesite=Lax`,
`session.use_strict_mode=1`. Use `disable_functions` for `exec`, `shell_exec`,
`system`, `passthru`, `proc_open` and `popen` where the app doesn't need them.

## `wp-config.php`
- `define('DISALLOW_FILE_EDIT', true);` (no theme/plugin editor in admin)
- `define('WP_DEBUG', false);` in production
- `define('FORCE_SSL_ADMIN', true);`
- Unique auth keys/salts (regenerate them if ever exposed)
- Non-default database table prefix for new installs
- File permissions `400`/`440`, outside the web root if the host allows it

## `.htaccess` / nginx rules
- Deny access to `wp-config.php`, `.htaccess`, `.env`, `.git`, `*.sql`,
  `*.bak`, `*.log`, `composer.json/lock`, `readme.html`, `license.txt`.
- **Block PHP execution in `wp-content/uploads/`** (and any upload folder).
- Disable directory listing (`Options -Indexes`).
- Disable `xmlrpc.php` unless a specific integration (e.g. Jetpack app) needs it.
- Add the master-prompt security headers.
- Block user enumeration (`/?author=N` and `/wp-json/wp/v2/users` for anonymous visitors).

## Login and admin
- Strong unique passwords + **2FA for every administrator** (e.g. Wordfence
  login security or a 2FA plugin).
- Limit login attempts. Consider moving or IP-restricting `/wp-admin` for
  single-owner sites. No user named `admin`. Every account gets the least role it needs.
- Install a security/WAF plugin (Wordfence or Sucuri) **or** put the site
  behind Cloudflare WAF, and turn on malware scanning + email alerts.

## Custom PHP code
- Database: PDO/mysqli **prepared statements** only. In WordPress, `$wpdb->prepare()`.
- Output: `htmlspecialchars($v, ENT_QUOTES, 'UTF-8')`. In WordPress, `esc_html`,
  `esc_attr`, `esc_url`, `wp_kses`.
- Input: `sanitize_text_field` etc. Validate types and ranges.
- Forms/actions: nonces (`wp_nonce_field` / `check_admin_referer`) + `current_user_can()`.
- Passwords: `password_hash()` / `password_verify()`.
- Never `eval`, `include`/`require` with user input, `unserialize` on user
  input, or `extract($_REQUEST)`.

## Already hacked? Check for signs of compromise
Search for: unknown admin users, PHP files inside `uploads/`, recently
modified core files (compare with `wp core verify-checksums`),
`base64_decode`/`eval(`/`gzinflate` in theme/plugin files, unfamiliar cron
jobs, spam links/redirects only shown to Google. If you find any, **stop and
report**. Cleaning up properly means restoring clean code, rotating every password
and key, and requesting a Google re-review.

## Backups
Daily automatic backups (files + database) stored **off the server**
(e.g. UpdraftPlus to cloud storage, or host snapshots), 30-day retention,
one restore tested and documented.
