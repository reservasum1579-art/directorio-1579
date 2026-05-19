import { MarketplaceBoard } from '@/modules/marketplace/components/MarketplaceBoard';
import { marketplaceService } from '@/modules/marketplace/services/marketplace.service';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace Vecinal',
};

export default async function MarketplacePage() {
  const posts = await marketplaceService.getActivePosts(DEFAULT_BUILDING_ID);
  
  // MOCKED PROFILE TO MATCH LAYOUT
  const profile = {
    first_name: 'Patricio',
    last_name: 'Kenny',
  };

  return (
    <MarketplaceBoard posts={posts} currentProfile={profile} />
  );
}
