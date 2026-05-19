import { AdminNewsManager } from '@/modules/news/components/AdminNewsManager';
import { newsAdminService } from '@/modules/news/services/news.admin.service';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Noticias | Admin',
};

export default async function AdminNewsPage() {
  const news = await newsAdminService.getAllAnnouncements(DEFAULT_BUILDING_ID);

  return (
    <AdminNewsManager initialNews={news} />
  );
}
