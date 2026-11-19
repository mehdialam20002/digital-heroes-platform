-- ====================================================================
-- DIGITAL HEROES WEB-TO-PRINT PLATFORM — SUPABASE DATABASE SCHEMA
-- ====================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
do $$ begin
  create type order_status as enum ('quote', 'order', 'artwork', 'proof', 'production', 'completed');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type proof_status as enum ('pending', 'approved', 'changes_requested');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type user_role as enum ('customer', 'admin');
exception
  when duplicate_object then null;
end $$;

-- 3. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role user_role default 'customer'::user_role,
  company text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ORDERS TABLE
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  customer_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_company text,
  status order_status default 'order'::order_status not null,
  subtotal numeric(10,2) not null default 0.00,
  vat_amount numeric(10,2) not null default 0.00,
  total numeric(10,2) not null default 0.00,
  shipping_address jsonb default '{}'::jsonb,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ORDER ITEMS TABLE
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  division_slug text not null,
  product_name text not null,
  configuration jsonb not null,
  pricing jsonb not null,
  design_state jsonb,
  uploaded_file_url text,
  current_proof_version integer default 1 not null,
  is_proof_approved boolean default false not null,
  production_files_unlocked boolean default false not null,
  csv_merge_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. PROOFS TABLE
create table if not exists public.proofs (
  id uuid default gen_random_uuid() primary key,
  order_item_id uuid references public.order_items(id) on delete cascade not null,
  version integer not null default 1,
  preview_url text not null,
  status proof_status default 'pending'::proof_status not null,
  feedback_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  approved_at timestamp with time zone
);

-- 7. PRODUCTION FILES TABLE
create table if not exists public.production_files (
  id uuid default gen_random_uuid() primary key,
  order_item_id uuid references public.order_items(id) on delete cascade not null,
  file_type text not null, -- 'pdf' | 'png' | 'zip'
  file_url text not null,
  filename text not null,
  is_unlocked boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. CSV MERGE JOBS TABLE
create table if not exists public.csv_merge_jobs (
  id uuid default gen_random_uuid() primary key,
  order_item_id uuid references public.order_items(id) on delete cascade not null,
  csv_url text,
  total_rows integer default 0,
  processed_rows integer default 0,
  status text default 'pending',
  output_zip_url text,
  output_pdf_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.proofs enable row level security;
alter table public.production_files enable row level security;
alter table public.csv_merge_jobs enable row level security;

-- Profiles: Users can view their own profile; Admins can view all
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Orders: Customers see their own; Admins see all
create policy "Customers view own orders"
  on public.orders for select
  using (customer_id = auth.uid() or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Admins can update orders"
  on public.orders for update
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Authenticated users can insert orders"
  on public.orders for insert
  with check (auth.role() = 'authenticated' or auth.role() = 'anon');

-- Order Items: Viewable if order is viewable
create policy "View order items"
  on public.order_items for select
  using (exists (
    select 1 from public.orders where orders.id = order_items.order_id and (
      orders.customer_id = auth.uid() or exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
      )
    )
  ));

create policy "Insert order items"
  on public.order_items for insert
  with check (true);

create policy "Update order items"
  on public.order_items for update
  using (true);

-- Proofs: Public/authenticated access as per order
create policy "Allow access to proofs"
  on public.proofs for all
  using (true) with check (true);

-- Production Files: Strictly unlock when is_unlocked is true or user is admin
create policy "Production files access"
  on public.production_files for select
  using (is_unlocked = true or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- 10. STORAGE BUCKETS (Run in Storage SQL or Create via Dashboard)
insert into storage.buckets (id, name, public) 
values ('customer-uploads', 'customer-uploads', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('proof-previews', 'proof-previews', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('production-files', 'production-files', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public view customer uploads" on storage.objects for select using (bucket_id in ('customer-uploads', 'proof-previews', 'production-files'));
create policy "Public insert customer uploads" on storage.objects for insert with check (bucket_id in ('customer-uploads', 'proof-previews', 'production-files'));
create policy "Public update customer uploads" on storage.objects for update using (bucket_id in ('customer-uploads', 'proof-previews', 'production-files'));
