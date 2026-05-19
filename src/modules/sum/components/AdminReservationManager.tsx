'use client';

import { Check, X, Phone, User, Home, DollarSign, ExternalLink } from 'lucide-react';
import type { SumReservation } from '../types/sum.types';
import { sumService } from '../services/sum.service';
import { useState } from 'react';
import { formatShortDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface AdminReservationManagerProps {
  initialReservations: SumReservation[];
}

export function AdminReservationManager({ initialReservations }: AdminReservationManagerProps) {
  const [reservations, setReservations] = useState(initialReservations);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await sumService.updateReservationStatus(id, status);
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold text-text-primary">Solicitudes de SUM</h3>
        <span className="bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full text-xs font-bold border border-primary-500/20">
          {reservations.length} Pendientes
        </span>
      </div>

      {reservations.length === 0 ? (
        <Card padding="lg" className="text-center py-12 border-dashed">
          <p className="text-text-muted">No hay solicitudes de reserva pendientes.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reservations.map((res) => (
            <Card key={res.id} padding="none" className="overflow-hidden border-warning-500/20 shadow-lg shadow-warning-500/5">
              <div className="flex flex-col md:flex-row">
                {/* Date Side */}
                <div className="bg-warning-500/10 md:w-48 p-6 flex flex-col items-center justify-center border-r border-white/5">
                  <span className="text-warning-500 text-xs font-bold uppercase tracking-widest mb-1">FECHA</span>
                  <p className="text-2xl font-display font-bold text-text-primary">{formatShortDate(res.reservation_date)}</p>
                  <p className="text-[10px] font-bold text-text-muted uppercase mt-1">Turno {res.shift_type === 'morning' ? 'Mañana' : res.shift_type === 'night' ? 'Noche' : 'Día Completo'}</p>
                </div>

                {/* Details Side */}
                <div className="flex-1 p-6 flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-surface-bright flex items-center justify-center text-text-muted">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">{res.profiles?.first_name} {res.profiles?.last_name}</p>
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                          <span className="flex items-center gap-1"><Home className="h-3 w-3" /> Depto {res.units?.floor}{res.units?.unit}</span>
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {res.profiles?.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Precio Alquiler</p>
                        <p className="text-sm font-bold text-text-primary flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-success-500" /> {res.price.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Depósito (Garantía)</p>
                        <p className="text-sm font-bold text-text-primary flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-primary-500" /> {res.deposit_amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 justify-center md:w-48">
                    <button className="w-full text-[10px] font-bold text-primary-400 border border-primary-500/20 hover:bg-primary-500/10 py-1.5 rounded flex items-center justify-center gap-1 transition-all mb-1">
                      <ExternalLink className="h-3 w-3" /> Ver Comprobante
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStatusUpdate(res.id, 'approved')}
                        className="flex-1 bg-success-600 hover:bg-success-700 text-white p-2 rounded-lg transition-all active:scale-95 flex items-center justify-center"
                        title="Aprobar"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(res.id, 'rejected')}
                        className="flex-1 bg-error-600/10 hover:bg-error-600/20 text-error-400 border border-error-600/20 p-2 rounded-lg transition-all active:scale-95 flex items-center justify-center"
                        title="Rechazar"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
