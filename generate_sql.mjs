import fs from 'fs';

const OWNERS = [
  { id: '1', name: 'Patricio Kenny', unit: '6° C', parking: 'COCH 1', functional_unit: '036 + 001' },
  { id: '2', name: 'CHOI MICAELA', unit: '7° D', parking: 'COCH 2', functional_unit: '041 + 002' },
  { id: '3', name: 'BONFILI DAMIAN', unit: '7° A', parking: 'COCH 3', functional_unit: '038 + 003' },
  { id: '4', name: 'PACHECO JOSE', unit: '9° A', parking: 'COCH 4', functional_unit: '046 + 004' },
  { id: '5', name: 'CASTIGLIA NICOL', unit: '9° C', parking: 'COCH 5', functional_unit: '047 + 005' },
  { id: '6', name: 'BARSAMAYAN SEBA', unit: '6° A', parking: 'COCH 6', functional_unit: '034 + 006' },
  { id: '7', name: 'MARZELLA NESTOR', unit: 'COCH 7', parking: 'COCH 7', functional_unit: '007' },
  { id: '8', name: 'PONTIERI MARIA', unit: '1° A', parking: 'COCH 8', functional_unit: '017 + 008' },
  { id: '9', name: 'PANE ARNALDO', unit: 'COCH 9', parking: 'COCH 9', functional_unit: '009' },
  { id: '10', name: 'LASCA', unit: '8° D', parking: 'COCH 10', functional_unit: '044 + 010' },
  { id: '11', name: 'FLORIO ALBERTO', unit: 'COCH 11', parking: 'COCH 11', functional_unit: '011' },
  { id: '12', name: 'FABIANO CARLA', unit: '3° B', parking: 'COCH 12', functional_unit: '023 + 012' },
  { id: '13', name: 'SPOSATO PABLO', unit: '7° C', parking: 'COCH 13', functional_unit: '040 + 013' },
  { id: '14', name: 'CASTIGLIA FLORE', unit: '8° A', parking: 'COCH 14', functional_unit: '042 + 014' },
  { id: '15', name: 'MUÑOZ LORENA', unit: '1° A', functional_unit: '015' },
  { id: '16', name: 'BUCCIARDI JORGE', unit: '1° B', functional_unit: '016' },
  { id: '18', name: 'ALVAREZ RODRIGO', unit: '1° A', functional_unit: '018' },
  { id: '19', name: 'SERVENTE ANA', unit: '1° B', functional_unit: '019' },
  { id: '20', name: 'CONCILIO DANIEL', unit: '2° C', functional_unit: '020' },
  { id: '21', name: 'RODRIGUEZ MARCO', unit: '2° D', functional_unit: '021' },
  { id: '22', name: 'MARZELLA JORGE', unit: '3° A', functional_unit: '022' },
  { id: '24', name: 'RODRIGUEZ M', unit: '3° C', functional_unit: '024' },
  { id: '25', name: 'POCQUET CECILIA', unit: '3° D', functional_unit: '025' },
  { id: '26', name: 'RODRIGUEZ MARCOS', unit: '4° A', functional_unit: '026' },
  { id: '27', name: 'CALLIPARI DANIEL', unit: '4° B', functional_unit: '027' },
  { id: '28', name: 'GOIOSA ALEXAND', unit: '4° C', functional_unit: '028' },
  { id: '29', name: 'PAIK VICTOR', unit: '4° D', functional_unit: '029' },
  { id: '30', name: 'GERACE / PANE', unit: '5° A', functional_unit: '030' },
  { id: '31', name: 'ORTS EDUARDO', unit: '5° B', functional_unit: '031' },
  { id: '32', name: 'NOYA VICTORIA', unit: '5° C', functional_unit: '032' },
  { id: '33', name: 'GIOACCHINI GUIL', unit: '5° D', functional_unit: '033' },
  { id: '35', name: 'CARRINO BEATRIZ', unit: '6° B', functional_unit: '035' },
  { id: '37', name: 'SUAREZ GRACIELA', unit: '6° D', functional_unit: '037' },
  { id: '39', name: 'WESTREPP FLOREN', unit: '7° B', functional_unit: '039' },
  { id: '43', name: 'WADDLE GERMAN', unit: '8° B', functional_unit: '043' },
  { id: '45', name: 'KURINGUIAN GRAC', unit: '8° D', functional_unit: '045' },
  { id: '48', name: 'CARELLA GUSTAVO', unit: '9° D', functional_unit: '048' },
];

let sql = `-- Limpiar ocupantes existentes para evitar duplicados\nDELETE FROM public.unit_occupants;\n\n`;

for (const owner of OWNERS) {
  const floorMatch = owner.unit.match(/(\d+)°/);
  const floor = floorMatch ? floorMatch[1] : owner.unit.includes('COCH') ? 'PB' : owner.unit;
  const unit_number = owner.unit.includes('°') ? owner.unit.split(' ')[1] : owner.unit;
  
  const email = `${owner.name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
  
  sql += `
-- Ocupante: ${owner.name}
INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)
SELECT id, '${owner.name}', '${email}', '11 ---- ----', 'owner', true
FROM public.units WHERE floor = '${floor}' AND unit_number = '${unit_number}'
LIMIT 1;
`;
}

// Coches y mascotas (solo los mockeados como ejemplo)
sql += `
-- Mascotas de prueba
DELETE FROM public.unit_pets;
INSERT INTO public.unit_pets (unit_id, type, name)
SELECT id, 'Perro', 'Rocco' FROM public.units WHERE floor = '6' AND unit_number = 'C' LIMIT 1;

-- Vehiculos de prueba
DELETE FROM public.unit_vehicles;
`;

for (const owner of OWNERS) {
  if (owner.parking) {
    const floorMatch = owner.unit.match(/(\d+)°/);
    const floor = floorMatch ? floorMatch[1] : owner.unit.includes('COCH') ? 'PB' : owner.unit;
    const unit_number = owner.unit.includes('°') ? owner.unit.split(' ')[1] : owner.unit;
    
    sql += `
INSERT INTO public.unit_vehicles (unit_id, brand, model, plate)
SELECT id, 'Consultar', 'Declarado', '--- ---' FROM public.units WHERE floor = '${floor}' AND unit_number = '${unit_number}' LIMIT 1;
`;
  }
}

fs.writeFileSync('seed_occupants.sql', sql);
console.log('SQL generado en seed_occupants.sql');
