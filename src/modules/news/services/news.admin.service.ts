import type { Announcement, AnnouncementStatus } from '../types/news.types';

export const newsAdminService = {
  /**
   * Obtiene todas las noticias para administración
   */
  async getAllAnnouncements(buildingId: string): Promise<Announcement[]> {
    // MOCK DATA FOR ADMIN
    return [
      {
        id: '1', building_id: buildingId, author_id: 'admin', title: 'Mantenimiento del ascensor principal', content: '...', is_important: true, status: 'published', published_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        profiles: { first_name: 'Admin', last_name: 'Directorio', avatar_url: null }
      },
      {
        id: '2', building_id: buildingId, author_id: 'admin', title: 'Reunión de consorcio mensual', content: '...', is_important: false, status: 'published', published_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        profiles: { first_name: 'Admin', last_name: 'Directorio', avatar_url: null }
      }
    ];
  },

  /**
   * Crea o actualiza una noticia
   */
  async saveAnnouncement(announcement: Partial<Announcement>): Promise<void> {
    console.log('Admin: Guardando noticia', announcement);
  }
};
