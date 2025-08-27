-- migrations/20230827000000_create_restaurants.sql

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create restaurants table
create table if not exists public.restaurants (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    address text,
    city text,
    state text,
    phone text,
    cuisine text,
    website text,
    rating numeric(2,1) check (rating >= 0 and rating <= 5),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Useful indexes
create index if not exists idx_restaurants_city on public.restaurants (city);
create index if not exists idx_restaurants_cuisine on public.restaurants (cuisine);

-- Ensure updated_at auto-updates
create or replace function update_updated_at_column()
returns trigger as $$
begin
   new.updated_at = now();
   return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.restaurants;

create trigger set_updated_at
before update on public.restaurants
for each row
execute function update_updated_at_column();

