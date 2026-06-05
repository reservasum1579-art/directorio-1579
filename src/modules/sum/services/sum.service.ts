import { createClient } from '@/lib/supabase/client';
import type { SumReservation, ShiftType, ReservationStatus } from '../types/sum.types';

export const sumService = {
  // -----------------------------------------------------
  // RESERVATIONS
  // -----------------------------------------------------

  /**
   * Helper para obtener reservas del localStorage (Modo Demo)
   */
  _getDemoReservations(): any[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('demo_sum_reservations');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing demo_sum_reservations", e);
      localStorage.removeItem('demo_sum_reservations');
    }
    
    // Default initial data
    const initial = [
      {
        id: 'res-ext-1', building_id: 'b1', unit_id: 'u-99', user_id: 'other',
        reservation_date: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().split('T')[0],
        shift_type: 'night', status: 'approved', price: 5000, deposit_amount: 10000,
        start_time: '20:00', end_time: '01:00',
        profiles: { first_name: 'Elena', last_name: 'Pérez', phone: '11 5566-7788' },
        units: { floor: '4', unit: 'C' }
      },
      {
        id: 'res-ext-2', building_id: 'b1', unit_id: 'u-100', user_id: 'other2',
        reservation_date: new Date(new Date().getFullYear(), new Date().getMonth(), 25).toISOString().split('T')[0],
        shift_type: 'day', status: 'pending', price: 3000, deposit_amount: 10000,
        start_time: '10:00', end_time: '17:00',
        profiles: { first_name: 'Martín', last_name: 'Gómez', phone: '11 9900-1122' },
        units: { floor: '8', unit: 'A' }
      },
      {
        id: 'res-ext-3', building_id: 'b1', unit_id: 'u-101', user_id: 'other3',
        reservation_date: new Date(new Date().getFullYear(), new Date().getMonth(), 28).toISOString().split('T')[0],
        shift_type: 'night', status: 'pending', price: 5000, deposit_amount: 10000,
        start_time: '20:00', end_time: '01:00',
        profiles: { first_name: 'Laura', last_name: 'San', phone: '11 9900-1123' },
        units: { floor: '8', unit: 'A' }
      }
    ];
    localStorage.setItem('demo_sum_reservations', JSON.stringify(initial));
    return initial;
  },

  /**
   * Obtiene las reservas de un mes y año específico (MOCKED con persistencia y seguridad de zona horaria)
   */
  async getReservationsByMonth(year: number, month: number, buildingId: string): Promise<SumReservation[]> {
    const all = this._getDemoReservations();
    return all.filter(r => {
      // Usamos split para evitar problemas de zona horaria de new Date()
      const [y, m] = r.reservation_date.split('-').map(Number);
      // month en JS es 0-indexed (0-11), m en string es 1-indexed (1-12)
      return y === year && m === (month + 1);
    }) as any;
  },

  /**
   * Obtiene el historial de reservas del usuario actual (MOCKED con persistencia)
   */
  async getMyReservations(userId: string): Promise<SumReservation[]> {
    const all = this._getDemoReservations();
    return all.filter(r => r.user_id === userId || r.user_id === 'mock-user') as any;
  },

  /**
   * Crea una nueva solicitud de reserva (MOCKED con persistencia)
   */
  async createReservation(params: any): Promise<SumReservation> {
    const all = this._getDemoReservations();
    const newRes = {
      id: 'new-res-' + Math.random(),
      ...params,
      status: 'approved', // Auto-approved as requested
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Agregamos info de la unidad para el calendario
      units: { floor: '14', unit: 'B' }, // Mocking for the demo user
      profiles: { first_name: 'Alex', last_name: 'Sterling' }
    };
    localStorage.setItem('demo_sum_reservations', JSON.stringify([...all, newRes]));
    return newRes as any;
  },

  /**
   * Cancela una reserva propia
   */
  async cancelReservation(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('sum_reservations')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) throw error;
  },

  // -----------------------------------------------------
  // ADMIN FUNCTIONS
  // -----------------------------------------------------

  /**
   * Admin: Obtiene todas las reservas pendientes (MOCKED con persistencia)
   */
  async getPendingReservations(buildingId: string): Promise<SumReservation[]> {
    const all = this._getDemoReservations();
    // For admin view we return everything initially so it can filter locally, or just pending
    // Let's return ALL so the new AdminSumDashboard can manage the local state of all reservations
    return all.map(r => ({
      ...r,
      profiles: r.profiles || { first_name: 'Vecino', last_name: 'Demo', phone: '11 1234-5678' },
      units: r.units || { floor: '14', unit: 'B' }
    })) as any;
  },

  /**
   * Admin: Actualiza el estado de una reserva (MOCKED con persistencia)
   */
  async updateReservationStatus(id: string, status: ReservationStatus): Promise<void> {
    const all = this._getDemoReservations();
    const updated = all.map(r => r.id === id ? { ...r, status } : r);
    localStorage.setItem('demo_sum_reservations', JSON.stringify(updated));
  },

  // -----------------------------------------------------
  // RULES & SETTINGS
  // -----------------------------------------------------

  /**
   * Obtiene las reglas del SUM desde la base de datos
   */
  async getSumRules(buildingId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('sum_rules')
      .select('rule_key, rule_value')
      .eq('building_id', buildingId);

    if (error) {
      console.error('Error fetching sum_rules:', error);
      throw error;
    }

    const rules: Record<string, any> = {};
    if (data) {
      data.forEach(row => {
        rules[row.rule_key] = row.rule_value;
      });
    }

    // Default fallbacks in case table is empty
    return {
      pricing: rules.pricing || { morning: 3000, night: 5000, full_day: 7000, deposit: 10000 },
      limits: rules.limits || { max_capacity: 30, min_cancel_hours: 24, max_per_month: 2 },
      shifts: rules.shifts || { 
        morning: { start: '10:00', end: '17:00' }, 
        night: { start: '20:00', end: '01:00' } 
      }
    };
  }
};
