'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { maintenanceService } from '../services/maintenance.service';
import { MaintenanceIncident } from '../types/maintenance.types';
import { X, AlertTriangle } from 'lucide-react';

interface ReportIncidentModalProps {
  buildingId: string;
  onClose: () => void;
  onSuccess: (incident: MaintenanceIncident) => void;
}

export function ReportIncidentModal({ buildingId, onClose, onSuccess }: ReportIncidentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: 'Infraestructura',
    detected_at: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newIncident = await maintenanceService.createIncident({
        ...formData,
        building_id: buildingId,
        status: 'pending',
        reported_by: 'Admin',
      });
      onSuccess(newIncident);
    } catch (error) {
      console.error('Error reporting incident:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-border-light bg-surface shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-warning-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-warning-600" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">Reportar Incidente</h3>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <form id="report-incident-form" onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Título del Incidente"
              required
              placeholder="Ej: Filtración de agua en pasillo"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            
            <Input
              label="Ubicación"
              required
              placeholder="Ej: Piso 3, cerca ascensor B"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Descripción
              </label>
              <textarea
                required
                className="w-full min-h-[100px] p-2.5 bg-background-warm border border-border-light rounded-[--radius-sm] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                placeholder="Detalle del problema encontrado..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Prioridad
                </label>
                <select
                  className="w-full h-10 px-3 bg-background-warm border border-border-light rounded-[--radius-sm] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              
              <Input
                label="Fecha de Detección"
                type="date"
                required
                value={formData.detected_at}
                onChange={(e) => setFormData({ ...formData, detected_at: e.target.value })}
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-border-light bg-surface flex justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button variant="primary" type="submit" form="report-incident-form" disabled={loading}>
            {loading ? 'Reportando...' : 'Reportar Incidente'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
