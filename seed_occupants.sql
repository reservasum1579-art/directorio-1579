-- Limpiar ocupantes existentes para evitar duplicados
DELETE FROM public.unit_occupants;


-- Ocupante: Patricio Kenny
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'Patricio Kenny', 'patricio.kenny@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '6' AND unit_number = 'C'
LIMIT 1;

-- Ocupante: CHOI MICAELA
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'CHOI MICAELA', 'choi.micaela@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '7' AND unit_number = 'D'
LIMIT 1;

-- Ocupante: BONFILI DAMIAN
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'BONFILI DAMIAN', 'bonfili.damian@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '7' AND unit_number = 'A'
LIMIT 1;

-- Ocupante: PACHECO JOSE
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'PACHECO JOSE', 'pacheco.jose@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '9' AND unit_number = 'A'
LIMIT 1;

-- Ocupante: CASTIGLIA NICOL
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'CASTIGLIA NICOL', 'castiglia.nicol@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '9' AND unit_number = 'C'
LIMIT 1;

-- Ocupante: BARSAMAYAN SEBA
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'BARSAMAYAN SEBA', 'barsamayan.seba@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '6' AND unit_number = 'A'
LIMIT 1;

-- Ocupante: MARZELLA NESTOR
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'MARZELLA NESTOR', 'marzella.nestor@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = 'PB' AND unit_number = 'COCH 7'
LIMIT 1;

-- Ocupante: PONTIERI MARIA
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'PONTIERI MARIA', 'pontieri.maria@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '1' AND unit_number = 'A'
LIMIT 1;

-- Ocupante: PANE ARNALDO
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'PANE ARNALDO', 'pane.arnaldo@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = 'PB' AND unit_number = 'COCH 9'
LIMIT 1;

-- Ocupante: LASCA
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'LASCA', 'lasca@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '8' AND unit_number = 'D'
LIMIT 1;

-- Ocupante: FLORIO ALBERTO
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'FLORIO ALBERTO', 'florio.alberto@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = 'PB' AND unit_number = 'COCH 11'
LIMIT 1;

-- Ocupante: FABIANO CARLA
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'FABIANO CARLA', 'fabiano.carla@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '3' AND unit_number = 'B'
LIMIT 1;

-- Ocupante: SPOSATO PABLO
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'SPOSATO PABLO', 'sposato.pablo@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '7' AND unit_number = 'C'
LIMIT 1;

-- Ocupante: CASTIGLIA FLORE
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'CASTIGLIA FLORE', 'castiglia.flore@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '8' AND unit_number = 'A'
LIMIT 1;

-- Ocupante: MUÑOZ LORENA
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'MUÑOZ LORENA', 'muñoz.lorena@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '1' AND unit_number = 'A'
LIMIT 1;

-- Ocupante: BUCCIARDI JORGE
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'BUCCIARDI JORGE', 'bucciardi.jorge@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '1' AND unit_number = 'B'
LIMIT 1;

-- Ocupante: ALVAREZ RODRIGO
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'ALVAREZ RODRIGO', 'alvarez.rodrigo@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '1' AND unit_number = 'A'
LIMIT 1;

-- Ocupante: SERVENTE ANA
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'SERVENTE ANA', 'servente.ana@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '1' AND unit_number = 'B'
LIMIT 1;

-- Ocupante: CONCILIO DANIEL
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'CONCILIO DANIEL', 'concilio.daniel@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '2' AND unit_number = 'C'
LIMIT 1;

-- Ocupante: RODRIGUEZ MARCO
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'RODRIGUEZ MARCO', 'rodriguez.marco@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '2' AND unit_number = 'D'
LIMIT 1;

-- Ocupante: MARZELLA JORGE
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'MARZELLA JORGE', 'marzella.jorge@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '3' AND unit_number = 'A'
LIMIT 1;

-- Ocupante: RODRIGUEZ M
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'RODRIGUEZ M', 'rodriguez.m@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '3' AND unit_number = 'C'
LIMIT 1;

