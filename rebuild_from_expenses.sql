-- ==============================================================
-- SCRIPT MAESTRO - DIRECTORIO 1579
-- Ejecutar en Supabase SQL Editor (usa privilegios de servicio)
-- ==============================================================

-- ---------------------------------------------------------------
-- PASO 1: Agregar políticas de INSERT/DELETE a la tabla units
-- (necesario para que el admin pueda gestionar unidades)
-- ---------------------------------------------------------------

-- Primero verificar si ya tiene RLS habilitado
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas viejas si existen
DROP POLICY IF EXISTS "Enable read for all" ON public.units;
DROP POLICY IF EXISTS "Enable insert for authenticated" ON public.units;
DROP POLICY IF EXISTS "Enable update for authenticated" ON public.units;
DROP POLICY IF EXISTS "Enable delete for authenticated" ON public.units;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.units;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.units;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.units;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.units;

-- Crear nuevas políticas permisivas
CREATE POLICY "Enable read access for all users" ON public.units FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.units FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.units FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for authenticated users" ON public.units FOR DELETE TO authenticated USING (true);

-- ---------------------------------------------------------------
-- PASO 2: Eliminar columna building_id si tiene FK (o hacerla nullable)
-- ---------------------------------------------------------------
ALTER TABLE public.units ALTER COLUMN building_id DROP NOT NULL;

-- ---------------------------------------------------------------
-- PASO 3: Limpiar datos previos
-- ---------------------------------------------------------------
UPDATE public.profiles SET unit_id = NULL, garage_id = NULL;
DELETE FROM public.unit_occupants;
DELETE FROM public.unit_pets;
DELETE FROM public.unit_vehicles;
DELETE FROM public.units;

-- ---------------------------------------------------------------
-- PASO 4: Insertar las 48 unidades reales del edificio
-- ---------------------------------------------------------------

-- COCHERAS (Planta Baja)
INSERT INTO public.units (floor, unit_number, parking, functional_unit, coefficient) VALUES ('PB', 'COCH 1',  'COCH 1',  '001', 0.36);
INSERT INTO public.units (floor, unit_number, parking, functional_unit, coefficient) VALUES ('PB', 'COCH 2',  'COCH 2',  '002', 0.36);
INSERT INTO public.units (floor, unit_number, parking, functional_unit, coefficient) VALUES ('PB', 'COCH 3',  'COCH 3',  '003', 0.36);
INSERT INTO public.units (floor, unit_number, parking, functional_unit, coefficient) VALUES ('PB', 'COCH 4',  'COCH 4',  '004', 0.36);
INSERT INTO public.units (floor, unit_number, parking, functional_unit, coefficient) VALUES ('PB', 'COCH 5',  'COCH 5',  '005', 0.36);
INSERT INTO public.units (floor, unit_number, parking, functional_unit, coefficient) VALUES ('PB', 'COCH 6',  'COCH 6',  '006', 0.36);
INSERT INTO public.units (floor, unit_number, parking, functional_unit, coefficient) VALUES ('PB', 'COCH 7',  'COCH 7',  '007', 0.36);
INSERT INTO public.units (floor, unit_number, parking, functional_unit, coefficient) VALUES ('PB', 'COCH 8',  'COCH 8',  '008', 0.36);
INSERT INTO public.units (floor, unit_number, parking, functional_unit, coefficient) VALUES ('PB', 'COCH 9',  'COCH 9',  '009', 0.36);
INSERT INTO public.units (floor, unit_number, parking, functional_unit, coefficient) VALUES ('PB', 'COCH 10', 'COCH 10', '010', 0.36);
INSERT INTO public.units (floor, unit_number, parking, functional_unit, coefficient) VALUES ('PB', 'COCH 11', 'COCH 11', '011', 0.36);
INSERT INTO public.units (floor, unit_number, parking, functional_unit, coefficient) VALUES ('PB', 'COCH 12', 'COCH 12', '012', 0.36);
INSERT INTO public.units (floor, unit_number, parking, functional_unit, coefficient) VALUES ('PB', 'COCH 13', 'COCH 13', '013', 0.36);
INSERT INTO public.units (floor, unit_number, parking, functional_unit, coefficient) VALUES ('PB', 'COCH 14', 'COCH 14', '014', 0.33);

