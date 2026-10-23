# ADD-ON: Mobile apps (iOS, Android, React Native, Flutter, Expo)

Apply on top of the master prompt (and the backend add-on for the app's API).

- **The app binary is public.** Anyone can unpack it. No secret keys, admin
  tokens or privileged API keys inside the app. Anything secret stays on the server.
- Store tokens in the Keychain (iOS) / Keystore-backed EncryptedSharedPreferences
  (Android) / `expo-secure-store`. Never AsyncStorage/SharedPreferences in plain text.
- HTTPS only: App Transport Security on, no `usesCleartextTraffic`, no
  disabled certificate checks (including in "debug only" code that ships).
- Validate deep links / universal links and their parameters. Never trust
  them to grant access.
- WebViews: disable JavaScript and file access unless needed. Never load
  untrusted URLs with a JavaScript bridge enabled.
- Request only the permissions the app actually uses, at the moment it needs them.
- No sensitive data in logs, crash reports, screenshots of sensitive screens
  (use secure flags) or the clipboard.
- Release builds: debugging off, code minification/obfuscation on, dependencies audited.
- The server enforces everything. Client-side checks (paywalls, roles) are
  only cosmetic.
