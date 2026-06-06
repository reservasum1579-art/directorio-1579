-- Crear bucket para documentos si no existe
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do update set public = true;

-- Políticas del bucket
drop policy if exists "Documents are publicly accessible" on storage.objects;
drop policy if exists "Admins can upload documents" on storage.objects;
drop policy if exists "Admins can delete documents" on storage.objects;

create policy "Documents are publicly accessible"
on storage.objects for select to public
using ( bucket_id = 'documents' );

create policy "Admins can upload documents"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'documents' and
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role in ('admin', 'super_admin', 'admin_consorcio')
  )
);

create policy "Admins can delete documents"
on storage.objects for delete to authenticated
using (
  bucket_id = 'documents' and
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role in ('admin', 'super_admin', 'admin_consorcio')
  )
);

-- Crear tabla building_documents
create table if not exists building_documents (
    id uuid default gen_random_uuid() primary key,
    building_id uuid not null default 'b0000000-0000-0000-0000-000000000001',
    title text not null,
    file_url text not null,
    file_name text not null,
    period_month integer not null check (period_month between 1 and 12),
    period_year integer not null,
    uploaded_by uuid references auth.users(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table building_documents enable row level security;

-- Políticas de la tabla
create policy "Documents viewable by everyone" on building_documents
    for select using (true);

create policy "Documents insertable by admins" on building_documents
    for insert with check (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('admin', 'super_admin', 'admin_consorcio')
        )
    );

create policy "Documents deletable by admins" on building_documents
    for delete using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('admin', 'super_admin', 'admin_consorcio')
        )
    );
