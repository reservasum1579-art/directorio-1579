create table sum_rules (
    id uuid default gen_random_uuid() primary key,
    building_id uuid not null default 'b0000000-0000-0000-0000-000000000001',
    rule_key text not null,
    rule_value jsonb not null default '{}'::jsonb,
    updated_by uuid references auth.users(id),
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(building_id, rule_key)
);

-- Habilitar RLS
alter table sum_rules enable row level security;

-- Políticas
create policy "Sum rules are viewable by everyone" on sum_rules
    for select using (true);

create policy "Sum rules can be inserted by admins" on sum_rules
    for insert with check (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('admin', 'super_admin', 'admin_consorcio')
        )
    );

create policy "Sum rules can be updated by admins" on sum_rules
    for update using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role in ('admin', 'super_admin', 'admin_consorcio')
        )
    );

-- Insertar valores por defecto para que la app no se rompa
insert into sum_rules (building_id, rule_key, rule_value) values
('b0000000-0000-0000-0000-000000000001', 'pricing', '{"morning": 3000, "night": 5000, "full_day": 7000, "deposit": 10000}'::jsonb),
('b0000000-0000-0000-0000-000000000001', 'limits', '{"max_capacity": 30, "min_cancel_hours": 24, "max_per_month": 2}'::jsonb),
('b0000000-0000-0000-0000-000000000001', 'shifts', '{"morning": {"start": "10:00", "end": "17:00"}, "night": {"start": "20:00", "end": "01:00"}}'::jsonb)
on conflict (building_id, rule_key) do nothing;
