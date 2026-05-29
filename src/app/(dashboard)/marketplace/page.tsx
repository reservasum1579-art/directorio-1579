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
    id: 'admin-user-id', // ID falso para simular usuario
    first_name: 'Patricio',
    last_name: 'Kenny',
    role: 'admin', // Simular rol admin para probar el borrado
    floor: '6',
    unit: 'C',
  };

  return (
    <MarketplaceBoard posts={posts} currentProfile={profile} />
  );
}
