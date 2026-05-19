import { createClient } from '@/lib/supabase/client';
import { MaintenanceTask, MaintenanceIncident, MaintenanceExecution } from '../types/maintenance.types';

export const maintenanceService = {
  // Tasks
  async getTasks(buildingId: string): Promise<MaintenanceTask[]> {
    const supabase = createClient();
    let query = supabase
      .from('maintenance_tasks')
      .select('*')
      .order('next_due_date', { ascending: true });
      
    if (buildingId) {
      query = query.eq('building_id', buildingId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createTask(task: Partial<MaintenanceTask>): Promise<MaintenanceTask> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('maintenance_tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Incidents
  async getIncidents(buildingId: string): Promise<MaintenanceIncident[]> {
    const supabase = createClient();
    let query = supabase
      .from('maintenance_incidents')
      .select(`
        *,
        reported_by:profiles!reported_by(first_name, last_name)
      `)
      .order('created_at', { ascending: false });

    if (buildingId) {
      query = query.eq('building_id', buildingId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createIncident(incident: Partial<MaintenanceIncident>): Promise<MaintenanceIncident> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('maintenance_incidents')
      .insert(incident)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateIncidentStatus(id: string, status: string, additionalData?: Partial<MaintenanceIncident>): Promise<MaintenanceIncident> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('maintenance_incidents')
      .update({ status, ...additionalData })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  
  // Executions
  async recordExecution(execution: Partial<MaintenanceExecution>): Promise<MaintenanceExecution> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('maintenance_executions')
      .insert(execution)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
