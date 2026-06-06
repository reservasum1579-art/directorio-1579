'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createDocumentRecordAction(data: {
  building_id: string;
  title: string;
  file_url: string;
  file_name: string;
  period_month: number;
  period_year: number;
}) {
  const supabase = await createClient();
  const { data: userAuth } = await supabase.auth.getUser();
  if (!userAuth.user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('building_documents')
    .insert({
      ...data,
      uploaded_by: userAuth.user.id,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error creating document record:', error);
    throw error;
  }

  revalidatePath('/documents');
  revalidatePath('/admin/documents');
}

export async function deleteDocumentRecordAction(id: string, fileName: string) {
  const supabase = await createClient();
  
  // 1. Delete from DB
  const { error: dbError } = await supabase
    .from('building_documents')
    .delete()
    .eq('id', id);

  if (dbError) {
    console.error('Error deleting document record:', dbError);
    throw dbError;
  }

  // 2. Delete from storage (we can use the admin client or let the client do it, but here server is fine)
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([fileName]);

  if (storageError) {
    console.error('Error deleting file from storage:', storageError);
    // Even if storage fails, we already deleted DB record, so it won't show up.
  }

  revalidatePath('/documents');
  revalidatePath('/admin/documents');
}
