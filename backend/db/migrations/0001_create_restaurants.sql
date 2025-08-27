-- Enable required extension for UUID generation (usually enabled by default on Supabase)
create extension if not exists "pgcrypto";

-- Table: public.restaurants
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text,
  state text,
  phone text,
  cuisine text,
  website text,
  rating numeric(2,1), -- e.g., 4.5
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.restaurants is 'Basic restaurant directory info';

-- Optional: indexes to speed common queries
create index if not exists restaurants_name_idx on public.restaurants using gin (to_tsvector('simple', coalesce(name, '')));
create index if not exists restaurants_city_idx on public.restaurants (city);
create index if not exists restaurants_cuisine_idx on public.restaurants (cuisine);

-- Enable RLS and provide permissive read policy (server uses service role key which bypasses RLS)
alter table public.restaurants enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where polname = 'read_restaurants_all' and tablename = 'restaurants'
  ) then
    create policy read_restaurants_all on public.restaurants
      for select to anon, authenticated
      using (true);
  end if;
end $$;

