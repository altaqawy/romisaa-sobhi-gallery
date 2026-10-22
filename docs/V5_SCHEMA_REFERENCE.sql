-- V5 DATABASE REFERENCE ONLY (NOT RUN). Target: PostgreSQL in Supabase.
-- Apply in protected staging first; never paste service-role credentials in a browser.
create extension if not exists pgcrypto;

create schema if not exists shop;
create type shop.order_state as enum ('draft','price_confirmed','awaiting_payment','paid','in_production','ready_to_ship','shipped','delivered','cancelled','refunded');
create type shop.design_state as enum ('proposed','changes_requested','approved','superseded');

create table shop.products (
 id uuid primary key default gen_random_uuid(),
 slug text unique not null,
 title text not null,
 description text,
 category text not null,
 price_egp numeric(12,2) check (price_egp >= 0),
 image_url text,
 is_active boolean not null default false,
 created_at timestamptz not null default now()
);
create table shop.customer_profiles(
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '',
 phone text,
 created_at timestamptz not null default now()
);
create table shop.staff_members(
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
-- Role assignment through secure server/admin DB connection ONLY.
create function shop.is_staff() returns boolean language sql stable security definer
set search_path = shop, pg_temp as $$
  select exists(select 1 from shop.staff_members where user_id = (select auth.uid()))
$$;
revoke all on function shop.is_staff() from public;
grant execute on function shop.is_staff() to authenticated;

create table shop.custom_requests(
 id uuid primary key default gen_random_uuid(),
 customer_id uuid not null references auth.users(id),
 product_type text not null,
 color_note text,
 requested_date date,
 brief text not null,
 state text not null default 'submitted'
    check(state in ('submitted','reviewing','quoted','closed')),
 created_at timestamptz not null default now()
);
create table shop.orders(
 id uuid primary key default gen_random_uuid(),
 customer_id uuid not null references auth.users(id),
 state shop.order_state not null default 'draft',
 currency char(3) not null default 'EGP',
 confirmed_total_egp numeric(12,2) check(confirmed_total_egp >= 0),
 shipping_egp numeric(12,2) check(shipping_egp >= 0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table shop.order_lines(
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references shop.orders(id) on delete cascade,
 product_id uuid references shop.products(id),
 quantity int not null check(quantity between 1 and 99),
 locked_unit_price_egp numeric(12,2) not null check(locked_unit_price_egp >= 0),
 title_snapshot text not null,
 personalization_note text
);
create table shop.design_versions(
 id uuid primary key default gen_random_uuid(),
 request_id uuid not null references shop.custom_requests(id),
 version_number int not null check(version_number > 0),
 private_asset_key text not null,
 state shop.design_state not null default 'proposed',
 created_at timestamptz not null default now(),
 unique(request_id,version_number)
);
create table shop.design_decisions(
 id uuid primary key default gen_random_uuid(),
 design_version_id uuid not null references shop.design_versions(id),
 customer_id uuid not null references auth.users(id),
 decision text not null check(decision in ('approved','changes_requested')),
 comment text,
 decided_at timestamptz not null default now(),
 unique(design_version_id,customer_id)
);
create table shop.payment_attempts(
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references shop.orders(id),
 provider text not null,
 provider_reference text unique,
 state text not null default 'created' check(state in ('created','pending','succeeded','failed','refunded')),
 amount_egp numeric(12,2) not null check(amount_egp>=0),
 created_at timestamptz not null default now()
);
create table shop.academy_lessons(
 id uuid primary key default gen_random_uuid(),
 slug text not null unique,
 title text not null,
 public_preview boolean not null default false,
 position int not null default 0,
 media_storage_key text,
 is_published boolean not null default false
);
create table shop.academy_enrollments(
 user_id uuid not null references auth.users(id),
 lesson_id uuid not null references shop.academy_lessons(id),
 completed_at timestamptz,
 primary key(user_id, lesson_id)
);

-- Default-deny every table.
alter table shop.products enable row level security;
alter table shop.customer_profiles enable row level security;
alter table shop.staff_members enable row level security;
alter table shop.custom_requests enable row level security;
alter table shop.orders enable row level security;
alter table shop.order_lines enable row level security;
alter table shop.design_versions enable row level security;
alter table shop.design_decisions enable row level security;
alter table shop.payment_attempts enable row level security;
alter table shop.academy_lessons enable row level security;
alter table shop.academy_enrollments enable row level security;

create policy "read active products" on shop.products for select to anon,authenticated using (is_active and price_egp is not null);
create policy "staff product access" on shop.products for all to authenticated using (shop.is_staff()) with check (shop.is_staff());
create policy "read own profile" on shop.customer_profiles for select to authenticated using (id = (select auth.uid()));
create policy "update own profile" on shop.customer_profiles for update to authenticated using (id = (select auth.uid())) with check(id=(select auth.uid()));
create policy "create own profile" on shop.customer_profiles for insert to authenticated with check(id=(select auth.uid()));
create policy "read own requests" on shop.custom_requests for select to authenticated using(customer_id=(select auth.uid()) or shop.is_staff());
create policy "submit own request" on shop.custom_requests for insert to authenticated with check(customer_id=(select auth.uid()) and state='submitted');
create policy "read own orders" on shop.orders for select to authenticated using(customer_id=(select auth.uid()) or shop.is_staff());
create policy "read own order lines" on shop.order_lines for select to authenticated using(exists(select 1 from shop.orders o where o.id=order_id and (o.customer_id=(select auth.uid()) or shop.is_staff())));
create policy "read own design versions" on shop.design_versions for select to authenticated using(exists(select 1 from shop.custom_requests r where r.id=request_id and (r.customer_id=(select auth.uid()) or shop.is_staff())));
create policy "read own design decisions" on shop.design_decisions for select to authenticated using(customer_id=(select auth.uid()) or shop.is_staff());
create policy "read own payment attempts" on shop.payment_attempts for select to authenticated using(exists(select 1 from shop.orders o where o.id=order_id and (o.customer_id=(select auth.uid()) or shop.is_staff())));
create policy "public lesson previews" on shop.academy_lessons for select to anon,authenticated using(is_published and public_preview);
create policy "read own enrollment" on shop.academy_enrollments for select to authenticated using(user_id=(select auth.uid()));

-- No client policy for creating orders, recording payments, writing designs or approvals,
-- publishing lessons, or creating staff entries: those actions MUST be server-only,
-- authorized and validated, with transaction boundaries and webhook verification.


-- Example permissions for a dedicated non-public shop schema. Review in staging.
grant usage on schema shop to anon,authenticated;
grant select on shop.products,shop.academy_lessons to anon,authenticated;
grant select on shop.customer_profiles,shop.custom_requests,shop.orders,
 shop.order_lines,shop.design_versions,shop.design_decisions,
 shop.payment_attempts,shop.academy_enrollments to authenticated;
grant insert,update on shop.customer_profiles to authenticated;
grant insert on shop.custom_requests to authenticated;
-- Staff write operations and all payment/order/design mutations are performed
-- through server-side role-authorized endpoints using controlled DB privileges.

create index if not exists idx_custom_requests_customer on shop.custom_requests(customer_id,created_at desc);
create index if not exists idx_orders_customer on shop.orders(customer_id,created_at desc);
create index if not exists idx_order_lines_order on shop.order_lines(order_id);
create index if not exists idx_design_versions_request on shop.design_versions(request_id,version_number desc);
create index if not exists idx_payment_attempts_order on shop.payment_attempts(order_id);
