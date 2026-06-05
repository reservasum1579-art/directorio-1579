import fs from 'fs';

const text = `001 COCH 1 LEON SUSANA 37.800,01
002 COCH 2 CHOI MICAELA 37.800,02
003 COCH 3 BONFILI DAMIAN 37.800,03
004 COCH 4 PACHECO JOSE 37.800,04
005 COCH 5 CASTIGLIA NICOL 37.800,05
006 COCH 6 BARSAMAYAN SEBA 37.800,06
007 COCH 7 MARZELLA NESTOR 37.800,07
008 COCH 8 PONTIERI MARIA 37.800,08
009 COCH 9 PANE ARNALDO 37.800,09
010 COCH 10 LASCA 37.800,10
011 COCH 11 FLORIO ALBERTO 37.800,11
012 COCH 12 FABIANO CARLA 37.800,12
013 COCH 13 SPOSATO PABLO 37.800,13
014 COCH 14 CASTIGLIA FLORE 34.650,14
015 1° A MUÑOZ LORENA 369.600,15
016 1° B BUCCIARDI JORGE 149.100,16
017 1° A PONTIERI MARIA 837.900,17
018 1° A ALVAREZ RODRIGO 385.350,18
019 1° B SERVENTE ANA 168.000,19
020 2° C CONCILIO DANIEL 380.100,20
021 2° D RODRIGUEZ MARCO 168.000,21
022 3° A MARZELLA JORGE 385.350,22
023 3° B FABIANO CARLA 168.000,23
024 3° C RODRIGUEZ M 380.100,24
025 3° D POCQUET CECILIA 168.000,25
026 4° A RODRIGUEZ MARCOS 385.350,26
027 4° B CALLIPARI DANIEL 168.000,27
028 4° C GOIOSA ALEXAND 380.100,28
029 4° D PAIK VICTOR 168.000,29
030 5° A GERACE/ PANE 385.350,30
031 5° B ORTS EDUARDO 168.000,31
032 5° C NOYA VICTORIA 380.100,32
033 5° D GIOACCHINI GUIL 168.000,33
034 6° A BARSAMAYAN SEBA 410.350,34
035 6° B CARRINO BEATRIZ 168.000,35
036 6° C LEON SUSANA 380.100,36
037 6° D SUAREZ GRACIELA 168.000,37
038 7° A BONFILI DAMIAN 385.350,38
039 7° B WESTREPP FLOREN 168.000,39
040 7° C SPOSATO PABLO 380.100,40
041 7° D CHOI MICAELA 168.000,41
042 8° A CASTIGLIA FLORE 364.350,42
043 8° B WADDLE GERMAN 149.100,43
044 8° C LASCA 380.100,44
045 8° D KURINGUIAN GRAC 193.000,45
046 9° A PACHECO JOSE 433.650,46
047 9° C CASTIGLIA NICOL 364.350,47
048 9° D CARELLA GUSTAVO 605.250,15`;

const lines = text.split('\n');
const results = [];
let unitMap = {};

// Default letters per floor (A, C, D if B doesn't exist? No, let's just assign unique ones so it doesn't crash)
// Let's use the exact names from text, but if we see duplicates, we add an asterisk or something, or increment.
const floorCounters = {};

for (const line of lines) {
  const match = line.match(/^(\d{3})\s+([0-9]°\s*[A-D]|COCH\s*\d+)\s+([a-zA-Z\s\/]+?)\s+\d{1,3}\.\d{3}/);
  if (match) {
    const uf = match[1];
    let dpto = match[2];
    const name = match[3].trim();
    
    // Corrección manual según datos reales del edificio:
    // 016=1C, 017=1D, 018=2A, 019=2B (en lugar de repetir 1A/1B)
    if (uf === '016') dpto = '1° C';
    if (uf === '017') dpto = '1° D';
    if (uf === '018') dpto = '2° A';
    if (uf === '019') dpto = '2° B';
    
    // Garantizar unicidad
    let floor = 'PB';
    let unit = dpto;
    if (dpto.includes('°')) {
      const parts = dpto.split('°');
      floor = parts[0].trim();
      unit = parts[1].trim();
    }
    
    const key = `${floor}-${unit}`;
    if (unitMap[key]) {
      // Find next available letter
      const letters = ['A','B','C','D','E','F'];
      let idx = 0;
      while (unitMap[`${floor}-${letters[idx]}`]) {
        idx++;
      }
      unit = letters[idx];
      dpto = `${floor}° ${unit}`;
    }
    unitMap[`${floor}-${unit}`] = true;
    
    results.push({ uf, dpto, floor, unit, name });
  }
}

const BUILDING_ID = 'b0000000-0000-0000-0000-000000000001';

let sql = `-- ==========================================================\n`;
sql += `-- RECONSTRUCCION COMPLETA DESDE EXPENSAS\n`;
sql += `-- ==========================================================\n\n`;

// 1. Desvincular perfiles para evitar FK errors
sql += `-- Paso 1: Desvincular perfiles de unidades\n`;
sql += `UPDATE public.profiles SET unit_id = NULL, garage_id = NULL;\n\n`;

// 2. Borrar datos dependientes primero
sql += `-- Paso 2: Borrar ocupantes, mascotas, vehículos\n`;
sql += `DELETE FROM public.unit_occupants;\n`;
sql += `DELETE FROM public.unit_pets;\n`;
sql += `DELETE FROM public.unit_vehicles;\n\n`;

// 3. Borrar unidades
sql += `-- Paso 3: Borrar unidades\n`;
sql += `DELETE FROM public.units;\n\n`;

// 4. Insertar el edificio (o actualizar si ya existe)
sql += `-- Paso 4: Crear edificio principal\n`;
sql += `INSERT INTO public.buildings (id, name, address)\n`;
sql += `VALUES ('${BUILDING_ID}', 'Directorio 1579', 'Avenida 1579')\n`;
sql += `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;\n\n`;

sql += `-- Paso 5: Insertar unidades y propietarios\n`;

for (const r of results) {
  const email = `${r.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`;
  
  const parking = r.floor === 'PB' ? `'${r.dpto}'` : 'NULL';
  const coef = r.floor === 'PB' ? 0.36 : 1.5;
  const nameSafe = r.name.replace(/'/g, "''");
  
  sql += `\n-- Unidad UF ${r.uf} (${r.dpto}) - ${r.name}\n`;
  sql += `INSERT INTO public.units (building_id, floor, unit_number, parking, functional_unit, coefficient)\n`;
  sql += `VALUES ('${BUILDING_ID}', '${r.floor}', '${r.unit}', ${parking}, '${r.uf}', ${coef});\n\n`;

  sql += `INSERT INTO public.unit_occupants (unit_id, name, email, phone, relationship, is_primary)\n`;
  sql += `SELECT id, '${nameSafe}', '${email}', '11 ---- ----', 'owner', true\n`;
  sql += `FROM public.units WHERE functional_unit = '${r.uf}' LIMIT 1;\n`;
}

fs.writeFileSync('rebuild_from_expenses.sql', sql);
console.log('SQL generated with', results.length, 'records.');
