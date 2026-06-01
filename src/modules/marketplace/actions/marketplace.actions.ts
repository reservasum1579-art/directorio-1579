'use server';

import { marketplaceService } from '../services/marketplace.service';
import { revalidatePath } from 'next/cache';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export async function updateMarketplacePostStatusAction(postId: string, status: 'rejected' | 'sold' | 'archived') {
  try {
    await marketplaceService.updatePostStatus(postId, status);
    revalidatePath('/marketplace');
    return { success: true };
  } catch (error) {
    console.error('Action error:', error);
    return { success: false, error: 'No se pudo actualizar el estado.' };
  }
}

export async function createMarketplacePostAction(formData: any, images: string[]) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Debes iniciar sesión para publicar en el marketplace.' };
    }

    // Si no viene building_id, usamos el por defecto
    if (!formData.building_id) {
      formData.building_id = DEFAULT_BUILDING_ID;
    }
    
    // Usamos el ID real del usuario autenticado
    formData.user_id = user.id;

    const post = await marketplaceService.createPost(formData, images);
    revalidatePath('/marketplace');
    return { success: true, post };
  } catch (error: any) {
    console.error('Action error:', error);
    return { success: false, error: error.message || 'No se pudo crear la publicación.' };
  }
}
