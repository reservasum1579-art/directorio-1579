import { AdminMarketplaceBoard } from '@/modules/marketplace/components/AdminMarketplaceBoard';
import { marketplaceAdminService } from '@/modules/marketplace/services/marketplace.admin.service';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moderación Marketplace | Admin',
};

export default async function AdminMarketplacePage() {
  const posts = await marketplaceAdminService.getAllPosts(DEFAULT_BUILDING_ID);

  return (
    <AdminMarketplaceBoard initialPosts={posts} />
  );
}
