-- ============================================================
-- Hua App — Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with app-specific profile data
create table if not exists public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  full_name    text not null default '',
  email        text not null default '',
  avatar_url   text,
  role         text not null default 'freelancer',
  location     text,
  phone        text,
  bio          text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── Goals ───────────────────────────────────────────────────────────────────
create table if not exists public.goals (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  title       text not null,
  description text not null default '',
  category    text not null default 'Business',
  priority    text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  status      text not null default 'active' check (status in ('active', 'completed', 'paused', 'archived')),
  color       text not null default '#FFA500',
  deadline    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Steps ───────────────────────────────────────────────────────────────────
create table if not exists public.steps (
  id           uuid primary key default uuid_generate_v4(),
  goal_id      uuid references public.goals(id) on delete cascade not null,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  title        text not null,
  is_completed boolean not null default false,
  order_index  integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.steps enable row level security;

-- Profiles: users can only read/write their own profile
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Goals: users can only read/write their own goals
create policy "goals_select_own" on public.goals for select using (auth.uid() = user_id);
create policy "goals_insert_own" on public.goals for insert with check (auth.uid() = user_id);
create policy "goals_update_own" on public.goals for update using (auth.uid() = user_id);
create policy "goals_delete_own" on public.goals for delete using (auth.uid() = user_id);

-- Steps: users can only read/write their own steps
create policy "steps_select_own" on public.steps for select using (auth.uid() = user_id);
create policy "steps_insert_own" on public.steps for insert with check (auth.uid() = user_id);
create policy "steps_update_own" on public.steps for update using (auth.uid() = user_id);
create policy "steps_delete_own" on public.steps for delete using (auth.uid() = user_id);

-- ─── Triggers: auto-update updated_at ────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger goals_updated_at before update on public.goals
  for each row execute procedure public.handle_updated_at();

create trigger steps_updated_at before update on public.steps
  for each row execute procedure public.handle_updated_at();

-- ─── Trigger: auto-create profile on sign up ─────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists goals_user_id_idx on public.goals(user_id);
create index if not exists goals_status_idx on public.goals(status);
create index if not exists steps_goal_id_idx on public.steps(goal_id);
create index if not exists steps_user_id_idx on public.steps(user_id);
create index if not exists steps_order_idx on public.steps(goal_id, order_index);
