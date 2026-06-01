import { createClient } from '@/lib/supabase/server';

export const marketplaceService = {
  /**
   * Obtiene todos los posteos aprobados (y los vendidos recientemente) del marketplace para un edificio
   */
  async getActivePosts(buildingId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('marketplace_posts')
      .select(`
        *,
        profiles!marketplace_posts_user_id_fkey ( first_name, last_name, floor, unit, phone ),
        marketplace_images ( id, image_url, sort_order )
      `)
      .eq('building_id', buildingId)
      .in('status', ['approved', 'sold'])
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching marketplace posts:', error);
      return [];
    }
    
    // Filter out sold posts older than 15 days
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    
    return (data || []).filter(post => {
      if (post.status === 'sold') {
        return new Date(post.updated_at) >= fifteenDaysAgo;
      }
      return true;
    });
  },

  /**
   * Actualiza el estado de una publicación
   */
  async updatePostStatus(postId: string, status: 'rejected' | 'sold' | 'archived') {
    const supabase = await createClient();
    const { error } = await supabase
      .from('marketplace_posts')
      .update({ status })
      .eq('id', postId);
      
    if (error) {
      console.error('Error updating post status:', error);
      throw error;
    }
  },

  /**
   * Crea una nueva publicación
   */
  async createPost(postData: any, images: string[]) {
    const supabase = await createClient();
    
    // Insert post
    const { data: newPost, error: postError } = await supabase
      .from('marketplace_posts')
      .insert({
        building_id: postData.building_id,
        user_id: postData.user_id,
        title: postData.title,
        description: postData.description,
        price: postData.price,
        category: postData.category,
        is_service: postData.category === 'Servicios' || postData.category === 'Sugerencias',
        status: 'approved',
      })
      .select()
      .single();

    if (postError) {
      console.error('Error creating marketplace post:', postError);
      throw postError;
    }

    // Insert images
    if (images && images.length > 0) {
      const imageRecords = images.map((url, index) => ({
        post_id: newPost.id,
        image_url: url,
        sort_order: index
      }));

      const { error: imagesError } = await supabase
        .from('marketplace_images')
        .insert(imageRecords);

      if (imagesError) {
        console.error('Error inserting marketplace images:', imagesError);
      }
    }

    return newPost;
  }
};
