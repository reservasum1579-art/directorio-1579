'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Announcement, AnnouncementStatus } from '../types/news.types';

export async function createNewsAction(data: Partial<Announcement> & { image_url?: string }) {
  const supabase = await createClient();
  
  const { data: userAuth } = await supabase.auth.getUser();
  if (!userAuth.user) throw new Error('Not authenticated');

  const { image_url, profiles, announcement_attachments, ...announcementData } = data as any;

  const { data: result, error } = await supabase
    .from('announcements')
    .insert({
      ...announcementData,
      author_id: userAuth.user.id
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating news:', error);
    throw error;
  }

  if (image_url && result) {
    await supabase.from('announcement_attachments').insert({
      announcement_id: result.id,
      file_url: image_url,
      file_type: 'image',
      file_name: 'cover_image'
    });
  }

  revalidatePath('/', 'layout');
  return result;
}

export async function updateNewsAction(id: string, updates: Partial<Announcement> & { image_url?: string }) {
  const supabase = await createClient();
  
  if (updates.status === 'published' && !updates.published_at) {
    updates.published_at = new Date().toISOString();
  }

  const { image_url, profiles, announcement_attachments, ...announcementData } = updates as any;

  const { data: result, error } = await supabase
    .from('announcements')
    .update(announcementData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating news:', error);
    throw error;
  }

  if (image_url) {
    // Delete old attachment if exists
    await supabase.from('announcement_attachments').delete().eq('announcement_id', id);
    // Insert new
    await supabase.from('announcement_attachments').insert({
      announcement_id: id,
      file_url: image_url,
      file_type: 'image',
      file_name: 'cover_image'
    });
  }

  revalidatePath('/', 'layout');
  return result;
}

export async function updateNewsStatusAction(id: string, status: AnnouncementStatus) {
  const supabase = await createClient();
  
  const updates: Partial<Announcement> = { status };
  if (status === 'published') {
    updates.published_at = new Date().toISOString();
  }

  const { data: result, error } = await supabase
    .from('announcements')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating news status:', error);
    throw error;
  }

  revalidatePath('/', 'layout');
  return result;
}

export async function deleteNewsAction(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting news:', error);
    throw error;
  }

  revalidatePath('/', 'layout');
  return true;
}
