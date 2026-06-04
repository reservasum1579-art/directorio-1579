import { redirect } from 'next/navigation';
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { expensesService } from '@/modules/expenses/services/expenses.service';
import { ExpensesBoard } from '@/modules/expenses/components/ExpensesBoard';
import type { Metadata } from 'next';
import { Card } from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mis Expensas',
};

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default async function ExpensesPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Obtención del perfil para saber la unidad principal y posible cochera
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, unit_id, floor, unit, garage_id, units!profiles_unit_id_fkey(id, floor, unit_number)')
    .eq('id', user.id)
    .single() as any;
  console.log('>>> profile data:', profile);

  const profileUnit = profile?.units 
    ? (Array.isArray(profile.units) ? profile.units[0] : profile.units) 
    : null;

  // --- Resolución de unidad principal ---
  // 1. Intentar unit_id directo del perfil
  let primaryUnitId: string | null = profile?.unit_id ?? null;

  // 2. Fallback: buscar por floor/unit del perfil
  if (!primaryUnitId && profile?.floor && profile?.unit) {
    const { data: found } = await supabase
      .from('units')
      .select('id')
      .eq('floor', profile.floor)
      .eq('unit_number', profile.unit)
      .single() as any;
    primaryUnitId = found?.id ?? null;
  }

  // 3. Fallback: relación directa del join
  if (!primaryUnitId && profileUnit?.id) {
    primaryUnitId = profileUnit.id;
  }

  // 4. AUTO-MATCH: buscar en unit_occupants por email del usuario
  console.log('>>> user email:', user?.email);
  if (!primaryUnitId && user.email) {
    const { data: occByEmail } = await supabase
      .from('unit_occupants')
      .select('unit_id')
      .ilike('email', user.email)
      .single() as any;
    primaryUnitId = occByEmail?.unit_id ?? null;
    console.log('>>> auto-match by email:', primaryUnitId);
  }

  // 5. AUTO-MATCH: buscar en unit_occupants por nombre del perfil o metadata del usuario
  const profileFullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';
  const userNameToMatch = profileFullName || user.user_metadata?.full_name || user.user_metadata?.name;
  if (!primaryUnitId && userNameToMatch) {
    const { data: occByName } = await supabase
      .from('unit_occupants')
      .select('unit_id')
      .ilike('name', `%${userNameToMatch}%`)
      .single() as any;
    primaryUnitId = occByName?.unit_id ?? null;
    console.log('>>> auto-match by name:', primaryUnitId);
  }

  console.log('>>> primaryUnitId resolved:', primaryUnitId);

  // --- Resolución de cochera ---
  // garage_id asignado manualmente por el admin en el perfil
  let garageId: string | null = profile?.garage_id ?? null;

  // Si no hay garage_id en el perfil pero el admin asignó un parking en la unidad principal,
  // intentamos encontrar la cochera por el campo parking de la unidad
  if (!garageId && primaryUnitId) {
    const { data: unitData } = await supabase
      .from('units')
      .select('parking')
      .eq('id', primaryUnitId)
      .single() as any;

    if (unitData?.parking) {
      const { data: garageUnit } = await supabase
        .from('units')
        .select('id')
        .ilike('unit_number', unitData.parking)
        .single() as any;
      garageId = garageUnit?.id ?? null;
      console.log('>>> auto-matched garage from unit.parking:', garageId);
    }
  }

  if (!primaryUnitId && !garageId) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">No tienes una unidad asignada</h2>
        <p className="text-gray-500">
          Contactá al administrador para que te asigne tu unidad.
        </p>
      </div>
    );
  }

  // Armar lista de unidades a mostrar (departamento + cochera)
  const unitIds: string[] = primaryUnitId ? [primaryUnitId] : [];
  if (garageId) {
    unitIds.push(garageId);
  }

  // unitIds ya construido arriba

  let totalDue = 0;
  const unitsData: any[] = [];

  for (const unitId of unitIds) {
    // Determinar nombre de la unidad
    let unitName: string;
    if (unitId === primaryUnitId) {
      // Departamento
      unitName = profileUnit
        ? `${profileUnit.floor}° ${profileUnit.unit_number}`
        : `${profile?.floor || ''}° ${profile?.unit || ''}`.trim();
    } else {
      // Cochera – obtener datos de la tabla units
      const { data: garage } = await supabase
        .from('units')
        .select('floor, unit_number')
        .eq('id', unitId)
        .single() as any;
      unitName = garage?.unit_number
        ? `${garage.floor}° ${garage.unit_number}`
        : `Cochera ${unitId.substring(0, 8)}`;
    }

    const expenseData = await expensesService.getCurrentExpense(unitId);
    const rawHistory = await expensesService.getExpenseHistory(unitId, 6);

    if (!expenseData) {
      // Omitir unidades sin datos
      continue;
    }

    // Cálculo de mes siguiente para vencimiento
    const nextMonthIndex = expenseData.period.period_month % 12;
    const nextMonthName = MONTHS[nextMonthIndex];

    // Parseo seguro de valores de fondo de reserva
    const parseCurrency = (value: any): number => {
      if (!value) return 0;
      const cleaned = String(value)
        .replace(/[^\d,.-]/g, '') // conservar dígitos, comas, puntos y signo menos
        .replace(/\./g, '') // eliminar separadores de miles (puntos)
        .replace(',', '.'); // coma decimal a punto
      return Number(cleaned);
    };

    const reserveFundCurrent = parseCurrency(expenseData.period.reserve_fund);
    const reserveFundPrev = expenseData.previousPeriod ? parseCurrency(expenseData.previousPeriod.reserve_fund) : 0;
    let reserveFundVariation = '0%';
    if (reserveFundPrev > 0) {
      const diff = ((reserveFundCurrent - reserveFundPrev) / reserveFundPrev) * 100;
      reserveFundVariation = diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;
    }

    const currentExpenseMapped = {
      // Add amount to total
      // (Will be summed after definition)

      id: expenseData.period.id,
      month: `${MONTHS[expenseData.period.period_month - 1]} ${expenseData.period.period_year}`,
      shortMonth: MONTHS[expenseData.period.period_month - 1].substring(0, 3),
      amount: Number(expenseData.unitExpense.amount),
      dueDate: expenseData.unitExpense.due_date || `10 de ${nextMonthName}`,
      status: expenseData.unitExpense.status,
      unit: unitName,
      pdf_url: expenseData.period.pdf_url || '#',
      insights: expenseData.period.insights_text || 'Análisis no disponible para este período.',
      ordinary_expenses: Number(expenseData.period.ordinary_expenses) || 0,
      extraordinary_expenses: Number(expenseData.period.extraordinary_expenses) || 0,
      reserve_fund: reserveFundCurrent,
      reserve_fund_variation: reserveFundVariation,
      reserve_funds_detail: expenseData.period.reserve_funds_detail || null,
      reserve_funds_detail_prev: expenseData.previousPeriod?.reserve_funds_detail || null,
      total_expenses: Number(expenseData.period.total_expenses) || 0,
      categories: expenseData.period.expense_categories || [],
    };

    const historyMapped = rawHistory.map((item: any, index: number) => {
      const prevItem = rawHistory[index + 1];
      let variation = '0%';
      if (prevItem && prevItem.amount > 0) {
        const diff = ((item.amount - prevItem.amount) / prevItem.amount) * 100;
        variation = diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;
      }
      return {
        id: item.id,
        month: `${MONTHS[item.expenses_periods.period_month - 1]} ${item.expenses_periods.period_year}`,
        shortMonth: MONTHS[item.expenses_periods.period_month - 1].substring(0, 3),
        amount: Number(item.amount),
        status: item.status,
        date: item.created_at,
        variation,
      };
    });

    totalDue += currentExpenseMapped.amount;
    unitsData.push({
      currentExpense: currentExpenseMapped,
      history: historyMapped,
      unit: { id: unitId, name: unitName }
    });
  }

  if (unitsData.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">No hay expensas cargadas</h2>
        <p className="text-gray-500">
          La administración aún no ha publicado la liquidación de expensas de este mes.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {unitsData.length > 1 && (
        <Card className="bg-primary-50 border border-primary-100 text-primary-900 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold">Total consolidado a pagar: ${totalDue.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</h2>
            <p className="text-sm opacity-80">Incluye tu departamento y la cochera asignada.</p>
          </div>
          <div className="text-xs bg-primary-100 text-primary-800 font-bold px-3 py-1.5 rounded-lg shrink-0">
            {unitsData.length} Unidades asociadas
          </div>
        </Card>
      )}
      <ExpensesBoard unitsData={unitsData} />
    </div>
  );
}

