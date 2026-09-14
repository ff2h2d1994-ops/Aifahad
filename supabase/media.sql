-- Portfolio media bucket and policies.
-- Run this once in Supabase SQL Editor. It is safe to run again.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  26214400,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/quicktime', 'video/webm'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read portfolio media" on storage.objects;
create policy "Public can read portfolio media"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Authenticated admins can upload portfolio media" on storage.objects;
create policy "Authenticated admins can upload portfolio media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can update portfolio media" on storage.objects;
create policy "Authenticated admins can update portfolio media"
  on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated')
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can delete portfolio media" on storage.objects;
create policy "Authenticated admins can delete portfolio media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');