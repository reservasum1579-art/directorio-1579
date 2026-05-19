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
    
    // Auto-asignar el primer edificio si no hay un building_id real configurado
    if (!task.building_id || task.building_id === '00000000-0000-0000-0000-000000000000') {
      const { data: buildings } = await supabase.from('buildings').select('id').limit(1);
      if (buildings && buildings.length > 0) {
        task.building_id = buildings[0].id;
      } else {
        throw new Error('No hay edificios registrados en el sistema para asociar la tarea.');
      }
    }

    const { data, error } = await supabase
      .from('maintenance_tasks')
      .insert(task)
      .select()
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }
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
