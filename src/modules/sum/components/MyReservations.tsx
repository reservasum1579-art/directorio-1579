'use client';

import { Calendar, Clock, CheckCircle2, Timer, XCircle, FileText } from 'lucide-react';
import type { SumReservation } from '../types/sum.types';
import { formatShortDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface MyReservationsProps {
  reservations: SumReservation[];
}

export function MyReservations({ reservations }: MyReservationsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success" className="gap-1.5"><CheckCircle2 className="h-3 w-3" /> Aprobado</Badge>;
      case 'pending':
        return <Badge variant="warning" className="gap-1.5"><Timer className="h-3 w-3" /> Pendiente</Badge>;
      case 'rejected':
        return <Badge variant="error" className="gap-1.5"><XCircle className="h-3 w-3" /> Rechazado</Badge>;
      case 'cancelled':
        return <Badge variant="default" className="gap-1.5">Cancelado</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-semibold text-text-primary flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary-500" />
        Mis Reservas
      </h3>

      {reservations.length === 0 ? (
        <Card padding="lg" className="text-center bg-background-warm/50 border-dashed">
          <p className="text-text-muted text-sm italic">No tenés reservas registradas.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {reservations.map((res) => (
            <Card key={res.id} padding="md" className="group hover:border-primary-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-text-primary">
                    {formatShortDate(res.reservation_date)}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {res.start_time} - {res.end_time}
                    </span>
                    <span className="uppercase font-bold tracking-wider text-[10px] text-primary-400">
                      Turno {res.shift_type === 'morning' ? 'Mañana' : res.shift_type === 'night' ? 'Noche' : 'Día Completo'}
                    </span>
                  </div>
                </div>
                {getStatusBadge(res.status)}
              </div>
              
              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                <div className="text-[10px] text-text-muted uppercase font-semibold">
                  Costo: ${res.price.toLocaleString()} • Depósito: ${res.deposit_amount.toLocaleString()}
                </div>
                {res.status === 'pending' && (
                  <button className="text-[10px] text-primary-400 font-bold hover:underline flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Subir Comprobante
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
