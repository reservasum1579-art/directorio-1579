import { createClient } from '@/lib/supabase/client';

export interface UnitDetail {
  id: string;
  floor: string;
  unit: string;
  is_active: boolean;
  parking?: string;
  functional_unit: string;
  occupants: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    relationship: 'owner' | 'tenant' | 'family' | 'authorized';
    is_primary: boolean;
  }[];
  pets: { id?: string; type: string; name: string }[];
  vehicles: { id?: string; brand: string; model: string; plate: string }[];
}

export const unitsAdminService = {
  async getAllUnits(): Promise<UnitDetail[]> {
    const supabase = createClient();
    const BUILDING_ID = process.env.NEXT_PUBLIC_BUILDING_ID || '';

    // Fetch units (no filter by building_id needed, single building setup)
    const { data: unitsData, error: unitsError } = await supabase
      .from('units')
      .select('*')
      .order('floor')
      .order('unit_number');

    if (unitsError || !unitsData) return [];

    // Fetch primary profiles attached to units
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone, unit_id');

    // Fetch extra details
    const [{ data: occupants }, { data: pets }, { data: vehicles }] = await Promise.all([
      supabase.from('unit_occupants').select('*'),
      supabase.from('unit_pets').select('*'),
      supabase.from('unit_vehicles').select('*')
    ]);

    const mappedUnits: UnitDetail[] = unitsData.map((u: any) => {
      const unitOccupants = (occupants || []).filter((o: any) => o.unit_id === u.id);
      const unitPets = (pets || []).filter((p: any) => p.unit_id === u.id);
      const unitVehicles = (vehicles || []).filter((v: any) => v.unit_id === u.id);

      // Add the primary owner from profiles if assigned
      const ownerProfile = (profiles || []).find((p: any) => p.unit_id === u.id);
      
      const allOccupants = [...unitOccupants];
      if (ownerProfile && !allOccupants.some(o => o.email === ownerProfile.email)) {
        allOccupants.unshift({
          name: ownerProfile.full_name || ownerProfile.email,
          email: ownerProfile.email,
          phone: ownerProfile.phone || '',
          relationship: 'owner',
          is_primary: true
        });
      }

      return {
        id: u.id,
        floor: u.floor,
        unit: u.unit_number,
        is_active: true, // Mocked as true or derive from logic
        parking: u.parking || '',
        functional_unit: u.functional_unit || '',
        occupants: allOccupants,
        pets: unitPets,
        vehicles: unitVehicles
      };
    });

    return mappedUnits;
  },

  async updateUnitDetails(unitId: string, updates: Partial<UnitDetail>): Promise<void> {
    const supabase = createClient();

    // Update unit base details
    if (updates.parking !== undefined || updates.functional_unit !== undefined) {
      await supabase
        .from('units')
        .update({
          parking: updates.parking,
          functional_unit: updates.functional_unit
        })
        .eq('id', unitId);
    }

    // Replace pets (delete all, insert new)
    if (updates.pets !== undefined) {
      await supabase.from('unit_pets').delete().eq('unit_id', unitId);
      if (updates.pets.length > 0) {
        await supabase.from('unit_pets').insert(
          updates.pets.map(p => ({ unit_id: unitId, type: p.type, name: p.name }))
        );
      }
    }

    // Replace vehicles
    if (updates.vehicles !== undefined) {
      await supabase.from('unit_vehicles').delete().eq('unit_id', unitId);
      if (updates.vehicles.length > 0) {
        await supabase.from('unit_vehicles').insert(
          updates.vehicles.map(v => ({ unit_id: unitId, brand: v.brand, model: v.model, plate: v.plate }))
        );
      }
    }

    // Replace occupants
    if (updates.occupants !== undefined) {
      await supabase.from('unit_occupants').delete().eq('unit_id', unitId);
      // Guardar todos los ocupantes que hayan editado (el backend/BD maneja todo)
      const occupantsToSave = updates.occupants;
      if (occupantsToSave.length > 0) {
        // Enforce at least one primary occupant if none is set
        if (!occupantsToSave.some(o => o.is_primary)) {
          occupantsToSave[0].is_primary = true;
        }

        await supabase.from('unit_occupants').insert(
          occupantsToSave.map(o => ({
            unit_id: unitId,
            name: o.name,
            email: o.email,
            phone: o.phone,
            relationship: o.relationship,
            is_primary: o.is_primary || false
          }))
        );
      }
    }
  }
};
