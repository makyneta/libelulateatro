-- 1) Move admin credential material out of the publicly readable site_settings table
create table if not exists public.admin_credentials (
  id integer primary key default 1,
  password_hash text,
  password_salt text,
  updated_at timestamptz not null default now(),
  constraint admin_credentials_single_row check (id = 1)
);

-- No anon/authenticated grants: only server-side privileged code may touch credentials
revoke all on public.admin_credentials from anon, authenticated;
grant all on public.admin_credentials to service_role;

alter table public.admin_credentials enable row level security;
-- Intentionally no policies: anon/authenticated get zero access; service_role bypasses RLS.

insert into public.admin_credentials (id, password_hash, password_salt)
select 1, admin_password_hash, admin_password_salt
from public.site_settings
where id = 1
on conflict (id) do update
  set password_hash = excluded.password_hash,
      password_salt = excluded.password_salt;

insert into public.admin_credentials (id)
select 1
where not exists (select 1 from public.admin_credentials where id = 1);

alter table public.site_settings drop column if exists admin_password_hash;
alter table public.site_settings drop column if exists admin_password_salt;

-- 2) Explicit, owner-scoped RLS policies on storage.objects (media bucket is private;
--    the app serves signed URLs generated server-side with privileged credentials)
drop policy if exists "media owner read" on storage.objects;
drop policy if exists "media owner insert" on storage.objects;
drop policy if exists "media owner update" on storage.objects;
drop policy if exists "media owner delete" on storage.objects;

create policy "media owner read"
  on storage.objects for select to authenticated
  using (bucket_id = 'media' and owner = auth.uid());

create policy "media owner insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and owner = auth.uid());

create policy "media owner update"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and owner = auth.uid())
  with check (bucket_id = 'media' and owner = auth.uid());

create policy "media owner delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and owner = auth.uid());