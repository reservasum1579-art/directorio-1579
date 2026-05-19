import { createClient } from '@/lib/supabase/server';
import { NewsFeed } from '@/modules/news/components/NewsFeed';
import { newsService } from '@/modules/news/services/news.service';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Noticias y Novedades',
};

export default async function NewsPage() {
  // Pre-fetch published news on the server
  const announcements = await newsService.getPublishedAnnouncements(DEFAULT_BUILDING_ID);

  return (
    <NewsFeed announcements={announcements} />
  );
}
