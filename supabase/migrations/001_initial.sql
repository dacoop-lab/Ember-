create extension if not exists "uuid-ossp";

create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  bio text,
  age integer check (age >= 18 and age <= 99),
  city text,
  identity text check (identity in ('redhead', 'admirer')),
  gender text check (gender in ('man', 'woman', 'nonbinary', 'other')),
  seeking text[],
  age_min integer default 18,
  age_max integer default 60,
  subscription_status text default 'active',
  onboarding_complete boolean default false,
  created_at timestamptz default now()
);

create table photos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  storage_path text not null,
  display_order integer default 0,
  created_at timestamptz default now()
);

create table swipes (
  id uuid default uuid_generate_v4() primary key,
  swiper_id uuid references profiles(id) on delete cascade,
  swiped_id uuid references profiles(id) on delete cascade,
  direction text check (direction in ('like', 'pass')),
  created_at timestamptz default now(),
  unique(swiper_id, swiped_id)
);

create table matches (
  id uuid default uuid_generate_v4() primary key,
  user_a uuid references profiles(id) on delete cascade,
  user_b uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_a, user_b)
);

create table messages (
  id uuid default uuid_generate_v4() primary key,
  match_id uuid references matches(id) on delete cascade,
  sender_id uuid references profiles(id) on delete cascade,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table photos enable row level security;
alter table swipes enable row level security;
alter table matches enable row level security;
alter table messages enable row level security;

create policy "profiles: own read/write" on profiles for all using (auth.uid() = id);
create policy "photos: own read/write" on photos for all using (auth.uid() = user_id);
create policy "swipes: own read/write" on swipes for all using (auth.uid() = swiper_id);
create policy "matches: participant access" on matches for select using (auth.uid() = user_a or auth.uid() = user_b);
create policy "messages: participant access" on messages for all using (
  exists (select 1 from matches where id = match_id and (user_a = auth.uid() or user_b = auth.uid()))
);
create policy "profiles: public discovery read" on profiles for select using (onboarding_complete = true);
create policy "photos: public read" on photos for select using (true);
