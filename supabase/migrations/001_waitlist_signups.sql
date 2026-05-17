-- Nura waitlist / early-access backend
-- Apply this in Supabase SQL Editor or via Supabase CLI after linking the project.
-- Public clients should call the RPC function only; they should not read the table.

create extension if not exists pgcrypto;

create table if not exists public.waitlist_signups (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    email_normalized text generated always as (lower(trim(email))) stored,
    source text not null default 'landing',
    language text not null default 'it',
    goals jsonb not null default '[]'::jsonb,
    age_range text,
    consent_marketing boolean not null default true,
    page_path text,
    referrer text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_content text,
    utm_term text,
    user_agent text,
    first_seen_at timestamptz not null default now(),
    last_seen_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint waitlist_signups_email_normalized_unique unique (email_normalized),
    constraint waitlist_signups_email_format check (
        email_normalized ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$'
    ),
    constraint waitlist_signups_source_length check (char_length(source) <= 80),
    constraint waitlist_signups_language_allowed check (language in ('it', 'en')),
    constraint waitlist_signups_age_range_allowed check (
        age_range is null or age_range in ('18-24', '25-34', '35-44', '45+')
    )
);

create index if not exists waitlist_signups_created_at_idx on public.waitlist_signups (created_at desc);
create index if not exists waitlist_signups_source_idx on public.waitlist_signups (source);
create index if not exists waitlist_signups_goals_gin_idx on public.waitlist_signups using gin (goals);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_waitlist_signups_updated_at on public.waitlist_signups;
create trigger trg_waitlist_signups_updated_at
before update on public.waitlist_signups
for each row execute function public.set_updated_at();

alter table public.waitlist_signups enable row level security;

-- Lock the table down. Public clients register through the SECURITY DEFINER RPC below.
revoke all on table public.waitlist_signups from anon, authenticated;
revoke all on function public.set_updated_at() from anon, authenticated;

-- Optional: allow service/admin roles to manage everything through Supabase dashboard/API.
drop policy if exists "service role can manage waitlist" on public.waitlist_signups;
create policy "service role can manage waitlist"
on public.waitlist_signups
for all
to service_role
using (true)
with check (true);

create or replace function public.register_waitlist_signup(
    p_email text,
    p_source text default 'landing',
    p_language text default 'it',
    p_goals jsonb default '[]'::jsonb,
    p_age_range text default null,
    p_page_path text default null,
    p_referrer text default null,
    p_utm_source text default null,
    p_utm_medium text default null,
    p_utm_campaign text default null,
    p_utm_content text default null,
    p_utm_term text default null,
    p_user_agent text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_email text := lower(trim(coalesce(p_email, '')));
    v_language text := case when p_language in ('it', 'en') then p_language else 'it' end;
    v_source text := left(coalesce(nullif(trim(p_source), ''), 'landing'), 80);
    v_age_range text := nullif(trim(coalesce(p_age_range, '')), '');
    v_goals jsonb := coalesce(p_goals, '[]'::jsonb);
    v_id uuid;
begin
    if v_email !~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$' then
        raise exception 'invalid_email' using errcode = '22000';
    end if;

    if jsonb_typeof(v_goals) is distinct from 'array' then
        v_goals := '[]'::jsonb;
    end if;

    if v_age_range is not null and v_age_range not in ('18-24', '25-34', '35-44', '45+') then
        v_age_range := null;
    end if;

    insert into public.waitlist_signups (
        email,
        source,
        language,
        goals,
        age_range,
        page_path,
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        user_agent
    ) values (
        v_email,
        v_source,
        v_language,
        v_goals,
        v_age_range,
        left(p_page_path, 500),
        left(p_referrer, 1000),
        left(p_utm_source, 120),
        left(p_utm_medium, 120),
        left(p_utm_campaign, 160),
        left(p_utm_content, 160),
        left(p_utm_term, 160),
        left(p_user_agent, 500)
    )
    on conflict (email_normalized) do update set
        source = excluded.source,
        language = excluded.language,
        goals = case
            when excluded.goals = '[]'::jsonb then public.waitlist_signups.goals
            else excluded.goals
        end,
        age_range = coalesce(excluded.age_range, public.waitlist_signups.age_range),
        page_path = coalesce(excluded.page_path, public.waitlist_signups.page_path),
        referrer = coalesce(excluded.referrer, public.waitlist_signups.referrer),
        utm_source = coalesce(excluded.utm_source, public.waitlist_signups.utm_source),
        utm_medium = coalesce(excluded.utm_medium, public.waitlist_signups.utm_medium),
        utm_campaign = coalesce(excluded.utm_campaign, public.waitlist_signups.utm_campaign),
        utm_content = coalesce(excluded.utm_content, public.waitlist_signups.utm_content),
        utm_term = coalesce(excluded.utm_term, public.waitlist_signups.utm_term),
        user_agent = coalesce(excluded.user_agent, public.waitlist_signups.user_agent),
        last_seen_at = now()
    returning id into v_id;

    return jsonb_build_object('ok', true, 'id', v_id);
end;
$$;

revoke all on function public.register_waitlist_signup(text, text, text, jsonb, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.register_waitlist_signup(text, text, text, jsonb, text, text, text, text, text, text, text, text, text) to anon, authenticated;

comment on table public.waitlist_signups is 'Nura landing page early-access registrations. Locked from public reads; public insert/upsert via register_waitlist_signup RPC.';
comment on function public.register_waitlist_signup is 'Public-safe RPC for Nura waitlist signup/upsert from static landing page.';
