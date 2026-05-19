'use client';

import { OWNERS } from '@/constants/owners';

export interface UnitDetail {
  id: string;
  floor: string;
  unit: string;
  is_active: boolean;
  parking?: string;
  functional_unit: string;
  occupants: {
    name: string;
    email: string;
    phone: string;
    relationship: 'owner' | 'tenant' | 'family' | 'authorized';
    is_primary: boolean;
  }[];
  pets: { type: string; name: string }[];
  vehicles: { brand: string; model: string; plate: string }[];
}

// Transform real owners to UI-friendly units
const REAL_UNITS: UnitDetail[] = OWNERS.map(owner => {
  // Parse floor and unit from name like "6° C"
  const floorMatch = owner.unit.match(/(\d+)°/);
  const floor = floorMatch ? floorMatch[1] : owner.unit;
  const unit = owner.unit.includes('°') ? owner.unit.split(' ')[1] : '';

  return {
    id: owner.id,
    floor: floor,
    unit: unit || owner.unit,
    parking: owner.parking,
    functional_unit: owner.functional_unit,
    is_active: true,
    occupants: [
      { 
        name: owner.name, 
        email: `${owner.name.toLowerCase().replace(/\s+/g, '.')}@example.com`, 
        phone: '11 ---- ----', 
        relationship: 'owner', 
        is_primary: true 
      }
    ],
    pets: owner.name === 'Patricio Kenny' ? [{ type: 'Perro', name: 'Rocco' }] : [],
    vehicles: owner.parking ? [{ brand: 'Consultar', model: 'Declarado', plate: '--- ---' }] : []
  };
});

export const unitsAdminService = {
  async getAllUnits(): Promise<UnitDetail[]> {
    // Artificial delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return REAL_UNITS;
  }
};
