-- == SAFETY: core tables (create if missing; augment if partial) ==
create extension if not exists pgcrypto;

create table if not exists public.tcs_balances (
  wallet_id text primary key,
  kwh numeric not null default 0,
  updated_at timestamptz default now()
);

create table if not exists public.tcs_ledger (
  id bigserial primary key,
  wallet_id text not null,
  delta_kwh numeric not null,
  memo text,
  kind text default 'transfer',
  created_at timestamptz default now()
);

create table if not exists public.tcs_items (
  id uuid primary key default gen_random_uuid(),
  owner_wallet text not null,
  title text not null,
  description text,
  image_url text,
  price_kwh numeric not null default 0,
  theme text,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists public.tcs_orders (
  id bigserial primary key,
  buyer_wallet text not null,
  seller_wallet text not null,
  item_id uuid not null references public.tcs_items(id) on delete cascade,
  amount_kwh numeric not null,
  status text default 'settled',
  created_at timestamptz default now()
);

-- Ensure required columns exist (if previous partial schemas)
alter table public.tcs_items
  add column if not exists owner_wallet text,
  add column if not exists price_kwh numeric not null default 0,
  add column if not exists status text default 'active';

-- == INDEXES ==
create index if not exists idx_items_status_created   on public.tcs_items (status, created_at desc);
create index if not exists idx_ledger_wallet_created  on public.tcs_ledger (wallet_id, created_at desc);
create index if not exists idx_orders_buyer_created   on public.tcs_orders (buyer_wallet, created_at desc);
create index if not exists idx_orders_seller_created  on public.tcs_orders (seller_wallet, created_at desc);

-- == RLS ==
alter table public.tcs_items    enable row level security;
alter table public.tcs_orders   enable row level security;
alter table public.tcs_ledger   enable row level security;
alter table public.tcs_balances enable row level security;

-- public read for active items (drop/recreate to avoid duplicates)
drop policy if exists tcs_items_read_active on public.tcs_items;
create policy tcs_items_read_active
on public.tcs_items for select
to anon
using (coalesce(status,'active') = 'active');

-- lock down anon writes (service role bypasses RLS)
revoke all on public.tcs_items  from anon;
revoke all on public.tcs_orders from anon;
revoke all on public.tcs_ledger from anon;
revoke all on public.tcs_balances from anon;

-- == HELPERS ==
create or replace function public.ensure_balance(p_wallet text)
returns void language plpgsql as $$
begin
  insert into public.tcs_balances(wallet_id, kwh)
  values (p_wallet, 0)
  on conflict (wallet_id) do nothing;
end $$;

create or replace function public.apply_transfer(
  p_from text, p_to text, p_kwh numeric, p_memo text,
  p_kind text default 'transfer'
) returns void language plpgsql security definer as $$
begin
  if p_kwh <= 0 then
    raise exception 'kWh must be positive';
  end if;

  if p_from is not null then
    perform ensure_balance(p_from);
    update public.tcs_balances set kwh = kwh - p_kwh where wallet_id = p_from;
    insert into public.tcs_ledger(wallet_id, delta_kwh, memo, kind)
      values (p_from, -p_kwh, coalesce(p_memo,'transfer'), p_kind);
  end if;

  if p_to is not null then
    perform ensure_balance(p_to);
    update public.tcs_balances set kwh = kwh + p_kwh where wallet_id = p_to;
    insert into public.tcs_ledger(wallet_id, delta_kwh, memo, kind)
      values (p_to,  p_kwh, coalesce(p_memo,'transfer'), p_kind);
  end if;

  if exists(select 1 from public.tcs_balances where kwh < 0) then
    raise exception 'insufficient funds';
  end if;
end $$;

-- 1 Solar = 4913 kWh
create or replace function public.grant_daily_gbi(p_wallet text, p_kwh numeric default 4913)
returns boolean language plpgsql security definer as $$
declare already boolean;
begin
  perform ensure_balance(p_wallet);
  select exists(
    select 1 from public.tcs_ledger
     where wallet_id = p_wallet
       and kind = 'gbi'
       and created_at::date = (now() at time zone 'utc')::date
  ) into already;

  if already then
    return false;
  end if;

  perform apply_transfer(null, p_wallet, p_kwh, 'Daily 1 Solar grant', 'gbi');
  return true;
end $$;

-- == SYSTEM WALLET DEFAULTS ==
create table if not exists public.tcs_settings (
  key text primary key,
  val text
);

-- upsert system wallets (these are plain text identifiers, not secrets)
insert into public.tcs_settings(key, val) values
  ('system_seed_wallet', 'tcs_seed_wallet'),
  ('system_foundation_wallet', 'tcs_foundation_wallet')
on conflict (key) do nothing;

-- ensure balances exist for system wallets
select public.ensure_balance('tcs_seed_wallet');
select public.ensure_balance('tcs_foundation_wallet');
