-- Create tables for unit details (Occupants, Pets, Vehicles)

CREATE TABLE IF NOT EXISTS public.unit_occupants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    relationship TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.unit_pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.unit_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    plate TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.unit_occupants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_vehicles ENABLE ROW LEVEL SECURITY;

-- Policies for unit_occupants
CREATE POLICY "Enable read access for all users" ON public.unit_occupants FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.unit_occupants FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.unit_occupants FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for authenticated users" ON public.unit_occupants FOR DELETE TO authenticated USING (true);

-- Policies for unit_pets
CREATE POLICY "Enable read access for all users" ON public.unit_pets FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.unit_pets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.unit_pets FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for authenticated users" ON public.unit_pets FOR DELETE TO authenticated USING (true);

-- Policies for unit_vehicles
CREATE POLICY "Enable read access for all users" ON public.unit_vehicles FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.unit_vehicles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.unit_vehicles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for authenticated users" ON public.unit_vehicles FOR DELETE TO authenticated USING (true);
