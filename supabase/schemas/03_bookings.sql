-- ==============================================================================
-- Lankora Microservice 3: Bookings & Reservations Schema
-- Service: booking-service (Port 8003)
-- ==============================================================================

-- BOOKINGS: Handles reservations for stays, tours, experiences, and dining
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

-- INDEXES
create index if not exists idx_bookings_user on public.bookings(user_id);
create index if not exists idx_bookings_target on public.bookings(target_type, target_id);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_date on public.bookings(booking_date);

-- ROW LEVEL SECURITY
alter table public.bookings enable row level security;

create policy "Users can view own bookings" on public.bookings 
  for select using (auth.uid() = user_id);

create policy "Users can create bookings" on public.bookings 
  for insert with check (auth.uid() = user_id);

create policy "Users can update own bookings" on public.bookings 
  for update using (auth.uid() = user_id);

create policy "Users can cancel own bookings" on public.bookings 
  for delete using (auth.uid() = user_id);