-- PISO 1
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('1', 'A', '015', 3.52);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('1', 'C', '016', 1.42);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('1', 'D', '017', 7.98);

-- PISO 2
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('2', 'A', '018', 3.67);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('2', 'B', '019', 1.60);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('2', 'C', '020', 3.62);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('2', 'D', '021', 1.60);

-- PISO 3
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('3', 'A', '022', 3.67);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('3', 'B', '023', 1.60);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('3', 'C', '024', 3.62);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('3', 'D', '025', 1.60);

-- PISO 4
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('4', 'A', '026', 3.67);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('4', 'B', '027', 1.60);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('4', 'C', '028', 3.62);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('4', 'D', '029', 1.60);

-- PISO 5
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('5', 'A', '030', 3.67);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('5', 'B', '031', 1.60);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('5', 'C', '032', 3.62);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('5', 'D', '033', 1.60);

-- PISO 6
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('6', 'A', '034', 3.67);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('6', 'B', '035', 1.60);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('6', 'C', '036', 3.62);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('6', 'D', '037', 1.60);

-- PISO 7
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('7', 'A', '038', 3.67);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('7', 'B', '039', 1.60);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('7', 'C', '040', 3.62);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('7', 'D', '041', 1.60);

-- PISO 8
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('8', 'A', '042', 3.47);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('8', 'B', '043', 1.42);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('8', 'C', '044', 3.62);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('8', 'D', '045', 1.60);

-- PISO 9
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('9', 'A', '046', 4.13);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('9', 'C', '047', 3.47);
INSERT INTO public.units (floor, unit_number, functional_unit, coefficient) VALUES ('9', 'D', '048', 1.42);

