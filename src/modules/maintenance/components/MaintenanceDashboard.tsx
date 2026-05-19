'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { maintenanceService } from '../services/maintenance.service';
import { MaintenanceTask, MaintenanceIncident } from '../types/maintenance.types';
import { 
  Wrench, 
  AlertTriangle, 
  CalendarClock, 
  CheckCircle2, 
  Plus, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';
import { NewTaskModal } from './NewTaskModal';

export function MaintenanceDashboard() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [incidents, setIncidents] = useState<MaintenanceIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'preventive' | 'corrective'>('preventive');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, incidentsData] = await Promise.all([
        maintenanceService.getTasks(DEFAULT_BUILDING_ID),
        maintenanceService.getIncidents(DEFAULT_BUILDING_ID)
      ]);
      setTasks(tasksData);
      setIncidents(incidentsData);
    } catch (error) {
      console.error('Error loading maintenance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" className="text-primary-600" />
      </div>
    );
  }

  const pendingIncidents = incidents.filter(i => ['pending', 'diagnosed', 'in_progress'].includes(i.status));
  const overdueTasks = tasks.filter(t => t.next_due_date && new Date(t.next_due_date) < new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2">
            <Wrench className="w-6 h-6 text-primary-600" />
            Mantenimiento
          </h1>
          <p className="text-text-secondary mt-1">
            Gestión integral de tareas preventivas e incidentes del edificio.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<AlertTriangle className="w-4 h-4" />}>
            Reportar Incidente
          </Button>
          <Button 
            variant="primary" 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsNewTaskOpen(true)}
          >
            Nueva Tarea
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-warning-50 rounded-[--radius-md] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-warning-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary">Incidentes Abiertos</p>
            <p className="text-2xl font-black font-display text-text-primary">{pendingIncidents.length}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-error-50 rounded-[--radius-md] flex items-center justify-center shrink-0">
            <CalendarClock className="w-6 h-6 text-error-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary">Tareas Vencidas</p>
            <p className="text-2xl font-black font-display text-text-primary">{overdueTasks.length}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-success-50 rounded-[--radius-md] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-success-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary">Tareas Activas</p>
            <p className="text-2xl font-black font-display text-text-primary">{tasks.length}</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-border-light rounded-[--radius-md] p-1 w-full sm:w-fit">
        <button
          onClick={() => setActiveTab('preventive')}
          className={`flex-1 sm:flex-none px-6 py-2 text-sm font-medium rounded-[--radius-sm] transition-all ${
            activeTab === 'preventive'
              ? 'bg-primary-50 text-primary-700 shadow-sm'
              : 'text-text-secondary hover:bg-background-warm'
          }`}
        >
          Preventivo
        </button>
        <button
          onClick={() => setActiveTab('corrective')}
          className={`flex-1 sm:flex-none px-6 py-2 text-sm font-medium rounded-[--radius-sm] transition-all ${
            activeTab === 'corrective'
              ? 'bg-primary-50 text-primary-700 shadow-sm'
              : 'text-text-secondary hover:bg-background-warm'
          }`}
        >
          Correctivo (Incidentes)
        </button>
      </div>

      {/* Main Content */}
      <Card className="overflow-hidden">
        {activeTab === 'preventive' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-light bg-background-warm/50 text-xs uppercase tracking-wider text-text-muted font-semibold">
                  <th className="px-6 py-4">Tarea</th>
                  <th className="px-6 py-4">Frecuencia</th>
                  <th className="px-6 py-4">Proveedor</th>
                  <th className="px-6 py-4">Próximo Vencimiento</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text-muted">
                      No hay tareas preventivas registradas.
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => {
                    const isOverdue = task.next_due_date && new Date(task.next_due_date) < new Date();
                    return (
                      <tr key={task.id} className="hover:bg-background-warm/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-text-primary">{task.title}</div>
                          <div className="text-xs text-text-secondary mt-0.5">{task.category || 'Sin categoría'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="info">{task.frequency}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {task.vendor || 'No asignado'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${isOverdue ? 'text-error-500' : 'text-text-muted'}`} />
                            <span className={`text-sm font-medium ${isOverdue ? 'text-error-600' : 'text-text-primary'}`}>
                              {task.next_due_date ? new Date(task.next_due_date).toLocaleDateString() : 'Sin fecha'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="outline" size="sm">Registrar</Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-light bg-background-warm/50 text-xs uppercase tracking-wider text-text-muted font-semibold">
                  <th className="px-6 py-4">Incidente</th>
                  <th className="px-6 py-4">Ubicación</th>
                  <th className="px-6 py-4">Prioridad</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {incidents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text-muted">
                      No hay incidentes reportados.
                    </td>
                  </tr>
                ) : (
                  incidents.map((incident) => (
                    <tr key={incident.id} className="hover:bg-background-warm/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-text-primary">{incident.title}</div>
                        <div className="text-xs text-text-secondary mt-0.5 text-balance max-w-sm line-clamp-1">
                          {incident.description || 'Sin descripción'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {incident.location || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          incident.priority === 'urgent' ? 'error' : 
                          incident.priority === 'high' ? 'warning' : 
                          incident.priority === 'medium' ? 'accent' : 'default'
                        }>
                          {incident.priority.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          incident.status === 'resolved' ? 'success' : 
                          incident.status === 'pending' ? 'warning' : 'info'
                        } dot>
                          {incident.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="sm">Ver Detalles</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {isNewTaskOpen && (
        <NewTaskModal
          buildingId={DEFAULT_BUILDING_ID}
          onClose={() => setIsNewTaskOpen(false)}
          onSuccess={(newTask) => {
            setTasks([...tasks, newTask]);
            setIsNewTaskOpen(false);
          }}
        />
      )}
    </div>
  );
}
