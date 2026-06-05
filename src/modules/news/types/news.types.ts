export type AnnouncementStatus = 'draft' | 'pending' | 'published' | 'archived';

export interface AnnouncementAttachment {
  id: string;
  announcement_id: string;
  file_url: string;
  file_type: string | null;
  file_name: string | null;
  created_at: string;
}

export interface Announcement {
  id: string;
  building_id: string;
  author_id: string | null;
  title: string;
  content: string;
  is_important: boolean;
  status: AnnouncementStatus;
  event_date?: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;

  // Joined properties
  profiles?: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  announcement_attachments?: AnnouncementAttachment[];
}