-- Ocupante: POCQUET CECILIA
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'POCQUET CECILIA', 'pocquet.cecilia@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '3' AND unit_number = 'D'
LIMIT 1;

-- Ocupante: RODRIGUEZ MARCOS
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'RODRIGUEZ MARCOS', 'rodriguez.marcos@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '4' AND unit_number = 'A'
LIMIT 1;

-- Ocupante: CALLIPARI DANIEL
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'CALLIPARI DANIEL', 'callipari.daniel@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '4' AND unit_number = 'B'
LIMIT 1;

-- Ocupante: GOIOSA ALEXAND
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'GOIOSA ALEXAND', 'goiosa.alexand@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '4' AND unit_number = 'C'
LIMIT 1;

-- Ocupante: PAIK VICTOR
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'PAIK VICTOR', 'paik.victor@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '4' AND unit_number = 'D'
LIMIT 1;

-- Ocupante: GERACE / PANE
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'GERACE / PANE', 'gerace./.pane@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '5' AND unit_number = 'A'
LIMIT 1;

-- Ocupante: ORTS EDUARDO
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'ORTS EDUARDO', 'orts.eduardo@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '5' AND unit_number = 'B'
LIMIT 1;

-- Ocupante: NOYA VICTORIA
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'NOYA VICTORIA', 'noya.victoria@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '5' AND unit_number = 'C'
LIMIT 1;

-- Ocupante: GIOACCHINI GUIL
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'GIOACCHINI GUIL', 'gioacchini.guil@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '5' AND unit_number = 'D'
LIMIT 1;

-- Ocupante: CARRINO BEATRIZ
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'CARRINO BEATRIZ', 'carrino.beatriz@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '6' AND unit_number = 'B'
LIMIT 1;

-- Ocupante: SUAREZ GRACIELA
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'SUAREZ GRACIELA', 'suarez.graciela@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '6' AND unit_number = 'D'
LIMIT 1;

-- Ocupante: WESTREPP FLOREN
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'WESTREPP FLOREN', 'westrepp.floren@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '7' AND unit_number = 'B'
LIMIT 1;

-- Ocupante: WADDLE GERMAN
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'WADDLE GERMAN', 'waddle.german@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '8' AND unit_number = 'B'
LIMIT 1;

-- Ocupante: KURINGUIAN GRAC
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'KURINGUIAN GRAC', 'kuringuian.grac@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '8' AND unit_number = 'D'
LIMIT 1;

-- Ocupante: CARELLA GUSTAVO
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, 'CARELLA GUSTAVO', 'carella.gustavo@example.com', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '9' AND unit_number = 'D'
LIMIT 1;

-- Mascotas de prueba
DELETE FROM public.unit_pets;
INSERT INTO public.unit_pets (unit_id, type, name)
SELECT id, 'Perro', 'Rocco' FROM public.units WHERE floor = '6' AND unit_number = 'C' LIMIT 1;

-- Vehiculos de prueba
DELETE FROM public.unit_vehicles;

INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = '6' AND unit_number = 'C' LIMIT 1;

INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = '7' AND unit_number = 'D' LIMIT 1;

INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = '7' AND unit_number = 'A' LIMIT 1;

INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = '9' AND unit_number = 'A' LIMIT 1;

INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = '9' AND unit_number = 'C' LIMIT 1;

INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = '6' AND unit_number = 'A' LIMIT 1;

INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = 'PB' AND unit_number = 'COCH 7' LIMIT 1;

INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = '1' AND unit_number = 'A' LIMIT 1;

INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = 'PB' AND unit_number = 'COCH 9' LIMIT 1;

INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = '8' AND unit_number = 'D' LIMIT 1;

INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = 'PB' AND unit_number = 'COCH 11' LIMIT 1;

INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = '3' AND unit_number = 'B' LIMIT 1;

INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = '7' AND unit_number = 'C' LIMIT 1;

INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = '8' AND unit_number = 'A' LIMIT 1;
