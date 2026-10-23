# ADD-ON: Logins, databases, APIs and payments

Apply on top of the master prompt for any project with accounts, a database,
its own API, webhooks, file storage or payments.

## Access control (the #1 real-world bug class)
- Every endpoint checks **who** the caller is and **whether they may act on
  this specific record** (owner/tenant check in the query itself, e.g.
  `WHERE id = ? AND owner_id = ?`).
- No sequential IDs exposed where guessing them would leak data. Use random IDs (UUIDs).
- Admin routes are separate, require an admin role server-side, and are logged.
- Write tests that prove user A cannot read or change user B's data.

## API hygiene
- Validate every request body/query against a schema. Reject unknown fields.
- Rate limits per IP and per account. Stricter on login, signup, password reset and OTP.
- CORS: explicit allow-list of origins. Never `*` with credentials.
- Pagination limits and request body size limits to prevent resource exhaustion.
- Return generic errors to clients and keep details in server logs.

## Database
- Parameterized queries / ORM only.
- The app's DB user has only the permissions it needs (no superuser, no DROP).
- Database is not reachable from the public internet (private network or IP allow-list).
- Supabase/Firebase-style backends: **Row Level Security / security rules
  enabled on every table/collection**, tested with an anonymous and a
  normal-user client. The public "anon" key must be harmless on its own.
- Encrypted backups with a tested restore.

## Webhooks and integrations
- Verify webhook signatures (Stripe, Square, booking, etc.) and reject replays.
- Outbound requests to user-supplied URLs: block internal/metadata IPs (SSRF).
- API keys scoped to the minimum permissions, one key per environment.

## Payments
- Use the provider's hosted checkout/elements. Card data never touches your server.
- Confirm payment status from the provider's server-side webhook/API, never
  from a browser redirect alone.
- Amounts and prices come from the server, never from the client.

## File storage
- Private buckets by default, signed URLs with short expiry for downloads.
- Upload validation per the master prompt. Scan uploads for malware if the public can upload.

## Personal data
- Encrypt sensitive fields at rest. Support account deletion and data export.
- Retention limits: delete old form submissions/logs you don't need.
