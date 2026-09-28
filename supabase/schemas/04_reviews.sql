-- ==============================================================================
-- Lankora Microservice 4: Reviews, Ratings & Favorites Schema
-- Service: review-service (Port 8004)
-- ==============================================================================

-- 1. REVIEWS
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  target_type text not null, -- 'destination', 'place', 'experience', 'restaurant', 'stay'
  target_id uuid not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text not null,
  images text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. FAVORITES
create table if not exists public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  target_type text not null, -- 'destination', 'place', 'experience', 'restaurant', 'stay'
  target_id uuid not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_favorite unique (user_id, target_type, target_id)
);

-- INDEXES
create index if not exists idx_favorites_user on public.favorites(user_id);
create index if not exists idx_reviews_target on public.reviews(target_type, target_id);
create index if not exists idx_reviews_user on public.reviews(user_id);

-- ROW LEVEL SECURITY
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;

-- Review policies
create policy "Reviews are viewable by everyone" on public.reviews 
  for select using (true);
create policy "Users can insert reviews" on public.reviews 
  for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews" on public.reviews 
  for update using (auth.uid() = user_id);
create policy "Users can delete own reviews" on public.reviews 
  for delete using (auth.uid() = user_id);

-- Favorite policies
create policy "Users can view own favorites" on public.favorites 
  for select using (auth.uid() = user_id);
create policy "Users can insert own favorites" on public.favorites 
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own favorites" on public.favorites 
  for delete using (auth.uid() = user_id);
