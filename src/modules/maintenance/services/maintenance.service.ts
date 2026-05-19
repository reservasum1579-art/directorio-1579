import { MaintenanceTask, MaintenanceIncident, MaintenanceExecution } from '../types/maintenance.types';

// Mocked local storage key
const STORAGE_KEY_TASKS = 'demo_maintenance_tasks';
const STORAGE_KEY_INCIDENTS = 'demo_maintenance_incidents';
const STORAGE_KEY_EXECUTIONS = 'demo_maintenance_executions';

// Helper to generate UUIDs
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const maintenanceService = {
  // Tasks
  async getTasks(buildingId: string): Promise<MaintenanceTask[]> {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY_TASKS);
    if (!stored) return [];
    
    let tasks: MaintenanceTask[] = JSON.parse(stored);
    
    // Si queremos simular el orden por next_due_date
    tasks = tasks.sort((a, b) => {
      if (!a.next_due_date) return 1;
      if (!b.next_due_date) return -1;
      return new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime();
    });
    
    return tasks;
  },

  async createTask(task: Partial<MaintenanceTask>): Promise<MaintenanceTask> {
    if (typeof window === 'undefined') throw new Error('Cannot create task on server');
    
    const newTask: MaintenanceTask = {
      id: generateId(),
      building_id: task.building_id || 'demo-building-id',
      title: task.title || '',
      description: task.description || null,
      category: task.category || null,
      frequency: task.frequency || 'monthly',
      custom_interval_days: task.custom_interval_days || null,
      vendor: task.vendor || null,
      next_due_date: task.next_due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 días por defecto
      alert_days_before: task.alert_days_before || 7,
      estimated_cost: task.estimated_cost || null,
      is_active: task.is_active !== undefined ? task.is_active : true,
      created_at: new Date().toISOString(),
    };

    const currentTasks = await this.getTasks('');
    currentTasks.push(newTask);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(currentTasks));
    
    return newTask;
  },

  // Incidents
  async getIncidents(buildingId: string): Promise<MaintenanceIncident[]> {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY_INCIDENTS);
    if (!stored) return [];
    
    let incidents: MaintenanceIncident[] = JSON.parse(stored);
    return incidents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async createIncident(incident: Partial<MaintenanceIncident>): Promise<MaintenanceIncident> {
    if (typeof window === 'undefined') throw new Error('Cannot create incident on server');
    
    const newIncident: MaintenanceIncident = {
      id: generateId(),
      building_id: incident.building_id || 'demo-building-id',
      title: incident.title || '',
      description: incident.description || null,
      location: incident.location || null,
      category: incident.category || null,
      priority: incident.priority || 'medium',
      reported_by: incident.reported_by || 'Demo User',
      assigned_to: incident.assigned_to || null,
      possible_cause: incident.possible_cause || null,
      solution: incident.solution || null,
      status: incident.status || 'pending',
      detected_at: incident.detected_at || new Date().toISOString(),
      resolved_at: incident.resolved_at || null,
      total_cost: incident.total_cost || null,
      created_at: new Date().toISOString(),
    };

    const currentIncidents = await this.getIncidents('');
    currentIncidents.push(newIncident);
    localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(currentIncidents));
    
    return newIncident;
  },

  async updateIncidentStatus(id: string, status: string, additionalData?: Partial<MaintenanceIncident>): Promise<MaintenanceIncident> {
    const incidents = await this.getIncidents('');
    const index = incidents.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Incident not found');
    
    incidents[index] = { ...incidents[index], status: status as any, ...additionalData };
    localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(incidents));
    return incidents[index];
  },
  
  // Executions
  async recordExecution(execution: Partial<MaintenanceExecution>): Promise<MaintenanceExecution> {
    if (typeof window === 'undefined') throw new Error('Cannot record execution on server');
    
    const stored = localStorage.getItem(STORAGE_KEY_EXECUTIONS);
    const executions: MaintenanceExecution[] = stored ? JSON.parse(stored) : [];
    
    const newExecution: MaintenanceExecution = {
      id: generateId(),
      task_id: execution.task_id || '',
      performed_by: execution.performed_by || 'Demo User',
      vendor: execution.vendor || null,
      performed_at: execution.performed_at || new Date().toISOString(),
      notes: execution.notes || null,
      cost: execution.cost || null,
      status: execution.status || 'completed',
      created_at: new Date().toISOString(),
    };

    executions.push(newExecution);
    localStorage.setItem(STORAGE_KEY_EXECUTIONS, JSON.stringify(executions));
    return newExecution;
  }
};
