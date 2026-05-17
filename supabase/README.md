# Nura Supabase backend

Purpose: store early-access / coming-soon registrations from the static Nura landing page.

## Current status

Supabase CLI is linked to the live Nura project:

`uructgabqrfpcdcdosdz` / `https://uructgabqrfpcdcdosdz.supabase.co`

Verified from CLI on 2026-05-17:
- project exists and is `ACTIVE_HEALTHY`
- local repo is linked to the Nura project ref
- public RPC `/rest/v1/rpc/register_waitlist_signup` returns `200` and stores a test signup

Do not launch paid traffic unless the landing-page signup test still returns `200`. A beautiful landing page that loses emails is just expensive wallpaper.

Note: the remote Supabase migration history has older timestamped migrations not present locally (`20260411170543`, `20260411174235`). `supabase db push` is blocked until migration history is repaired or synced. The live waitlist RPC itself is working.

## Files

- `supabase/migrations/001_waitlist_signups.sql`
  - Creates `public.waitlist_signups`
  - Enables RLS
  - Prevents public table reads/writes
  - Exposes a safe public RPC: `public.register_waitlist_signup(...)`
  - Upserts duplicate emails instead of losing them

## How to apply in Supabase dashboard

1. Open Supabase dashboard.
2. Create or choose the Nura project.
3. Go to SQL Editor.
4. Paste the full contents of:
   `supabase/migrations/001_waitlist_signups.sql`
5. Run it.
6. Go to Project Settings -> API.
7. Copy:
   - Project URL
   - anon public key
8. Update the landing page constants in `index.html`:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

Never paste service_role keys into frontend code. Public anon key is okay; service_role in browser is how startups become incident reports with a logo.

## Test after applying

From the browser page:
1. Enter a test email in hero form.
2. Submit.
3. Check Supabase Table Editor -> `waitlist_signups`.
4. Confirm one row appears.
5. Submit the same email again from the lower form.
6. Confirm it updates the existing row, not duplicates it.

## Expected data captured

- email
- source: `hero`, `coming_soon`, etc.
- language: `it` or `en`
- goals, if a quiz is reintroduced later
- age_range, if a quiz is reintroduced later
- page_path
- referrer
- UTM fields
- user_agent
- created_at / updated_at / first_seen_at / last_seen_at

## Security model

Public browser clients call only:

`/rest/v1/rpc/register_waitlist_signup`

Public clients cannot select from the table. This prevents random internet goblins from scraping the waitlist.
