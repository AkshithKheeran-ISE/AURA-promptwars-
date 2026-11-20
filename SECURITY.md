# Security Policy

## Reporting a vulnerability

Please report vulnerabilities privately via GitHub Security Advisories
("Report a vulnerability" under the Security tab of this repository).
Do not open a public issue for a security problem. We aim to acknowledge
reports within 72 hours.

## Security architecture

- **No secrets in the client.** The Gemini API key exists only as a
  server-side environment variable (`GEMINI_API_KEY`) used by the
  serverless proxy (`netlify/functions/gemini.js`, `api/gemini.js`).
  It is never bundled, logged or returned to browsers.
- **Free live data needs no key.** Open-Meteo / CAMS requests carry only
  coordinates rounded to 2 decimal places (~1.1 km). No account, token,
  identifier or user content is sent.
- **Input handling.** All user text is sanitised (`src/utils/sanitize.js`:
  HTML stripping, URI-scheme neutralisation, length caps) before use, and
  the Gemini proxy re-sanitises prompts server-side with a 600-character
  cap and a 10 KB payload limit.
- **Rate limiting.** The proxy enforces 30 requests/minute per hashed IP
  (SHA-256, truncated), with optional durable limiting via Upstash Redis.
- **Tamper-evident community data.** Citizen reports are SHA-256
  hash-chained with a Merkle root (`src/utils/crypto.js`); tampering is
  detectable and repairable without data loss.
- **HTTP hardening.** Production configs (`vercel.json`, `netlify.toml`)
  set CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy` and COOP. The CSP allow-list
  names every external origin the app actually uses — nothing more.
- **Supply chain.** CI runs `npm audit --omit=dev`, CodeQL analysis and
  Dependabot monitoring. Dependencies are installed with `npm ci` from
  the committed lockfile.

## Supported versions

Only the latest `main` branch is supported with security fixes.