-- ---------------------------------------------------------------
-- PASO 5: Insertar propietarios desde las expensas
-- ---------------------------------------------------------------
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'LEON SUSANA',      'leon.susana@example.com',      '11----', 'owner', true FROM public.units WHERE functional_unit = '001';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'CHOI MICAELA',     'choi.micaela@example.com',     '11----', 'owner', true FROM public.units WHERE functional_unit = '002';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'BONFILI DAMIAN',   'bonfili.damian@example.com',   '11----', 'owner', true FROM public.units WHERE functional_unit = '003';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'PACHECO JOSE',     'pacheco.jose@example.com',     '11----', 'owner', true FROM public.units WHERE functional_unit = '004';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'CASTIGLIA NICOL',  'castiglia.nicol@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '005';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'BARSAMAYAN SEBA',  'barsamayan.seba@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '006';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'MARZELLA NESTOR',  'marzella.nestor@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '007';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'PONTIERI MARIA',   'pontieri.maria@example.com',   '11----', 'owner', true FROM public.units WHERE functional_unit = '008';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'PANE ARNALDO',     'pane.arnaldo@example.com',     '11----', 'owner', true FROM public.units WHERE functional_unit = '009';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'LASCA',            'lasca@example.com',            '11----', 'owner', true FROM public.units WHERE functional_unit = '010';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'FLORIO ALBERTO',   'florio.alberto@example.com',   '11----', 'owner', true FROM public.units WHERE functional_unit = '011';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'FABIANO CARLA',    'fabiano.carla@example.com',    '11----', 'owner', true FROM public.units WHERE functional_unit = '012';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'SPOSATO PABLO',    'sposato.pablo@example.com',    '11----', 'owner', true FROM public.units WHERE functional_unit = '013';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'CASTIGLIA FLORE',  'castiglia.flore@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '014';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'MUÑOZ LORENA',     'munoz.lorena@example.com',     '11----', 'owner', true FROM public.units WHERE functional_unit = '015';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'BUCCIARDI JORGE',  'bucciardi.jorge@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '016';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'PONTIERI MARIA',   'pontieri.maria2@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '017';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'ALVAREZ RODRIGO',  'alvarez.rodrigo@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '018';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'SERVENTE ANA',     'servente.ana@example.com',     '11----', 'owner', true FROM public.units WHERE functional_unit = '019';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'CONCILIO DANIEL',  'concilio.daniel@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '020';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'RODRIGUEZ MARCO',  'rodriguez.marco@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '021';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'MARZELLA JORGE',   'marzella.jorge@example.com',   '11----', 'owner', true FROM public.units WHERE functional_unit = '022';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'FABIANO CARLA',    'fabiano.carla2@example.com',   '11----', 'owner', true FROM public.units WHERE functional_unit = '023';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'RODRIGUEZ M',      'rodriguez.m@example.com',      '11----', 'owner', true FROM public.units WHERE functional_unit = '024';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'POCQUET CECILIA',  'pocquet.cecilia@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '025';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'RODRIGUEZ MARCOS', 'rodriguez.marcos@example.com', '11----', 'owner', true FROM public.units WHERE functional_unit = '026';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'CALLIPARI DANIEL', 'callipari.daniel@example.com', '11----', 'owner', true FROM public.units WHERE functional_unit = '027';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'GOIOSA ALEXAND',   'goiosa.alexand@example.com',   '11----', 'owner', true FROM public.units WHERE functional_unit = '028';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'PAIK VICTOR',      'paik.victor@example.com',      '11----', 'owner', true FROM public.units WHERE functional_unit = '029';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'GERACE/ PANE',     'gerace.pane@example.com',      '11----', 'owner', true FROM public.units WHERE functional_unit = '030';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'ORTS EDUARDO',     'orts.eduardo@example.com',     '11----', 'owner', true FROM public.units WHERE functional_unit = '031';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'NOYA VICTORIA',    'noya.victoria@example.com',    '11----', 'owner', true FROM public.units WHERE functional_unit = '032';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'GIOACCHINI GUIL',  'gioacchini.guil@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '033';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'BARSAMAYAN SEBA',  'barsamayan.seba2@example.com', '11----', 'owner', true FROM public.units WHERE functional_unit = '034';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'CARRINO BEATRIZ',  'carrino.beatriz@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '035';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'LEON SUSANA',      'leon.susana2@example.com',     '11----', 'owner', true FROM public.units WHERE functional_unit = '036';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'SUAREZ GRACIELA',  'suarez.graciela@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '037';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'BONFILI DAMIAN',   'bonfili.damian2@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '038';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'WESTREPP FLOREN',  'westrepp.floren@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '039';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'SPOSATO PABLO',    'sposato.pablo2@example.com',   '11----', 'owner', true FROM public.units WHERE functional_unit = '040';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'CHOI MICAELA',     'choi.micaela2@example.com',    '11----', 'owner', true FROM public.units WHERE functional_unit = '041';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'CASTIGLIA FLORE',  'castiglia.flore2@example.com', '11----', 'owner', true FROM public.units WHERE functional_unit = '042';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'WADDLE GERMAN',    'waddle.german@example.com',    '11----', 'owner', true FROM public.units WHERE functional_unit = '043';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'LASCA',            'lasca2@example.com',           '11----', 'owner', true FROM public.units WHERE functional_unit = '044';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'KURINGUIAN GRAC',  'kuringuian.grac@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '045';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'PACHECO JOSE',     'pacheco.jose2@example.com',    '11----', 'owner', true FROM public.units WHERE functional_unit = '046';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'CASTIGLIA NICOL',  'castiglia.nicol2@example.com', '11----', 'owner', true FROM public.units WHERE functional_unit = '047';
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary) SELECT id, 'CARELLA GUSTAVO',  'carella.gustavo@example.com',  '11----', 'owner', true FROM public.units WHERE functional_unit = '048';

-- ---------------------------------------------------------------
-- PASO 6: Verificación final
-- ---------------------------------------------------------------
SELECT COUNT(*) as total_units FROM public.units;
SELECT COUNT(*) as total_occupants FROM public.unit_occupants;
