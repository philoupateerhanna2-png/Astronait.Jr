-- Astronaut Jr planned Supabase schema.
-- Apply only to a new development Supabase project after review.
-- Authoritative writes are intended to come from the `api` Edge Function.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Cadet' check (char_length(display_name) between 1 and 40),
  public_handle text unique check (public_handle is null or public_handle ~ '^[A-Za-z0-9_-]{3,20}$'),
  leaderboard_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cadet_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  call_sign text not null default 'Cadet' check (char_length(call_sign) between 1 and 20),
  avatar_key text,
  locale text not null default 'en' check (locale in ('en','ar')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- This table is deliberately inaccessible to anon/authenticated clients.
-- A new signup never receives an admin/teacher role automatically.
create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','teacher')),
  granted_by uuid references auth.users(id) on delete set null,
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table if not exists public.mission_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_key text not null check (char_length(mission_key) between 1 and 80),
  status text not null default 'in_progress' check (status in ('locked','available','in_progress','completed')),
  best_score integer not null default 0 check (best_score >= 0),
  max_score integer not null default 0 check (max_score >= 0 and best_score <= max_score),
  attempts_count integer not null default 0 check (attempts_count >= 0),
  checkpoint jsonb,
  revision bigint not null default 1 check (revision > 0),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, mission_key)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_key text,
  quiz_key text not null,
  quiz_version text not null,
  score integer not null check (score >= 0),
  max_score integer not null check (max_score >= 0 and score <= max_score),
  idempotency_key uuid not null,
  submitted_at timestamptz not null default now(),
  unique (user_id, idempotency_key)
);

create table if not exists public.achievement_catalog (
  achievement_key text primary key,
  title text not null,
  description text not null default '',
  icon_key text,
  is_active boolean not null default true
);

create table if not exists public.user_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_key text not null references public.achievement_catalog(achievement_key),
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_key)
);

create table if not exists public.star_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  delta integer not null check (delta <> 0),
  event_type text not null check (event_type in ('mission_reward','quiz_reward','achievement_reward','purchase_debit','admin_adjustment','migration_adjustment')),
  event_key text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, event_key)
);

create view public.star_balances as
select user_id, coalesce(sum(delta), 0)::bigint as balance
from public.star_ledger
group by user_id;

create table if not exists public.cosmetic_catalog (
  item_key text primary key,
  slot text not null check (slot in ('suit','helmet','visor','hat','backpack','boots','gloves','cape','pet','badge','trail')),
  price_stars integer not null default 0 check (price_stars >= 0),
  is_active boolean not null default true
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_key text not null references public.cosmetic_catalog(item_key),
  price_stars integer not null check (price_stars >= 0),
  idempotency_key uuid not null,
  purchased_at timestamptz not null default now(),
  unique (user_id, idempotency_key)
);

create table if not exists public.inventory (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_key text not null references public.cosmetic_catalog(item_key),
  acquired_at timestamptz not null default now(),
  source text not null check (source in ('starter','purchase','reward','admin_grant','migration')),
  purchase_id uuid references public.purchases(id) on delete set null,
  primary key (user_id, item_key)
);

create table if not exists public.equipped_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  slot text not null check (slot in ('suit','helmet','visor','hat','backpack','boots','gloves','cape','pet','badge','trail')),
  item_key text not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, slot),
  foreign key (user_id, item_key) references public.inventory(user_id, item_key) on delete restrict
);

-- Optional school entities. Keep empty and unavailable until school approval.
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  created_at timestamptz not null default now()
);

create table if not exists public.school_memberships (
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  membership_role text not null check (membership_role in ('teacher','student')),
  status text not null default 'pending' check (status in ('pending','active','suspended')),
  created_at timestamptz not null default now(),
  primary key (school_id, user_id)
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  created_at timestamptz not null default now(),
  unique (school_id, name)
);

create table if not exists public.class_memberships (
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  membership_role text not null check (membership_role in ('teacher','student')),
  created_at timestamptz not null default now(),
  primary key (class_id, user_id)
);

-- Automatically create minimal profiles. Never copy client-supplied role metadata.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  insert into public.cadet_profiles (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_astronaut_jr on auth.users;
create trigger on_auth_user_created_astronaut_jr
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

-- Defense in depth: RLS on every table exposed in public schema.
alter table public.profiles enable row level security;
alter table public.cadet_profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.mission_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.achievement_catalog enable row level security;
alter table public.user_achievements enable row level security;
alter table public.star_ledger enable row level security;
alter table public.cosmetic_catalog enable row level security;
alter table public.purchases enable row level security;
alter table public.inventory enable row level security;
alter table public.equipped_items enable row level security;
alter table public.schools enable row level security;
alter table public.school_memberships enable row level security;
alter table public.classes enable row level security;
alter table public.class_memberships enable row level security;

-- Read policies only. No direct client write policies for authoritative state.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated using (id = (select auth.uid()));
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists cadet_profiles_select_own on public.cadet_profiles;
create policy cadet_profiles_select_own on public.cadet_profiles for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists cadet_profiles_update_own on public.cadet_profiles;
create policy cadet_profiles_update_own on public.cadet_profiles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists mission_progress_select_own on public.mission_progress;
create policy mission_progress_select_own on public.mission_progress for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists quiz_attempts_select_own on public.quiz_attempts;
create policy quiz_attempts_select_own on public.quiz_attempts for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists user_achievements_select_own on public.user_achievements;
create policy user_achievements_select_own on public.user_achievements for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists star_ledger_select_own on public.star_ledger;
create policy star_ledger_select_own on public.star_ledger for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists purchases_select_own on public.purchases;
create policy purchases_select_own on public.purchases for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists inventory_select_own on public.inventory;
create policy inventory_select_own on public.inventory for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists equipped_items_select_own on public.equipped_items;
create policy equipped_items_select_own on public.equipped_items for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists achievement_catalog_read on public.achievement_catalog;
create policy achievement_catalog_read on public.achievement_catalog for select to anon, authenticated using (is_active);
drop policy if exists cosmetic_catalog_read on public.cosmetic_catalog;
create policy cosmetic_catalog_read on public.cosmetic_catalog for select to anon, authenticated using (is_active);

-- Optional school tables deliberately have no client policies or grants.
-- Role assignments are deliberately private: no policy and no client grants.

-- Remove broad defaults first, then grant only the minimum required reads.
revoke all on all tables in schema public from anon, authenticated;
grant select on public.profiles, public.cadet_profiles, public.mission_progress,
  public.quiz_attempts, public.user_achievements, public.star_ledger,
  public.purchases, public.inventory, public.equipped_items
  to authenticated;
grant update (display_name, public_handle, leaderboard_opt_in) on public.profiles to authenticated;
grant update (call_sign, avatar_key, locale) on public.cadet_profiles to authenticated;
grant select on public.achievement_catalog, public.cosmetic_catalog to anon, authenticated;

-- No client write grants on progress, quiz attempts, roles, rewards, purchases,
-- inventory, equipped items, school records or catalogues.
-- The Edge Function's service-role client performs authorized server-side writes.
