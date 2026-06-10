'use client';

import { useState } from 'react';
import { X, Calendar, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Portal } from '@/components/Portal';
import { sumService } from '../services/sum.service';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';
import { formatUnit } from '@/lib/utils';
import type { ShiftType } from '../types/sum.types';

interface SumReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD
  rules: Record<string, any>;
  availability: {
    hasMorning: boolean;
    hasNight: boolean;
  };
  userUnits: Array<{
    unit_id: string;
    units: { floor: string; unit: string };
  }>;
  onSuccess: (newRes: any) => void;
}

export function SumReservationModal({
  isOpen,
  onClose,
  selectedDate,
  rules,
  availability,
  userUnits,
  onSuccess
}: SumReservationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [selectedUnit, setSelectedUnit] = useState(userUnits[0]?.unit_id || '');
  const [shiftType, setShiftType] = useState<ShiftType | ''>('');
  const [notes, setNotes] = useState('');

  // Deuda real del usuario (0 = sin deuda, sin bloqueo)
  const isBlocked = false;

  if (!isOpen) return null;

  const handleReserve = async () => {
    if (!selectedUnit || !shiftType) {
      setError('Por favor seleccioná el departamento y el turno.');
      return;
    }

    // Determinar el piso y departamento seleccionado
    const selectedUnitObj = userUnits.find(u => u.unit_id === selectedUnit);
    const floor = selectedUnitObj?.units?.floor || '';
    const unit = selectedUnitObj?.units?.unit || '';

    try {
      setLoading(true);
      setError('');

      const shiftsRule = rules.shifts || {};
      const pricingRule = rules.pricing || {};
      
      const startTime = shiftsRule[shiftType]?.start || '00:00';
      const endTime = shiftsRule[shiftType]?.end || '23:59';
      const price = pricingRule[shiftType] || 0;

      await sumService.createReservation({
        building_id: DEFAULT_BUILDING_ID,
        unit_id: selectedUnit,
        units: { floor, unit },
        reservation_date: selectedDate,
        shift_type: shiftType,
        start_time: startTime,
        end_time: endTime,
        price,
        deposit_amount: 0,
        notes,
        status: 'approved'
      });

      onSuccess({
        id: Math.random().toString(36).substr(2, 9),
        building_id: DEFAULT_BUILDING_ID,
        unit_id: selectedUnit,
        units: { floor, unit },
        reservation_date: selectedDate,
        shift_type: shiftType,
        start_time: startTime,
        end_time: endTime,
        price,
        deposit_amount: 0,
        notes,
        status: 'approved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al procesar la reserva. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const displayDate = new Date(`${selectedDate}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Portal>
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-primary-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-[--radius-lg] shadow-modal w-full max-w-md max-h-[90dvh] flex flex-col overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light bg-background-warm shrink-0">
          <h2 className="font-display text-lg font-semibold text-text-primary">
            Nueva Reserva
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-text-muted hover:bg-border hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-grow">
          {/* Date Summary */}
          <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-[--radius-md] border border-primary-100">
            <Calendar className="h-5 w-5 text-primary-600 shrink-0" />
            <p className="text-sm font-medium text-primary-900 capitalize">
              {displayDate}
            </p>
          </div>

          {isBlocked && (
            <div className="p-4 bg-error-500/10 border-2 border-error-500/20 rounded-2xl flex gap-4 animate-shake">
              <div className="h-10 w-10 bg-error-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-error-500/20">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-error-700 uppercase tracking-tight">Acceso Restringido</h4>
                <p className="text-xs text-error-600 font-medium leading-relaxed">
                  Para reservar el SUM es necesario estar al día con el pago del consorcio.
                </p>
                <button className="text-[10px] font-black text-error-700 underline uppercase mt-2">Ver mi deuda</button>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-error-50 text-error-700 text-sm rounded-[--radius-md] border border-error-500/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Unit Selection */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Departamento</label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full rounded-[--radius-md] border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="" disabled>Seleccioná tu departamento...</option>
              {userUnits.map(uu => (
                <option key={uu.unit_id} value={uu.unit_id}>
                  {formatUnit(uu.units.floor, uu.units.unit)}
                </option>
              ))}
            </select>
          </div>

          {/* Shift Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Turno</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShiftType('morning')}
                disabled={availability.hasMorning}
                className={`p-3 text-left rounded-[--radius-md] border transition-all ${
                  availability.hasMorning 
                    ? 'opacity-50 bg-background-warm border-border cursor-not-allowed'
                    : shiftType === 'morning'
                      ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500 cursor-pointer'
                      : 'border-border bg-surface hover:border-primary-300 cursor-pointer'
                }`}
              >
                <p className="font-semibold text-sm text-text-primary mb-1">Mañana</p>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Clock className="h-3 w-3" />
                  <span>{rules.shifts?.morning?.start} - {rules.shifts?.morning?.end}</span>
                </div>
              </button>

              <button
                onClick={() => setShiftType('night')}
                disabled={availability.hasNight}
                className={`p-3 text-left rounded-[--radius-md] border transition-all ${
                  availability.hasNight 
                    ? 'opacity-50 bg-background-warm border-border cursor-not-allowed'
                    : shiftType === 'night'
                      ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500 cursor-pointer'
                      : 'border-border bg-surface hover:border-primary-300 cursor-pointer'
                }`}
              >
                <p className="font-semibold text-sm text-text-primary mb-1">Noche</p>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Clock className="h-3 w-3" />
                  <span>{rules.shifts?.night?.start} - {rules.shifts?.night?.end}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Price Summary */}
          {shiftType && (
            <div className="p-4 bg-background-warm rounded-[--radius-md] border border-border">
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Resumen de costos
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between font-bold text-primary-700">
                  <span>Costo de reserva</span>
                  <span>${rules.pricing?.[shiftType]?.toLocaleString('es-AR')}</span>
                </div>
                <p className="text-[10px] text-text-muted">
                  El monto se cargará automáticamente en tu próxima liquidación de expensas.
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Comentarios adicionales (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-[--radius-md] border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none h-20"
              placeholder="Ej: Cumpleaños, 15 invitados..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-light bg-background-warm flex gap-3 justify-end shrink-0">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleReserve} 
            loading={loading} 
            disabled={!shiftType || !selectedUnit || isBlocked}
            className={isBlocked ? "opacity-50 grayscale" : ""}
          >
            {isBlocked ? 'Reserva Bloqueada' : 'Confirmar Reserva'}
          </Button>
        </div>
      </div>
    </div>
    </Portal>
  );
}
