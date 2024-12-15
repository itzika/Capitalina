-- Create extension for UUID generation if not exists
create extension if not exists "uuid-ossp";

-- Create tables first
create table if not exists user_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null unique,
  balance numeric default 100000,
  daily_pnl numeric default 0,
  total_pnl numeric default 0,
  win_rate numeric default 0,
  rank integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists positions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  instrument_id text not null,
  instrument_type text not null,
  quantity numeric not null,
  entry_price numeric not null,
  current_price numeric not null,
  unrealized_pnl numeric not null default 0,
  open_time timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS after tables are created
alter table user_profiles enable row level security;
alter table positions enable row level security;

-- Create RLS policies
do $$ begin
  if not exists (
    select 1 from pg_policies 
    where tablename = 'user_profiles' 
    and policyname = 'Users can view their own profiles'
  ) then
    create policy "Users can view their own profiles"
  on user_profiles for select
  using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies 
    where tablename = 'user_profiles' 
    and policyname = 'Users can update their own profiles'
  ) then
    create policy "Users can update their own profiles"
  on user_profiles for update
  using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies 
    where tablename = 'user_profiles' 
    and policyname = 'Enable insert for authenticated users only'
  ) then
    create policy "Enable insert for authenticated users only"
  on user_profiles for insert
  with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies 
    where tablename = 'positions' 
    and policyname = 'Users can view their own positions'
  ) then
    create policy "Users can view their own positions"
  on positions for select
  using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies 
    where tablename = 'positions' 
    and policyname = 'Users can insert their own positions'
  ) then
    create policy "Users can insert their own positions"
  on positions for insert
  with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies 
    where tablename = 'positions' 
    and policyname = 'Users can update their own positions'
  ) then
    create policy "Users can update their own positions"
  on positions for update
  using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies 
    where tablename = 'positions' 
    and policyname = 'Users can delete their own positions'
  ) then
    create policy "Users can delete their own positions"
  on positions for delete
  using (auth.uid() = user_id);
  end if;
end $$;

-- Create close_position function
create or replace function close_position(
  p_position_id uuid,
  p_realized_pnl numeric,
  p_position_value numeric
) returns void
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_current_balance numeric;
  v_current_pnl numeric;
begin
  -- Get user_id from position
  select user_id into v_user_id
  from positions
  where id = p_position_id;

  if not found then
    raise exception 'Position not found';
  end if;

  -- Get current balance and PnL
  select balance, total_pnl 
  into v_current_balance, v_current_pnl
  from user_profiles
  where user_id = v_user_id;

  -- Update profile
  update user_profiles
  set 
    balance = v_current_balance + p_position_value,
    total_pnl = v_current_pnl + p_realized_pnl,
    daily_pnl = daily_pnl + p_realized_pnl
  where user_id = v_user_id;

  -- Delete position
  delete from positions
  where id = p_position_id;
end;
$$;