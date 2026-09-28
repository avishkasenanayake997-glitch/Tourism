-- ==============================================================================
-- Lankora: Sri Lankan Tourism Platform - Unified Microservices PostgreSQL Schema
-- ==============================================================================
-- This master schema unifies the domain-isolated microservices schemas:
-- 1. supabase/schemas/01_auth.sql          (Auth & User Profiles - Port 8001)
-- 2. supabase/schemas/02_places_catalog.sql (Places & Destinations - Port 8002)
-- 3. supabase/schemas/03_bookings.sql       (Bookings & Reservations - Port 8003)
-- 4. supabase/schemas/04_reviews.sql        (Reviews & Favorites - Port 8004)
-- 5. supabase/schemas/05_itineraries.sql    (Trips & AI Itinerary Planner - Port 8005)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. AUTH & PROFILES MICROSERVICE
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  avatar text,
  bio text default 'Exploring the serendipitous wonders of Sri Lanka.',
  travel_preferences jsonb default '{"travel_style": ["Culture", "Nature"], "pace": "Moderate", "dietary": []}'::jsonb,
  home_country text default 'Traveler',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 2. PLACES CATALOG MICROSERVICE (Destinations, Places, Experiences, Dining, Stays)
-- ------------------------------------------------------------------------------
create table if not exists public.destinations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  short_description text not null,
  description text not null,
  province text not null,
  district text not null,
  latitude double precision not null,
  longitude double precision not null,
  hero_image text not null,
  gallery text[] default '{}',
  best_time_to_visit text not null,
  estimated_budget text not null,
  category text not null,
  highlights text[] default '{}',
  vibe_tags text[] default '{}',
  rating numeric(2,1) default 4.8 not null,
  review_count integer default 0 not null,
  is_featured boolean default false,
  is_hidden_gem boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.places (
  id uuid default uuid_generate_v4() primary key,
  destination_id uuid references public.destinations on delete cascade not null,
  name text not null,
  description text not null,
  location text not null,
  latitude double precision,
  longitude double precision,
  images text[] default '{}',
  category text not null,
  opening_hours text default 'Open 24/7',
  entry_fee text default 'Free',
  tips text,
  rating numeric(2,1) default 4.8 not null,
  review_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.experiences (
  id uuid default uuid_generate_v4() primary key,
  destination_id uuid references public.destinations on delete cascade not null,
  title text not null,
  description text not null,
  category text not null,
  duration text not null,
  price text not null,
  images text[] default '{}',
  location text not null,
  host_name text,
  inclusions text[] default '{}',
  rating numeric(2,1) default 4.9 not null,
  review_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.restaurants (
  id uuid default uuid_generate_v4() primary key,
  destination_id uuid references public.destinations on delete cascade not null,
  name text not null,
  description text not null,
  cuisine text not null,
  price_range text not null,
  location text not null,
  latitude double precision,
  longitude double precision,
  must_try text[] default '{}',
  images text[] default '{}',
  rating numeric(2,1) default 4.7 not null,
  review_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.stays (
  id uuid default uuid_generate_v4() primary key,
  destination_id uuid references public.destinations on delete cascade not null,
  name text not null,
  description text not null,
  type text not null,
  price_range text not null,
  amenities text[] default '{}',
  images text[] default '{}',
  rating numeric(2,1) default 4.8 not null,
  review_count integer default 0 not null,
  location text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 3. BOOKINGS & RESERVATIONS MICROSERVICE
-- ------------------------------------------------------------------------------
create table if not exists public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  target_type text not null check (target_type in ('stay', 'experience', 'restaurant', 'tour')),
  target_id text not null,
  title text not null,
  booking_date date not null,
  end_date date,
  time_slot text,
  guests integer default 1 not null,
  total_price numeric(10,2) not null default 0.00,
  currency text default 'USD' not null,
  status text default 'confirmed' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status text default 'paid' check (payment_status in ('pending', 'paid', 'refunded', 'failed')),
  special_requests text,
  contact_phone text,
  contact_email text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 4. REVIEWS & SOCIAL MICROSERVICE
-- ------------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  target_type text not null,
  target_id uuid not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text not null,
  images text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  target_type text not null,
  target_id uuid not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_favorite unique (user_id, target_type, target_id)
);

-- ------------------------------------------------------------------------------
-- 5. TRIPS & ITINERARY PLANNER MICROSERVICE
-- ------------------------------------------------------------------------------
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
  status text default 'planning',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.itinerary_items (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips on delete cascade not null,
  target_type text not null,
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

-- ------------------------------------------------------------------------------
-- PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
create index if not exists idx_destinations_slug on public.destinations(slug);
create index if not exists idx_destinations_category on public.destinations(category);
create index if not exists idx_destinations_province on public.destinations(province);
create index if not exists idx_destinations_featured on public.destinations(is_featured);

create index if not exists idx_places_destination on public.places(destination_id);
create index if not exists idx_places_category on public.places(category);

create index if not exists idx_experiences_destination on public.experiences(destination_id);
create index if not exists idx_experiences_category on public.experiences(category);

create index if not exists idx_restaurants_destination on public.restaurants(destination_id);
create index if not exists idx_stays_destination on public.stays(destination_id);

create index if not exists idx_bookings_user on public.bookings(user_id);
create index if not exists idx_bookings_status on public.bookings(status);

create index if not exists idx_favorites_user on public.favorites(user_id);
create index if not exists idx_reviews_target on public.reviews(target_type, target_id);
create index if not exists idx_trips_user on public.trips(user_id);
create index if not exists idx_itinerary_trip on public.itinerary_items(trip_id, day_number, order_index);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.places enable row level security;
alter table public.experiences enable row level security;
alter table public.restaurants enable row level security;
alter table public.stays enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.trips enable row level security;
alter table public.itinerary_items enable row level security;

-- Public content readable by anyone
create policy "Public destinations are viewable by everyone" on public.destinations for select using (true);
create policy "Public places are viewable by everyone" on public.places for select using (true);
create policy "Public experiences are viewable by everyone" on public.experiences for select using (true);
create policy "Public restaurants are viewable by everyone" on public.restaurants for select using (true);
create policy "Public stays are viewable by everyone" on public.stays for select using (true);

-- User scoped policies
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own bookings" on public.bookings for select using (auth.uid() = user_id);
create policy "Users can create bookings" on public.bookings for insert with check (auth.uid() = user_id);
create policy "Users can update own bookings" on public.bookings for update using (auth.uid() = user_id);
create policy "Users can cancel own bookings" on public.bookings for delete using (auth.uid() = user_id);

create policy "Users can view own favorites" on public.favorites for select using (auth.uid() = user_id);
create policy "Users can insert own favorites" on public.favorites for insert with check (auth.uid() = user_id);
create policy "Users can delete own favorites" on public.favorites for delete using (auth.uid() = user_id);

create policy "Users can view own trips" on public.trips for select using (auth.uid() = user_id);
create policy "Users can insert own trips" on public.trips for insert with check (auth.uid() = user_id);
create policy "Users can update own trips" on public.trips for update using (auth.uid() = user_id);
create policy "Users can delete own trips" on public.trips for delete using (auth.uid() = user_id);

create policy "Users can view own itinerary items" on public.itinerary_items for select using (
  exists (select 1 from public.trips where trips.id = itinerary_items.trip_id and trips.user_id = auth.uid())
);
create policy "Users can insert own itinerary items" on public.itinerary_items for insert with check (
  exists (select 1 from public.trips where trips.id = itinerary_items.trip_id and trips.user_id = auth.uid())
);
create policy "Users can update own itinerary items" on public.itinerary_items for update using (
  exists (select 1 from public.trips where trips.id = itinerary_items.trip_id and trips.user_id = auth.uid())
);
create policy "Users can delete own itinerary items" on public.itinerary_items for delete using (
  exists (select 1 from public.trips where trips.id = itinerary_items.trip_id and trips.user_id = auth.uid())
);

create policy "Reviews are viewable by everyone" on public.reviews for select using (true);
create policy "Users can insert reviews" on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews" on public.reviews for update using (auth.uid() = user_id);
create policy "Users can delete own reviews" on public.reviews for delete using (auth.uid() = user_id);

-- Trigger for new user auto-profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'name', 'Lankora Explorer'), 
    new.email, 
    coalesce(new.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
