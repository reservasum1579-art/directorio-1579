import { createClient } from '@/lib/supabase/server';
import { NewsFeed } from '@/modules/news/components/NewsFeed';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';
import type { Metadata } from 'next';
import type { Announcement } from '@/modules/news/types/news.types';

export const metadata: Metadata = {
  title: 'Noticias y Novedades',
};

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'admin_consorcio';
  }

  // Pre-fetch initial published news server-side (first page)
  const { data: published, count: publishedCount } = await supabase
    .from('announcements')
    .select('*, profiles:author_id(first_name, last_name, avatar_url), announcement_attachments(*)', { count: 'exact' })
    .eq('building_id', DEFAULT_BUILDING_ID)
    .eq('status', 'published')
    .order('is_important', { ascending: false })
    .order('created_at', { ascending: false })
    .range(0, 9);

  return (
    <NewsFeed 
      initialAnnouncements={(published || []) as Announcement[]} 
      totalCount={publishedCount || 0} 
      buildingId={DEFAULT_BUILDING_ID} 
      isAdmin={isAdmin} 
    />
  );
}
