-- Enable helpful extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- Helper function to keep updated_at in sync
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $function$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$function$;

create table public.admin_profile (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email citext not null unique,
  role text not null default 'owner',
  last_login_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

-- Helper to check if the current auth.uid() belongs to the admin profile
create or replace function public.is_gallery_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $function$
declare
  _uid uuid := auth.uid();
begin
  if _uid is null then
    return false;
  end if;

  return exists (
    select 1
    from public.admin_profile ap
    where ap.user_id = _uid
  );
end;
$function$;

create table public.friends (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  nickname text,
  main_photo text,
  description text,
  letter_content text,
  access_key_hash text not null,
  gallery_photos text[] not null default array[]::text[],
  theme_config jsonb not null default jsonb_build_object(
    'primary', '#FF6B6B',
    'secondary', '#4ECDC4',
    'font', 'Inter'
  ),
  is_published boolean not null default true,
  order_index integer not null default 999,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger friends_set_updated_at
before update on public.friends
for each row
execute procedure public.touch_updated_at();

create table public.uploads (
  id uuid primary key default gen_random_uuid(),
  friend_id uuid references public.friends(id) on delete set null,
  storage_path text not null unique,
  file_name text not null,
  mime_type text,
  size_bytes integer,
  width integer,
  height integer,
  checksum text,
  uploaded_by uuid references public.admin_profile(user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.access_logs (
  id uuid primary key default gen_random_uuid(),
  friend_id uuid not null references public.friends(id) on delete cascade,
  accessed_at timestamptz not null default timezone('utc', now()),
  ip_address inet,
  user_agent text,
  success boolean not null default false,
  failure_reason text
);

create table public.rate_limits (
  ip inet primary key,
  attempts integer not null default 0,
  last_attempt timestamptz not null default timezone('utc', now()),
  blocked_until timestamptz
);

create index access_logs_friend_idx on public.access_logs(friend_id, accessed_at desc);
create index uploads_friend_idx on public.uploads(friend_id);
create index friends_order_idx on public.friends(order_index, created_at desc);

alter table public.admin_profile enable row level security;
alter table public.friends enable row level security;
alter table public.uploads enable row level security;
alter table public.access_logs enable row level security;
alter table public.rate_limits enable row level security;

create policy "Admins manage profile"
on public.admin_profile
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Admins full access"
on public.friends
for all
using (public.is_gallery_admin())
with check (public.is_gallery_admin());

create policy "Admins manage uploads"
on public.uploads
for all
using (public.is_gallery_admin())
with check (public.is_gallery_admin());

create policy "Admins read access logs"
on public.access_logs
for select
using (public.is_gallery_admin());

create policy "Admins insert access logs"
on public.access_logs
for insert
with check (public.is_gallery_admin());

create policy "Service role manages rate limits"
on public.rate_limits
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

