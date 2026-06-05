'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSumRulesAction(buildingId: string, ruleKey: string, ruleValue: any) {
  const supabase = await createClient();
  
  const { data: userAuth } = await supabase.auth.getUser();
  if (!userAuth.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('sum_rules')
    .upsert({
      building_id: buildingId,
      rule_key: ruleKey,
      rule_value: ruleValue,
      updated_by: userAuth.user.id,
      updated_at: new Date().toISOString()
    }, { onConflict: 'building_id, rule_key' })
    .select()
    .single();

  if (error) {
    console.error(`Error updating sum rule ${ruleKey}:`, error);
    throw error;
  }

  revalidatePath('/admin/sum');
  revalidatePath('/sum');
  return data;
}
