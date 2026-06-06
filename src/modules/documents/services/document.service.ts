import { createClient } from '@/lib/supabase/client';
import type { BuildingDocument } from '../types/document.types';

export const documentService = {
  async getDocuments(buildingId: string): Promise<BuildingDocument[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('building_documents')
      .select('*')
      .eq('building_id', buildingId)
      .order('period_year', { ascending: false })
      .order('period_month', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return [];
    }

    return data as BuildingDocument[];
  }
};
