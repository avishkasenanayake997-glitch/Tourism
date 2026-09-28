-- ==============================================================================
-- Lankora Microservice 2: Places, Destinations & Experiences Catalog Schema
-- Service: places-service (Port 8002)
-- ==============================================================================

-- 1. DESTINATIONS
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
  category text not null, -- 'Hill Country', 'Southern Coast', 'Cultural Triangle', 'Wildlife Safari', 'Eastern Coast', 'Northern Heritage'
  highlights text[] default '{}',
  vibe_tags text[] default '{}',
  rating numeric(2,1) default 4.8 not null,
  review_count integer default 0 not null,
  is_featured boolean default false,
  is_hidden_gem boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PLACES (Heritage, sights, viewpoints)
create table if not exists public.places (
  id uuid default uuid_generate_v4() primary key,
  destination_id uuid references public.destinations on delete cascade not null,
  name text not null,
  description text not null,
  location text not null,
  latitude double precision,
  longitude double precision,
  images text[] default '{}',
  category text not null, -- 'Heritage', 'Viewpoint', 'Nature', 'Sacred Site', 'Beach'
  opening_hours text default 'Open 24/7',
  entry_fee text default 'Free',
  tips text,
  rating numeric(2,1) default 4.8 not null,
  review_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. EXPERIENCES (Activities, safaris, surfing, cooking classes)
create table if not exists public.experiences (
  id uuid default uuid_generate_v4() primary key,
  destination_id uuid references public.destinations on delete cascade not null,
  title text not null,
  description text not null,
  category text not null, -- 'Adventure', 'Wildlife', 'Culture', 'Culinary', 'Wellness', 'Surfing'
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

-- 4. RESTAURANTS
create table if not exists public.restaurants (
  id uuid default uuid_generate_v4() primary key,
  destination_id uuid references public.destinations on delete cascade not null,
  name text not null,
  description text not null,
  cuisine text not null,
  price_range text not null, -- '$', '$$', '$$$'
  location text not null,
  latitude double precision,
  longitude double precision,
  must_try text[] default '{}',
  images text[] default '{}',
  rating numeric(2,1) default 4.7 not null,
  review_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. STAYS (Villas, resorts, eco-lodges)
create table if not exists public.stays (
  id uuid default uuid_generate_v4() primary key,
  destination_id uuid references public.destinations on delete cascade not null,
  name text not null,
  description text not null,
  type text not null, -- 'Eco-Lodge', 'Colonial Villa', 'Boutique Hotel', 'Beach Resort'
  price_range text not null,
  amenities text[] default '{}',
  images text[] default '{}',
  rating numeric(2,1) default 4.8 not null,
  review_count integer default 0 not null,
  location text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INDEXES
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

-- ROW LEVEL SECURITY
alter table public.destinations enable row level security;
alter table public.places enable row level security;
alter table public.experiences enable row level security;
alter table public.restaurants enable row level security;
alter table public.stays enable row level security;

create policy "Public destinations are viewable by everyone" on public.destinations for select using (true);
create policy "Public places are viewable by everyone" on public.places for select using (true);
create policy "Public experiences are viewable by everyone" on public.experiences for select using (true);
create policy "Public restaurants are viewable by everyone" on public.restaurants for select using (true);
create policy "Public stays are viewable by everyone" on public.stays for select using (true);
