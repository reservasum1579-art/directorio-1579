import { createClient } from '@/lib/supabase/client';
import type { Announcement, AnnouncementStatus } from '../types/news.types';

export const newsService = {
  /**
   * Obtiene noticias con paginación y filtro por estado.
   */
  async getAnnouncements(
    buildingId: string,
    options?: {
      status?: AnnouncementStatus | AnnouncementStatus[];
      limit?: number;
      offset?: number;
    }
  ): Promise<{ data: Announcement[], count: number }> {
    const supabase = createClient();
    
    let query = supabase
      .from('announcements')
      .select(`
        *,
        profiles:author_id (first_name, last_name, avatar_url),
        announcement_attachments (*)
      `, { count: 'exact' })
      .eq('building_id', buildingId)
      // Urgent news first, then newest
      .order('is_important', { ascending: false })
      .order('created_at', { ascending: false });

    if (options?.status) {
      if (Array.isArray(options.status)) {
        query = query.in('status', options.status);
      } else {
        query = query.eq('status', options.status);
      }
    }

    const limit = options?.limit ?? 10;
    const offset = options?.offset ?? 0;

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
    
    return { data: data as Announcement[], count: count || 0 };
  },

  /**
   * Crea una nueva noticia.
   * Supabase RLS rechazará si un no-admin intenta crear una noticia 'published' o 'is_important=true'.
   */
  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    const supabase = createClient();
    const { data: result, error } = await supabase
      .from('announcements')
      .insert({ ...data })
      .select()
      .single();

    if (error) throw error;
    return result as Announcement;
  },

  /**
   * Actualiza el estado o contenido de una noticia.
   */
  async updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement> {
    const supabase = createClient();
    const { data: result, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result as Announcement;
  },

  /**
   * Elimina una noticia.
   */
  async deleteAnnouncement(id: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
