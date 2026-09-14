-- ============================================================
-- Fahad Almishan — Database schema + Row Level Security
-- Run this once in the Supabase SQL editor for a new project.
-- ============================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------
-- SERVICES
-- One row per service item shown on /services and inside categories.
-- ----------------------------------------------------------------
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null,          -- e.g. 'ai', 'photo', 'design', 'video', 'audio', 'web', 'data', 'shopping', 'travel', 'consulting', 'content'
  title_ar text not null,
  title_en text not null,
  description_ar text not null default '',
  description_en text not null default '',
  icon text not null default 'sparkles',   -- lucide-react icon name
  features_ar jsonb not null default '[]'::jsonb, -- ["صناعة محتوى نصي وصوري", ...]
  features_en jsonb not null default '[]'::jsonb,
  price_min numeric,
  price_max numeric,
  price_note text not null default '',   -- e.g. 'حسب حجم المشروع', 'لكل صورة', 'شهريًا'
  show_price boolean not null default true, -- admin can hide and show "تواصل للسعر" instead
  order_index int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- PROJECTS  (Portfolio)
-- ----------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_ar text not null,
  title_en text not null,
  description_ar text not null default '',
  description_en text not null default '',
  category text not null,          -- matches services.category, plus 'other'
  media jsonb not null default '[]'::jsonb,        -- [{type:'image'|'video', url, thumbnail_url}]
  before_after jsonb not null default '[]'::jsonb, -- [{before_url, after_url}]
  links jsonb not null default '[]'::jsonb,        -- [{label, url}]
  featured boolean not null default false,
  visible boolean not null default true,
  order_index int not null default 0,
  execution_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- REQUESTS  (Service request form submissions)
-- ----------------------------------------------------------------
create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  service text not null,
  description text not null,
  budget text,
  deadline date,
  files jsonb not null default '[]'::jsonb, -- [{name, url}]
  status text not null default 'جديد' check (status in ('جديد','تم التواصل','قيد التنفيذ','مكتمل','ملغي')),
  internal_notes text default '',
  ip_address text,   -- used for basic rate limiting, not shown publicly
  created_at timestamptz not null default now()
);

-- Fast lookup for the rate-limit check (count recent submissions per IP)
create index if not exists idx_requests_ip_created on requests (ip_address, created_at);

-- ----------------------------------------------------------------
-- PAGE VIEWS  (lightweight visitor counter)
-- ----------------------------------------------------------------
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_page_views_created on page_views (created_at);

-- ----------------------------------------------------------------
-- REVIEWS  (customer ratings/testimonials)
-- ----------------------------------------------------------------
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null default '',
  service text,
  approved boolean not null default false, -- admin moderates before it shows publicly
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- SITE SETTINGS  (single-row key/value store for editable content)
-- ----------------------------------------------------------------
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Seed default settings so the admin panel has something to edit.
insert into site_settings (key, value) values
  ('logo_url', '"/logo.png"'),
  ('contact', '{"whatsapp":"966531166659","email":"ff2h2d1994@gmail.com","instagram":"ff2h2d","snapchat":"ff2h2d","x":"ff2h2d"}'),
  ('hero_text', '{"title_ar":"كل ما تحتاجه في مكان واحد","subtitle_ar":"خدمات احترافية بقوة الذكاء الاصطناعي","tagline_ar":"أفكار اليوم.. تصنع نجاحك غداً"}'),
  ('certificate', '{"visible":true,"verify_url":""}')
on conflict (key) do nothing;

-- ----------------------------------------------------------------
-- updated_at triggers
-- ----------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_services_updated on services;
create trigger trg_services_updated before update on services
  for each row execute function set_updated_at();

drop trigger if exists trg_projects_updated on projects;
create trigger trg_projects_updated before update on projects
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------
-- ROW LEVEL SECURITY
-- Public (anon + authenticated non-admin): read-only on published rows.
-- Admin (auth.jwt() email = the ADMIN_EMAIL env value, enforced also in
-- app middleware/server actions): full read/write.
-- We check the admin email via a helper that reads it from the JWT,
-- compared against the app setting stored in Supabase Auth -> the
-- admin's own account. Since Supabase RLS cannot read process.env,
-- the safe approach is: only ONE user is ever created in Supabase Auth
-- for this project (the admin), so "authenticated" == "admin".
-- ----------------------------------------------------------------

alter table services enable row level security;
alter table projects enable row level security;
alter table requests enable row level security;
alter table site_settings enable row level security;
alter table page_views enable row level security;
alter table reviews enable row level security;

-- SERVICES
create policy "public read visible services"
  on services for select
  using (visible = true);

create policy "admin full access services"
  on services for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- PROJECTS
create policy "public read visible projects"
  on projects for select
  using (visible = true);

create policy "admin full access projects"
  on projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- REQUESTS — anyone can submit (insert), only admin can read/update/delete
create policy "public can submit requests"
  on requests for insert
  with check (true);

create policy "admin can read requests"
  on requests for select
  using (auth.role() = 'authenticated');

create policy "admin can update requests"
  on requests for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin can delete requests"
  on requests for delete
  using (auth.role() = 'authenticated');

-- SITE SETTINGS
create policy "public read settings"
  on site_settings for select
  using (true);

create policy "admin write settings"
  on site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- PAGE VIEWS — anyone can log a view (insert), only admin can read/delete
create policy "public can log page view"
  on page_views for insert
  with check (true);

create policy "admin can read page views"
  on page_views for select
  using (auth.role() = 'authenticated');

create policy "admin can delete page views"
  on page_views for delete
  using (auth.role() = 'authenticated');

-- REVIEWS — anyone can submit (insert), public can read approved ones only,
-- only admin can read all / approve / delete
create policy "public can submit reviews"
  on reviews for insert
  with check (true);

create policy "public reads approved reviews"
  on reviews for select
  using (approved = true);

create policy "admin reads all reviews"
  on reviews for select
  using (auth.role() = 'authenticated');

create policy "admin updates reviews"
  on reviews for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin deletes reviews"
  on reviews for delete
  using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------
-- STORAGE BUCKETS (run separately, or via Supabase dashboard):
--   create bucket "media"   -> public read, admin write (projects images/video)
--   create bucket "uploads" -> public write of reference files from
--                              the request form, admin read
-- Suggested storage policies are documented in README.md, since
-- storage policies are managed under storage.objects and are easiest
-- to create from the Supabase dashboard UI.
--
-- FILE TYPE / SIZE ENFORCEMENT — this is the real server-side check,
-- since browsers upload directly to Storage (not through our API).
-- Run this AFTER creating both buckets in the dashboard:
-- ----------------------------------------------------------------

update storage.buckets
set file_size_limit = 26214400, -- 25 MB
    allowed_mime_types = array[
      'image/jpeg','image/png','image/webp','image/gif',
      'video/mp4','video/quicktime','video/webm'
    ]
where id = 'media';

update storage.buckets
set file_size_limit = 15728640, -- 15 MB
    allowed_mime_types = array[
      'image/jpeg','image/png','image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip'
    ]
where id = 'uploads';

-- Any file outside these types/sizes (including .exe, .sh, .bat, etc.)
-- is rejected by Supabase Storage itself before it is ever stored.
