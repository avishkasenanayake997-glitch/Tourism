-- ==============================================================================
-- Lankora Microservice 5: Trips & Itinerary Planner Schema
-- Service: itinerary-service (Port 8005)
-- ==============================================================================

-- 1. TRIPS
create table if not exists public.trips (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  title text not null,
  start_date date not null,
  end_date date not null,
  description text,
  cover_image text,
  destinations text[] default '{}',
  travel_style text default 'Discovery',
  status text default 'planning', -- 'planning', 'ongoing', 'completed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. ITINERARY ITEMS
create table if not exists public.itinerary_items (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips on delete cascade not null,
  target_type text not null, -- 'place', 'experience', 'restaurant', 'stay', 'custom'
  target_id text,
  title text not null,
  day_number integer not null default 1,
  date date,
  start_time text,
  end_time text,
  notes text,
  location text,
  order_index integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INDEXES
create index if not exists idx_trips_user on public.trips(user_id);
create index if not exists idx_itinerary_trip on public.itinerary_items(trip_id, day_number, order_index);

-- ROW LEVEL SECURITY
alter table public.trips enable row level security;
alter table public.itinerary_items enable row level security;

create policy "Users can view own trips" on public.trips 
  for select using (auth.uid() = user_id);
create policy "Users can insert own trips" on public.trips 
  for insert with check (auth.uid() = user_id);
create policy "Users can update own trips" on public.trips 
  for update using (auth.uid() = user_id);
create policy "Users can delete own trips" on public.trips 
  for delete using (auth.uid() = user_id);

create policy "Users can view own itinerary items" on public.itinerary_items 
  for select using (
    exists (select 1 from public.trips where trips.id = itinerary_items.trip_id and trips.user_id = auth.uid())
  );
create policy "Users can insert own itinerary items" on public.itinerary_items 
  for insert with check (
    exists (select 1 from public.trips where trips.id = itinerary_items.trip_id and trips.user_id = auth.uid())
  );
create policy "Users can update own itinerary items" on public.itinerary_items 
  for update using (
    exists (select 1 from public.trips where trips.id = itinerary_items.trip_id and trips.user_id = auth.uid())
  );
create policy "Users can delete own itinerary items" on public.itinerary_items 
  for delete using (
    exists (select 1 from public.trips where trips.id = itinerary_items.trip_id and trips.user_id = auth.uid())
  );
