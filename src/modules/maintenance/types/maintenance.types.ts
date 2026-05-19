export interface MaintenanceTask {
  id: string;
  building_id: string;
  title: string;
  description: string | null;
  category: string | null;
  frequency: string;
  custom_interval_days: number | null;
  vendor: string | null;
  next_due_date: string | null;
  alert_days_before: number;
  estimated_cost: number | null;
  is_active: boolean;
  created_at: string;
}

export interface MaintenanceIncident {
  id: string;
  building_id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reported_by: string | null;
  assigned_to: string | null;
  possible_cause: string | null;
  solution: string | null;
  status: 'pending' | 'diagnosed' | 'in_progress' | 'resolved' | 'cancelled';
  detected_at: string | null;
  resolved_at: string | null;
  total_cost: number | null;
  created_at: string;
}

export interface MaintenanceExecution {
  id: string;
  task_id: string;
  performed_by: string | null;
  vendor: string | null;
  performed_at: string;
  notes: string | null;
  cost: number | null;
  status: string;
  created_at: string;
}
