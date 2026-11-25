# AURA — Supabase Setup (Admin-Only Data Storage)

Community reports and impact rows currently live only in the browser
(in-memory ledger, lost on refresh, never shared). Supabase gives them
a shared, durable home with access controls. This guide sets up the
database. The app code that talks to it comes after, once the project
exists.

## 1. Create the project (free tier, no card)

1. Go to https://supabase.com and sign in (GitHub login works).
2. **New project** → name it `aura`, pick a region close to India
   (Mumbai / `ap-south-1`), set a strong database password, create it.
3. Wait for the project to finish provisioning (a minute or two).

## 2. Run the migration

1. In the Supabase dashboard, open **SQL Editor** → **New query**.
2. Paste the whole contents of `supabase/migrations/001_community_reports.sql`.
3. Click **Run**. It creates two tables:
   - `community_reports` — mirrors the in-browser ledger
     (issue, location, reporter, urgency, lat/lng, hash chain, stage).
   - `impact_metrics` — one row per logged choice
     (PM2.5 avoided, CO2 avoided, rupees saved).
4. Confirm in **Table Editor** that both tables exist.

## 3. Understand the keys (read this before touching code)

In **Settings → API** you will see three values:

| Key                | Where it may live                       | Rule                                                                          |
| ------------------ | --------------------------------------- | ----------------------------------------------------------------------------- |
| Project URL        | Browser code (`VITE_SUPABASE_URL`)      | Public, safe to ship                                                          |
| `anon` key         | Browser code (`VITE_SUPABASE_ANON_KEY`) | Public, but RLS limits what it can do                                         |
| `service_role` key | **Serverless function env only**        | **Never** in the browser, never with a `VITE_` prefix, never committed to git |

Why: Row Level Security lets signed-in users insert and read only
their own rows. The `service_role` key **bypasses RLS by design** —
that is how the admin dashboard reads everything. Anyone holding it
holds the whole database, so it lives only in the server environment
(Vercel/Netlify dashboard), exactly like the Gemini key does today.

## 4. What happens next (needs a decision from you)

The migration is ready, but the app does not call Supabase yet.
Before the client code is written, two things are needed:

1. **The keys.** Send me the Project URL and the `anon` key through
   the secure vault flow — never paste keys in chat. The
   `service_role` key stays with you until the server function exists.
2. **Auth for reporting.** RLS ties every row to a signed-in user
   (`user_id = auth.uid()`). Today AURA has no accounts, so reporting
   needs one of these:
   - **(a) Supabase Auth** (email or Google) — users sign in before
     reporting. Proper, but it adds a sign-in step.
   - **(b) Anonymous reporting** — a narrow policy lets anyone insert
     a report with no `user_id`. Simpler, but reports are then
     unauthenticated.

My recommendation: start with **(a)** for the admin dashboard and
keep the in-browser ledger for anonymous viewing, then decide (a)
vs (b) for filing once you have tried the sign-in flow.

## 5. What is NOT in this migration

- No auth configuration (that is step 4 above).
- No serverless function for the admin dashboard yet.
- No client code yet — that is written once steps 1–4 are done and
  tested against the real project.
