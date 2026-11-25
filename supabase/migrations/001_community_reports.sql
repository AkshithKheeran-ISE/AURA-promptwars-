-- AURA community reports — Supabase (Postgres) migration 001
--
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- It mirrors the client-side ledger (src/hooks/useCitizenLedgerState.js):
-- id, issue, location, reporter, urgency, lat, lng, prev_hash, hash,
-- stage, status_text, created_at. The SHA-256 hash chain keeps working
-- the same way; the server copy is what makes reports shared and durable.
--
-- Row Level Security notes (read before changing):
-- * service_role BYPASSES RLS by design, so no policy is needed for
--   admins. The admin dashboard must call Supabase with the service_role
--   key from a serverless function only — never from the browser, and
--   never with a VITE_ prefix (Vite exposes those in the bundle).
-- * The anon key is safe in the browser: RLS limits what it can do.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- community_reports
-- ---------------------------------------------------------------------------
create table if not exists community_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  issue text not null,
  location text not null,
  reporter text,
  urgency text not null default 'High'
    check (urgency in ('Low', 'Medium', 'High', 'Critical')),
  lat double precision,
  lng double precision,
  prev_hash text,
  hash text not null,
  stage integer not null default 1 check (stage between 1 and 4),
  status_text text,
  created_at timestamptz not null default now()
);

alter table community_reports enable row level security;

-- Any signed-in user may file a report, but only as themselves.
create policy "Users can insert own reports"
  on community_reports for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can read only their own reports.
create policy "Users can read own reports"
  on community_reports for select
  to authenticated
  using (auth.uid() = user_id);

-- No SELECT policy for service_role is needed: it bypasses RLS.
-- Admin reads happen through the serverless function with that key.

create index if not exists community_reports_user_id_idx
  on community_reports (user_id);
create index if not exists community_reports_created_at_idx
  on community_reports (created_at desc);

-- ---------------------------------------------------------------------------
-- impact_metrics — per-choice impact a user logs
-- (feeds the savings tracker; one row per logged choice)
-- ---------------------------------------------------------------------------
create table if not exists impact_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  choice text not null,
  pm25_avoided_ug numeric,
  co2_avoided_kg numeric,
  inr_saved numeric,
  logged_on date not null default current_date,
  created_at timestamptz not null default now()
);

alter table impact_metrics enable row level security;

create policy "Users can insert own impact rows"
  on impact_metrics for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can read own impact rows"
  on impact_metrics for select
  to authenticated
  using (auth.uid() = user_id);

create index if not exists impact_metrics_user_id_idx
  on impact_metrics (user_id);
create index if not exists impact_metrics_logged_on_idx
  on impact_metrics (logged_on desc);
