import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/global.types';

export const authService = {
  async signIn(email: string, password: string) {
    const supabase = createClient();
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email: string, password: string, metadata?: { first_name?: string; last_name?: string }) {
    const supabase = createClient();
    return supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
  },

  async signOut() {
    const supabase = createClient();
    return supabase.auth.signOut();
  },

  async resetPassword(email: string) {
    const supabase = createClient();
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  async getSession() {
    const supabase = createClient();
    return supabase.auth.getSession();
  },

  async getUser() {
    const supabase = createClient();
    return supabase.auth.getUser();
  },
};

export const profileService = {
  async getProfile(): Promise<Profile | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    return data;
  },

  async updateProfile(profileId: string, updates: Partial<Profile>) {
    const supabase = createClient();
    return supabase
      .from('profiles')
      .update(updates)
      .eq('id', profileId)
      .select()
      .single();
  },

  async uploadAvatar(profileId: string, file: File) {
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${profileId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);

    // Update profile with new avatar URL
    await supabase
      .from('profiles')
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', profileId);

    return urlData.publicUrl;
  },
};
