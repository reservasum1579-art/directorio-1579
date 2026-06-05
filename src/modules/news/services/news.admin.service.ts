import { createClient } from '@/lib/supabase/server';
import type { Announcement } from '../types/news.types';

export const newsAdminService = {
  /**
   * Obtiene todas las noticias para administración (Solo Server Side)
   */
  async getAllAnnouncements(buildingId: string): Promise<Announcement[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('announcements')
      .select('*, profiles:author_id (first_name, last_name, avatar_url)')
      .eq('building_id', buildingId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting all announcements:', error);
      throw error;
    }
    return data as Announcement[];
  }
};
