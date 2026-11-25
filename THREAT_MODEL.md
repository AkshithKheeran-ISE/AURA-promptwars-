# AURA — Threat Model

Plain-language security notes for AURA, the family smog assistant.
Last reviewed: 2026-11-25. Prompt version: see `PROMPT_VERSION` in
`src/services/aiService.js`.

## What AURA protects

- **The Gemini API key.** The only real secret in the system.
- **User input.** Family queries, household details, citizen reports.
- **The citizen ledger.** Community hazard reports must be tamper-evident.
- **Live air data.** Users must be able to tell live data from simulated data.

## What AURA does not hold

- No user accounts, no passwords, no payment data.
- No personal data on any server. The browser stores only two things,
  both on the user's own device: a boot flag (`sessionStorage`) and the
  agent chat history (`localStorage`, never sent anywhere).
- No medical records. Age and health-condition inputs stay in the
  browser and shape on-screen advice only.

## Trust boundaries

```
Browser (untrusted) ──► Serverless proxy ──► Google Gemini
Browser ──► Open-Meteo / CAMS (public data, no key, CORS)
Browser ──► Leaflet / OpenStreetMap tiles (public, no key)
```

The browser is treated as hostile: anything it sends is validated
again on the server side. The proxy never trusts the browser's claims
about who the user is — there is no identity to spoof.

## The Gemini key

- Lives only in the server environment (`GEMINI_API_KEY`). It is never
  in the client bundle, never in git, and never in an error message.
- `.env.example` documents it as server-only.
- The proxy checks the key before use (must be a string of 20+ chars).
  If it is missing or invalid, AURA does **not** fail: it falls back to
  the deterministic expert system in the browser. This is deliberate —
  a family checking smog advice should never see a dead page because
  a key expired.
- If the key leaks, rotate it in the Vercel / Netlify dashboard. No
  user data is at risk from a leaked key, because the proxy holds no
  user data.

## The proxy (`netlify/functions/gemini.js`, reused by `api/gemini.js`)

- **Origin allowlist.** Only configured origins (`ALLOWED_ORIGINS`)
  may call it.
- **Rate limiting.** Sliding window per hashed IP in memory, with an
  optional durable Upstash Redis limiter. IPs are hashed, never logged
  raw.
- **Input limits.** Prompts are sanitized and capped at 500 chars
  (`sanitizeInput`); model replies are capped at 2000 chars.
- **Timeouts.** Requests abort after `TIMEOUTS.GEMINI_API_REQUEST_MS`.
- **No tool access.** The model returns text. That text is displayed,
  never executed, and never used to call tools. A prompt-injected reply
  therefore cannot trigger actions — there is nothing for it to trigger.

## The browser

- **Content Security Policy** (`vercel.json`, `netlify.toml`): scripts
  and styles from self only; connections only to the proxy, Open-Meteo
  and OpenStreetMap tiles. The dead CARTO tile origin was removed in
  2026-11-25.
- **Security headers:** HSTS, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`,
  `Permissions-Policy` (camera, microphone, geolocation all off),
  `Cross-Origin-Opener-Policy: same-origin`.
- **Input handling.** All user text passes through `sanitizeInput`
  (HTML stripped, `javascript:` / `data:` schemes and event handlers
  removed) and `escapeHtml` before display. Citizen reports are
  validated (`validateCitizenReport`) before they reach the ledger.
- **Immutable caching.** `/assets/*` are served with
  `max-age=31536000, immutable`, so a tampered asset cannot be swapped
  in later.

## The citizen ledger

- Every report is SHA-256 hashed and chained to the previous block,
  with a binary Merkle root over all reports.
- `verifyLedger` detects tampering; `repairLedgerChain` restores the
  chain from the canonical copy and quarantines the tampered evidence.
- Tampering is visible in the UI (tamper banner), not silent.

## Live data honesty

- Open-Meteo / CAMS data is public and keyless. The snapshot is
  labelled live only when the free API actually answered; otherwise
  the app says so and keeps the statutory baseline.
- Snapshots are cached for 10 minutes. The app never presents a
  cached or simulated reading as a fresh live one.

## Supply chain

- `npm audit --omit=dev` runs in CI on every push to `main`.
- Dependabot is enabled (5 open PRs as of 2026-11-25).
- CodeQL Security Analysis runs on every push.
- CI installs with `npm ci --ignore-scripts` from the lockfile.

## Residual risks

- **CodeQL Action v3** is deprecated in December 2026. The fix (v3 →
  v4 in `codeql.yml`) is prepared but must be applied in the GitHub
  web UI.
- **Free API availability.** Open-Meteo and Gemini free tiers can be
  rate-limited or down. The deterministic fallback covers Gemini; live
  air quality degrades to the baseline with an honest label.
- **Prompt injection in user queries.** A user can type anything into
  the agent chat. Inputs are sanitized and length-capped, model output
  is display-only, and there are no tools for injected text to drive.
- **Node.js 20 deprecation** warnings in CI (actions forced onto
  Node 24). Cosmetic; CI still passes.

## Out of scope

- No authentication or authorization system exists to attack, because
  there are no accounts.
- No server-side storage of user data exists to breach.
- Physical device security (the user's phone or laptop) is the user's
  own responsibility.
