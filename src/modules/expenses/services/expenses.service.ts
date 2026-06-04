import { createClient } from '@/lib/supabase/server';

export const expensesService = {
  /**
   * Obtiene la unidad y la cochera (si tiene) asociadas al perfil del usuario
   */
  async getUserUnits(userId: string) {
    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('unit_id, garage_id')
      .eq('id', userId)
      .single();
    if (error) throw error;
    const units = [profile.unit_id];
    if (profile.garage_id) units.push(profile.garage_id);
    return units;
  },

  /**
   * Obtiene la liquidación actual para una unidad funcional
   */
  async getCurrentExpense(unitId: string) {
    const supabase = await createClient();
    
    // Obtener los últimos 2 períodos únicos (mes/año) para calcular variación del fondo de reserva
    const { data: rawPeriods, error: periodError } = await supabase
      .from('expenses_periods')
      .select(`
        *,
        expense_categories (*)
      `)
      .order('period_year', { ascending: false })
      .order('period_month', { ascending: false })
      .limit(5); // traer algunos extra por si hay duplicados

    if (periodError || !rawPeriods || rawPeriods.length === 0) {
      return null;
    }

    // Filtrar duplicados manteniendo el más reciente (el primero en la lista)
    const uniquePeriods: any[] = [];
    const seen = new Set();
    for (const p of rawPeriods) {
      const key = `${p.period_month}-${p.period_year}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniquePeriods.push(p);
      }
      if (uniquePeriods.length === 2) break; // sólo nos interesan los dos últimos únicos
    }

    const latestPeriod = uniquePeriods[0];
    const previousPeriod = uniquePeriods[1] || null;

    // Obtener la porción específica de esta unidad
    const { data: unitExpense, error: unitError } = await supabase
      .from('unit_expenses')
      .select('*')
      .eq('expense_period_id', latestPeriod.id)
      .eq('unit_id', unitId)
      .single();

    if (unitError || !unitExpense) {
      return null;
    }

    return {
      period: latestPeriod,
      previousPeriod,
      unitExpense: unitExpense
    };
  },

  /**
   * Obtiene el historial de expensas de los últimos 6 meses para un departamento
   */
  async getExpenseHistory(unitId: string, limit = 6) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('unit_expenses')
      .select(`
        *,
        expenses_periods (*)
      `)
      .eq('unit_id', unitId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching expense history:', error);
      return [];
    }
    
    return data;
  },
  
  /**
   * Registra el pago en la base de datos de un vecino
   */
  async submitPayment(unitId: string, periodId: string, amount: number, receiptUrl: string, userId: string) {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('expense_payments')
      .insert({
        unit_id: unitId,
        expense_period_id: periodId,
        user_id: userId,
        amount,
        payment_date: new Date().toISOString(),
        receipt_url: receiptUrl,
        status: 'pending_review'
      });
      
    if (error) throw error;
  }
  ,
  /**
   * Obtiene los detalles de una liquidación (unit expenses) por ID de periodo
   */
  async getExpenseDetails(expensePeriodId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('unit_expenses')
      .select('*, units(*)')
      .eq('expense_period_id', expensePeriodId);
    if (error) throw error;
    return data || [];
  }
  ,
  async verifyPayment(unitExpenseId: string) {
    const supabase = await createClient();
    const { error } = await supabase
      .from('unit_expenses')
      .update({ status: 'paid', payment_date: new Date().toISOString() })
      .eq('id', unitExpenseId);
    if (error) throw error;
  }
  ,
  async getBuildingExpenses(buildingId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('expenses_periods')
      .select('*')
      .eq('building_id', buildingId)
      .order('period_year', { ascending: false })
      .order('period_month', { ascending: false })
      .limit(12);
    if (error) throw error;
    return data || [];
  }
  ,
  async getExpenseAnalysis(expensePeriodId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('expense_analysis')
      .select('*')
      .eq('period_id', expensePeriodId)
      .single();
    if (error) throw error;
    return data;
  }
  ,
  async getHistoricalData() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('expenses_periods')
      .select('*')
      .order('period_year', { ascending: false })
      .order('period_month', { ascending: false })
      .limit(5);
    if (error) throw error;
    return data || [];
  }
  ,
  /**
   * Obtiene los gastos (unit expenses) para una unidad específica.
   */
  async getUnitExpenses(unitId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('unit_expenses')
      .select('*, expenses_periods (*)')
      .eq('unit_id', unitId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
  ,
  /**
   * Sube un comprobante de pago y asocia la URL al unit expense.
   */
  async uploadPaymentProof(unitExpenseId: string, file: File) {
    const supabase = await createClient();
    // Assuming a storage bucket named 'payment_proofs'
    const filePath = `proofs/${unitExpenseId}/${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('payment_proofs')
      .upload(filePath, file);
    if (uploadError) throw uploadError;
    const fileUrl = supabase.storage.from('payment_proofs').getPublicUrl(filePath).data.publicUrl;
    const { error: updateError } = await supabase
      .from('unit_expenses')
      .update({ payment_proof_url: fileUrl })
      .eq('id', unitExpenseId);
    if (updateError) throw updateError;
  }
};
