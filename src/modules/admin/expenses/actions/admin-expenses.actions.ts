'use server';

import { createClient } from '@/lib/supabase/server';
import { aiService } from '@/modules/expenses/services/ai.service';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';
import { revalidatePath } from 'next/cache';

export async function extractDataFromPdfAction(base64Pdf: string) {
  try {
    const supabase = await createClient();
    // Validate admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    // Llama al servicio de IA
    const extractedData = await aiService.extractExpensesFromPdf(base64Pdf);
    return { success: true, data: extractedData };
  } catch (error: any) {
    console.error('Error in extractDataFromPdfAction:', error);
    return { success: false, error: error.message || 'Error analizando PDF' };
  }
}

export async function publishExpensesAction(pdfUrl: string, extractedData: any, buildingId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    if (!buildingId) {
      return { success: false, error: 'Error: No se pudo determinar el ID del edificio. Verificá la variable NEXT_PUBLIC_BUILDING_ID.' };
    }

    // 1. Obtener la liquidación anterior para generar el Insight
    const { data: prevPeriod } = await supabase
      .from('expenses_periods')
      .select('*, expense_categories(*)')
      .eq('building_id', buildingId)
      .order('period_year', { ascending: false })
      .order('period_month', { ascending: false })
      .limit(1)
      .single();

    // 1b. Verificar si ya existe un período con el mismo mes/año para este edificio
    const { data: existingPeriod, error: existingError } = await supabase
      .from('expenses_periods')
      .select('id')
      .eq('building_id', buildingId)
      .eq('period_month', extractedData.period_month)
      .eq('period_year', extractedData.period_year)
      .maybeSingle();

    let insights = '';
    if (prevPeriod) {
      insights = (await aiService.generateInsights(extractedData, prevPeriod)) ?? '';

    }

    // 2. Si ya existe el periodo, lo eliminamos y lo volvemos a crear (refacturación)
    let periodId: string;
    if (existingPeriod && existingPeriod.id) {
      // Eliminar relaciones primero para evitar restricciones de FK
      await supabase.from('expense_categories').delete().eq('expense_period_id', existingPeriod.id);
      await supabase.from('expense_payments').delete().eq('expense_period_id', existingPeriod.id);
      // Eliminar el periodo
      const { error: delErr } = await supabase.from('expenses_periods').delete().eq('id', existingPeriod.id);
      if (delErr) throw delErr;
    }
    // Insertar nuevo periodo (ya sea nuevo o después de eliminar el duplicado)
    const { data: newPeriod, error: periodError } = await supabase
      .from('expenses_periods')
      .insert({
        building_id: buildingId,
        period_month: extractedData.period_month,
        period_year: extractedData.period_year,
        total_expenses: extractedData.total_expenses,
        ordinary_expenses: extractedData.ordinary_expenses,
        extraordinary_expenses: extractedData.extraordinary_expenses,
        reserve_fund: extractedData.reserve_fund,
        reserve_funds_detail: extractedData.reserve_funds_detail || null,
        pdf_url: pdfUrl,
        insights_text: insights
      })
      .select()
      .single();
    if (periodError) throw periodError;
    periodId = newPeriod.id;

    // 3. Insertar categorías
    if (extractedData.categories && extractedData.categories.length > 0) {
      const catsToInsert = extractedData.categories.map((c: any) => ({
        expense_period_id: periodId,
        category_name: c.name,
        amount: c.amount,
        percentage: (c.amount / extractedData.total_expenses) * 100
      }));
      await supabase.from('expense_categories').insert(catsToInsert);
    }

    // 4. Distribuir entre las unidades usando su coeficiente
    const { data: units } = await supabase
      .from('units')
      .select('id, coefficient')
      .eq('building_id', buildingId);

    if (units && units.length > 0) {
      const unitExpensesToInsert = units.map(unit => ({
        expense_period_id: periodId,
        unit_id: unit.id,
        amount: extractedData.total_expenses * (unit.coefficient / 100),
        status: 'pending'
      }));
      await supabase.from('unit_expenses').insert(unitExpensesToInsert);
    }

    revalidatePath('/expenses');
    revalidatePath('/admin/expenses');

    return { success: true };
  } catch (error: any) {
    console.error('Error in publishExpensesAction:', error);
    return { success: false, error: error.message };
  }
}

export async function verifyExpensePaymentAction(paymentId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };
    
    const { error: pmtError, data: payment } = await supabase
      .from('expense_payments')
      .update({ status: 'approved' })
      .eq('id', paymentId)
      .select('unit_id, expense_period_id, amount')
      .single();

    if (pmtError || !payment) throw pmtError || new Error('Pago no encontrado');

    // Marcar la expensa de esa unidad como pagada
    const { error: unitErr } = await supabase
      .from('unit_expenses')
      .update({ status: 'paid', balance: 0 })
      .eq('unit_id', payment.unit_id)
      .eq('expense_period_id', payment.expense_period_id);
    
    if (unitErr) throw unitErr;

    revalidatePath('/admin/expenses/payments');
    return { success: true };
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return { success: false, error: error.message };
  }
}
