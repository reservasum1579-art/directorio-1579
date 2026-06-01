import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MarketplaceBoard } from '@/modules/marketplace/components/MarketplaceBoard';
import { marketplaceService } from '@/modules/marketplace/services/marketplace.service';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Marketplace Vecinal',
};

export default async function MarketplacePage() {
  const supabase = await createClient();
  
  // Obtener el usuario autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Obtener el perfil real
  const { data: profileData } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, role, floor, unit')
    .eq('id', user.id)
    .single();

  const posts = await marketplaceService.getActivePosts(DEFAULT_BUILDING_ID);
  
  // Formateamos el perfil real para pasarlo al componente
  const profile = {
    id: user.id,
    first_name: profileData?.first_name || 'Vecino',
    last_name: profileData?.last_name || '',
    role: profileData?.role || 'user',
    floor: profileData?.floor || '',
    unit: profileData?.unit || '',
  };

  return (
    <MarketplaceBoard posts={posts} currentProfile={profile} />
  );
}
