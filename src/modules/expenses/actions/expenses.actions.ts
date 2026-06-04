'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { expensesService } from '../services/expenses.service';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';

export async function submitExpensePaymentAction(unitId: string, periodId: string, amount: number, receiptUrl: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Debes iniciar sesión.' };
    }

    await expensesService.submitPayment(unitId, periodId, amount, receiptUrl, user.id);
    
    // Invalidamos la página de expensas para que el usuario vea el pago pendiente
    revalidatePath('/expenses');
    return { success: true };
  } catch (error: any) {
    console.error('Error in submitExpensePaymentAction:', error);
    return { success: false, error: error.message || 'Error al procesar el pago' };
  }
}
