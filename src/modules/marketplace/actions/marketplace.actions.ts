'use server';

import { marketplaceService } from '../services/marketplace.service';

export async function updateMarketplacePostStatusAction(postId: string, status: 'rejected' | 'sold' | 'archived') {
  try {
    await marketplaceService.updatePostStatus(postId, status);
    return { success: true };
  } catch (error) {
    console.error('Action error:', error);
    return { success: false, error: 'No se pudo actualizar el estado.' };
  }
}
