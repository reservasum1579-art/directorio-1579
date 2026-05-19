import type { MarketplacePost, MarketplacePostStatus } from '../types/marketplace.types';

export const marketplaceAdminService = {
  /**
   * Obtiene todos los anuncios del marketplace con cualquier estado (para administración)
   */
  async getAllPosts(buildingId: string): Promise<MarketplacePost[]> {
    // MOCK DATA FOR ADMIN DEMO
    return [
      {
        id: '1', building_id: buildingId, user_id: 'u1', title: 'Alquiler Cochera N° 45', description: '...', price: 35000, category: 'Cocheras', is_service: true, status: 'approved', moderated_by: 'admin', moderated_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        profiles: { first_name: 'Martín', last_name: 'Gómez', avatar_url: null }
      },
      {
        id: 'pending-1', building_id: buildingId, user_id: 'u2', title: 'Venta de Mueble de Cocina', description: 'Mueble de pino, buen estado. Medidas 1.20x0.60.', price: 45000, category: 'Productos', is_service: false, status: 'pending', moderated_by: null, moderated_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        profiles: { first_name: 'Elena', last_name: 'Pérez', avatar_url: null }
      },
      {
        id: 'pending-2', building_id: buildingId, user_id: 'u3', title: 'Clases de Yoga', description: 'Ofrezco clases personalizadas en el SUM los martes y jueves.', price: 5000, category: 'Servicios', is_service: true, status: 'pending', moderated_by: null, moderated_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        profiles: { first_name: 'Sofia', last_name: 'Luna', avatar_url: null }
      }
    ];
  },

  /**
   * Actualiza el estado de un anuncio (moderación)
   */
  async updatePostStatus(postId: string, status: MarketplacePostStatus, adminId: string): Promise<void> {
    console.log(`Moderación: Post ${postId} actualizado a ${status} por ${adminId}`);
    // En una implementación real aquí iría la llamada a Supabase
  }
};
