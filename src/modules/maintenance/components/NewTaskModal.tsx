import React, { useState } from 'react';
import { Portal } from '@/components/Portal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import { maintenanceService } from '../services/maintenance.service';
import { MaintenanceTask } from '../types/maintenance.types';

interface NewTaskModalProps {
  onClose: () => void;
  onSuccess: (task: MaintenanceTask) => void;
  buildingId: string;
}

export function NewTaskModal({ onClose, onSuccess, buildingId }: NewTaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [isRecurring, setIsRecurring] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    frequency: 'Mensual',
    vendor: '',
    estimated_cost: '',
    alert_days_before: 7,
    next_due_date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newTask = await maintenanceService.createTask({
        building_id: buildingId || '00000000-0000-0000-0000-000000000000',
        title: formData.title,
        category: formData.category,
        frequency: isRecurring ? formData.frequency : 'Única vez',
        vendor: formData.vendor,
        next_due_date: formData.next_due_date,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : null,
        alert_days_before: formData.alert_days_before,
        is_active: true,
      });
      onSuccess(newTask as MaintenanceTask);
    } catch (error: any) {
      console.error('Error creating task:', error);
      alert(`Hubo un error al crear la tarea: ${error.message || JSON.stringify(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <Card className="w-full max-w-lg shadow-2xl max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-border-light shrink-0">
            <h2 className="text-lg font-bold text-text-primary">Nueva Tarea Preventiva</h2>
            <button onClick={onClose} className="p-2 hover:bg-background-warm rounded-full text-text-muted">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Título de la tarea</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border border-border-light rounded-[--radius-md] bg-surface"
                  placeholder="Ej: Limpieza de Tanques"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Categoría</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-border-light rounded-[--radius-md] bg-surface"
                    placeholder="Ej: Plomería"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border-light text-primary-600 focus:ring-primary-500"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    <span className="text-sm font-medium text-text-primary">Tarea repetitiva</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Fecha Programada (Próxima)</label>
                  <input
                    type="date"
                    required
                    className="w-full p-2 border border-border-light rounded-[--radius-md] bg-surface"
                    value={formData.next_due_date}
                    onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
                  />
                </div>

                {isRecurring && (
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Frecuencia</label>
                    <select
                      className="w-full p-2 border border-border-light rounded-[--radius-md] bg-surface"
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    >
                      <option value="Quincenal (15 días)">Quincenal (15 días)</option>
                      <option value="Mensual">Mensual</option>
                      <option value="Bimestral">Bimestral</option>
                      <option value="Trimestral">Trimestral</option>
                      <option value="Semestral">Semestral</option>
                      <option value="Anual">Anual</option>
                      <option value="Cada 2 años">Cada 2 años</option>
                      <option value="Cada 5 años">Cada 5 años</option>
                      <option value="Cada 6 años">Cada 6 años</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Proveedor (Opcional)</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-border-light rounded-[--radius-md] bg-surface"
                    placeholder="Nombre de la empresa"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Costo Estimado ($)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-2 border border-border-light rounded-[--radius-md] bg-surface"
                    placeholder="0.00"
                    value={formData.estimated_cost}
                    onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t border-border-light shrink-0 bg-background-warm/30">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Crear Tarea'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Portal>
  );
}
