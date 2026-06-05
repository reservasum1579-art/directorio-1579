import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUILDING_ID = process.env.NEXT_PUBLIC_BUILDING_ID || '1';

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

async function seed() {
  console.log('Starting seed process...');

  for (const owner of OWNERS) {
    const floorMatch = owner.unit.match(/(\d+)°/);
    const floor = floorMatch ? floorMatch[1] : owner.unit.includes('COCH') ? 'PB' : owner.unit;
    const unit_number = owner.unit.includes('°') ? owner.unit.split(' ')[1] : owner.unit;

    // 1. Check if unit exists
    let { data: existingUnit } = await supabase
      .from('units')
      .select('id')
      .eq('floor', floor)
      .eq('unit_number', unit_number)
      .eq('building_id', BUILDING_ID)
      .single();

    if (!existingUnit) {
      console.log(`Creating unit ${floor}° ${unit_number}...`);
      const { data: newUnit, error } = await supabase
        .from('units')
        .insert({
          building_id: BUILDING_ID,
          floor: floor,
          unit_number: unit_number,
          parking: owner.parking || null,
          functional_unit: owner.functional_unit,
          coefficient: 1.5 // Default
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating unit:', error);
        continue;
      }
      existingUnit = newUnit;
    } else {
      // Update parking and UF if existing
      await supabase
        .from('units')
        .update({
          parking: owner.parking || null,
          functional_unit: owner.functional_unit
        })
        .eq('id', existingUnit.id);
    }

    const unitId = existingUnit.id;

    // 2. Add as occupant
    console.log(`Adding occupant ${owner.name}...`);
    // Delete existing primary to avoid duplicates
    await supabase.from('unit_occupants').delete().eq('unit_id', unitId).eq('name', owner.name);

    await supabase
      .from('unit_occupants')
      .insert({
        unit_id: unitId,
        name: owner.name,
        email: `${owner.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: '11 ---- ----',
        relationship: 'owner',
        is_primary: true
      });

    // 3. Add pets (Mock specific)
    if (owner.name === 'Patricio Kenny') {
      await supabase.from('unit_pets').delete().eq('unit_id', unitId);
      await supabase.from('unit_pets').insert({
        unit_id: unitId,
        type: 'Perro',
        name: 'Rocco'
      });
    }

    // 4. Add vehicles (Mock specific)
    if (owner.parking) {
      await supabase.from('unit_vehicles').delete().eq('unit_id', unitId);
      await supabase.from('unit_vehicles').insert({
        unit_id: unitId,
        brand: 'Consultar',
        model: 'Declarado',
        plate: '--- ---'
      });
    }
  }

  // Create all garages (COCH 1-14) as independent units in PB if they don't exist
  console.log('\nCreating all garage units...');
  const garages = [
    { unit_number: 'COCH 1', functional_unit: '001' },
    { unit_number: 'COCH 2', functional_unit: '002' },
    { unit_number: 'COCH 3', functional_unit: '003' },
    { unit_number: 'COCH 4', functional_unit: '004' },
    { unit_number: 'COCH 5', functional_unit: '005' },
    { unit_number: 'COCH 6', functional_unit: '006' },
    { unit_number: 'COCH 7', functional_unit: '007' },
    { unit_number: 'COCH 8', functional_unit: '008' },
    { unit_number: 'COCH 9', functional_unit: '009' },
    { unit_number: 'COCH 10', functional_unit: '010' },
    { unit_number: 'COCH 11', functional_unit: '011' },
    { unit_number: 'COCH 12', functional_unit: '012' },
    { unit_number: 'COCH 13', functional_unit: '013' },
    { unit_number: 'COCH 14', functional_unit: '014' },
  ];

  for (const garage of garages) {
    const { data: existingGarage } = await supabase
      .from('units')
      .select('id')
      .eq('floor', 'PB')
      .eq('unit_number', garage.unit_number)
      .eq('building_id', BUILDING_ID)
      .single();

    if (!existingGarage) {
      const { error } = await supabase
        .from('units')
        .insert({
          building_id: BUILDING_ID,
          floor: 'PB',
          unit_number: garage.unit_number,
          parking: garage.unit_number,
          functional_unit: garage.functional_unit,
          coefficient: 0.5
        });
      if (error) {
        console.error(`Error creating garage ${garage.unit_number}:`, error.message);
      } else {
        console.log(`Created garage ${garage.unit_number}`);
      }
    } else {
      console.log(`Garage ${garage.unit_number} already exists, skipping.`);
    }
  }

  console.log('\nSeed completed successfully!');
}

seed().catch(console.error);
