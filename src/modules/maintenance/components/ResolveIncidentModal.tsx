'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { maintenanceService } from '../services/maintenance.service';
import { MaintenanceIncident } from '../types/maintenance.types';
import { X, CheckCircle2 } from 'lucide-react';

interface ResolveIncidentModalProps {
  incident: MaintenanceIncident;
  onClose: () => void;
  onSuccess: (updatedIncident: MaintenanceIncident) => void;
}

export function ResolveIncidentModal({ incident, onClose, onSuccess }: ResolveIncidentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    solution: '',
    total_cost: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updated = await maintenanceService.updateIncidentStatus(
        incident.id, 
        'resolved', 
        {
          solution: formData.solution,
          total_cost: formData.total_cost ? parseFloat(formData.total_cost) : 0,
          resolved_at: new Date().toISOString()
        }
      );
      onSuccess(updated);
    } catch (error) {
      console.error('Error resolving incident:', error);
      alert('Hubo un error al intentar resolver el incidente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-border-light bg-surface shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-success-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-success-600" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">Resolver Incidente</h3>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1 rounded-full hover:bg-background-warm transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4 bg-background-warm/50 p-3 rounded-[--radius-md] border border-border-light text-sm">
            <p className="font-semibold text-text-primary mb-1">{incident.title}</p>
            <p className="text-text-secondary line-clamp-2">{incident.description}</p>
          </div>

          <form id="resolve-incident-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Detalle de la Solución (Qué se realizó)
              </label>
              <textarea
                required
                className="w-full min-h-[100px] p-2.5 bg-background-warm border border-border-light rounded-[--radius-sm] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                placeholder="Ej: Se reparó el caño principal y se secó la zona..."
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              />
            </div>
            
            <Input
              label="Monto del Arreglo ($)"
              type="number"
              min="0"
              required
              placeholder="0.00"
              value={formData.total_cost}
              onChange={(e) => setFormData({ ...formData, total_cost: e.target.value })}
            />
          </form>
        </div>

        <div className="p-4 border-t border-border-light bg-background-warm/30 flex justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={onClose} type="button" disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" form="resolve-incident-form" disabled={loading}>
            {loading ? 'Guardando...' : 'Marcar como Solucionado'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
