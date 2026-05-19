import type { MarketplacePost } from '../types/marketplace.types';

export const marketplaceService = {
  /**
   * Obtiene todos los posteos aprobados (y no vendidos) del marketplace para un edificio
   */
  async getActivePosts(buildingId: string): Promise<MarketplacePost[]> {
    // MOCK DATA FOR DEMO
    return [
      {
        id: '1',
        building_id: buildingId,
        user_id: 'user1',
        title: 'Alquiler Cochera N° 45 - Subsuelo 1',
        description: 'Cochera amplia, entra una camioneta grande. Muy cerca del ascensor de la Torre A. Alquiler mensual.',
        price: 35000,
        category: 'Cocheras',
        is_service: true,
        status: 'approved',
        moderated_by: 'admin',
        moderated_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          first_name: 'Martín',
          last_name: 'Gómez',
          avatar_url: null,
        },
        marketplace_images: [{
          id: 'img1', post_id: '1', image_url: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=600&auto=format&fit=crop', sort_order: 0, created_at: new Date().toISOString()
        }],
      },
      {
        id: '2',
        building_id: buildingId,
        user_id: 'user2',
        title: 'Bicicleta Olmo Rodado 29',
        description: 'Casi sin uso, la compré hace 6 meses y la usé dos veces. Tiene frenos a disco y cambios Shimano.',
        price: 180000,
        category: 'Productos',
        is_service: false,
        status: 'approved',
        moderated_by: 'admin',
        moderated_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          first_name: 'Lucía',
          last_name: 'Fernández',
          avatar_url: null,
        },
        marketplace_images: [{
          id: 'img2', post_id: '2', image_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop', sort_order: 0, created_at: new Date().toISOString()
        }],
      },
      {
        id: '3',
        building_id: buildingId,
        user_id: 'user3',
        title: 'Servicio de Electricidad y Mantenimiento',
        description: 'Realizo reparaciones eléctricas menores en los departamentos. Cambio de tomas, instalación de luminarias, etc.',
        price: null,
        category: 'Servicios',
        is_service: true,
        status: 'approved',
        moderated_by: 'admin',
        moderated_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 259200000).toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          first_name: 'Carlos',
          last_name: 'Electricista',
          avatar_url: null,
        },
        marketplace_images: [{
          id: 'img3', post_id: '3', image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop', sort_order: 0, created_at: new Date().toISOString()
        }],
      },
      {
        id: '4',
        building_id: buildingId,
        user_id: 'user4',
        title: 'Plomero de confianza (Roberto)',
        description: 'Vino a arreglar una pérdida en el baño y trabajó de diez. Muy prolijo y precio razonable. Recomendado!',
        price: null,
        category: 'Sugerencias',
        is_service: true,
        status: 'approved',
        moderated_by: 'admin',
        moderated_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 345600000).toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          first_name: 'Elena',
          last_name: 'Pérez',
          avatar_url: null,
        },
        marketplace_images: [{
          id: 'img4', post_id: '4', image_url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=600&auto=format&fit=crop', sort_order: 0, created_at: new Date().toISOString()
        }],
      }
    ];
  }
};
