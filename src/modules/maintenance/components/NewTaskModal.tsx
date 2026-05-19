'use client';

import { useState } from 'react';
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
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    frequency: 'monthly',
    vendor: '',
    estimated_cost: '',
    alert_days_before: 7,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newTask = await maintenanceService.createTask({
        building_id: buildingId || '00000000-0000-0000-0000-000000000000', // Fallback to a dummy UUID if empty
        title: formData.title,
        category: formData.category,
        frequency: formData.frequency,
        vendor: formData.vendor,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : null,
        alert_days_before: formData.alert_days_before,
        is_active: true,
      });
      onSuccess(newTask as MaintenanceTask);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Hubo un error al crear la tarea. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-border-light">
          <h2 className="text-lg font-bold text-text-primary">Nueva Tarea Preventiva</h2>
          <button onClick={onClose} className="p-2 hover:bg-background-warm rounded-full text-text-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Título de la tarea
            </label>
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
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Categoría
              </label>
              <input
                type="text"
                className="w-full p-2 border border-border-light rounded-[--radius-md] bg-surface"
                placeholder="Ej: Plomería"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Frecuencia
              </label>
              <select
                className="w-full p-2 border border-border-light rounded-[--radius-md] bg-surface"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              >
                <option value="monthly">Mensual</option>
                <option value="quarterly">Trimestral</option>
                <option value="biannual">Semestral</option>
                <option value="annual">Anual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Proveedor (Opcional)
              </label>
              <input
                type="text"
                className="w-full p-2 border border-border-light rounded-[--radius-md] bg-surface"
                placeholder="Nombre de la empresa"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Costo Estimado ($)
              </label>
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

          <div className="flex justify-end gap-2 pt-4 border-t border-border-light mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Crear Tarea'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
