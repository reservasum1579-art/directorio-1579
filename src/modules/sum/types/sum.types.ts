// ============================================
// SUM Module Type Definitions
// ============================================

export type ShiftType = 'morning' | 'night' | 'full_day';

export type ReservationStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'completed';

export type PenaltyType = 'cleaning' | 'damage' | 'late_cancel' | 'noise';

export type PenaltyStatus = 'pending' | 'applied' | 'paid' | 'waived' | 'appealed';

export interface SumReservation {
  id: string;
  building_id: string;
  user_id: string;
  unit_id: string;
  reservation_date: string; // YYYY-MM-DD
  shift_type: ShiftType;
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  status: ReservationStatus;
  price: number;
  deposit_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  profiles?: {
    first_name: string;
    last_name: string;
    phone: string | null;
  };
  units?: {
    floor: string;
    unit: string;
  };
}

export interface SumRule {
  id: string;
  building_id: string;
  rule_key: string;
  rule_value: any; // JSONB
  updated_by: string | null;
  updated_at: string;
}

export interface SumPenalty {
  id: string;
  building_id: string;
  user_id: string;
  unit_id: string;
  reservation_id: string | null;
  penalty_type: PenaltyType;
  amount: number;
  description: string | null;
  status: PenaltyStatus;
  applied_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SumSuspension {
  id: string;
  building_id: string;
  user_id: string;
  unit_id: string;
  reason: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}
