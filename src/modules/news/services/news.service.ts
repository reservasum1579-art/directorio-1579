import { createClient } from '@/lib/supabase/client';
import type { Announcement } from '../types/news.types';

export const newsService = {
  /**
   * Obtiene todas las noticias publicadas para un edificio, ordenadas de las más recientes a las más antiguas.
   */
  async getPublishedAnnouncements(buildingId: string): Promise<Announcement[]> {
    // MOCK DATA FOR DEMO
    return [
      {
        id: '1',
        building_id: buildingId,
        author_id: 'mock',
        title: 'New Security Rules',
        content: 'Enhanced biometric access protocols are being implemented at all main entrance points starting next Monday. Please ensure your digital profile is updated.',
        is_important: true,
        status: 'published',
        published_at: '2023-10-24T10:00:00Z',
        created_at: '2023-10-24T10:00:00Z',
        updated_at: '2023-10-24T10:00:00Z',
        announcement_attachments: [{
          id: 'att1',
          announcement_id: '1',
          file_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2qhz9wWfW7iuZCDnOjZ502ELhrBkPaTpT_m5-x0uKmSSKJqlWenzg1HN6_P3hjSIPtJDZJ5G-GzeCiCah22FsEBISat0N6K1oxmqCtOSXnb48IwE_mDbdIcS-SPQRakxn2yNecBSb11BEe9TSixlL5Hbinve43V7N-QYFGMwlhthzFAlWy0juQ9FXfFEM6M_HCEqb8Udi8aCPbSm2fWkZ4-5GKcnJzLGqNbfI9udaBWkiRT0jFvVIwl-mZI8eWX3CfLWMgI9fNIM5',
          file_type: 'image/jpeg',
          file_name: 'security.jpg',
          created_at: '2023-10-24T10:00:00Z'
        }]
      },
      {
        id: '2',
        building_id: buildingId,
        author_id: 'mock',
        title: 'Pool Opening Schedule',
        content: 'The rooftop infinity pool will transition to summer hours. Morning swimming will now be available from 5:00 AM for all residents.',
        is_important: false,
        status: 'published',
        published_at: '2023-10-22T10:00:00Z',
        created_at: '2023-10-22T10:00:00Z',
        updated_at: '2023-10-22T10:00:00Z'
      },
      {
        id: '3',
        building_id: buildingId,
        author_id: 'mock',
        title: 'Next Assembly Meeting',
        content: 'The annual general assembly will take place in the Main Hall. Discussion topics include budget allocation for the new smart energy grid.',
        is_important: false,
        status: 'published',
        published_at: '2023-10-20T10:00:00Z',
        created_at: '2023-10-20T10:00:00Z',
        updated_at: '2023-10-20T10:00:00Z'
      },
      {
        id: '4',
        building_id: buildingId,
        author_id: 'mock',
        title: 'Elevator Maintenance: Tower B',
        content: 'Preventative maintenance on elevator #4 will take place between 10 PM and 2 AM. Residents are advised to use alternate service lifts.',
        is_important: false,
        status: 'published',
        published_at: '2023-10-18T10:00:00Z',
        created_at: '2023-10-18T10:00:00Z',
        updated_at: '2023-10-18T10:00:00Z'
      }
    ];
  }
};
