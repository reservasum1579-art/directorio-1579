'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useSum } from '../hooks/useSum';
import { SumCalendar } from './SumCalendar';
import { SumReservationModal } from './SumReservationModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { formatShortDate, formatCurrency } from '@/lib/utils';
import { LoadingScreen } from '@/components/ui/Spinner';

interface SumDashboardProps {
  userUnits: Array<{
    unit_id: string;
    units: { floor: string; unit: string };
  }>;
  initialHistory: any[];
  onReservationSuccess?: (newRes: any) => void;
}

export function SumDashboard({ userUnits, initialHistory, onReservationSuccess }: SumDashboardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { reservations, rules, loading, refetch, getDayAvailability } = useSum(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [history, setHistory] = useState(initialHistory);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleReservationSuccess = (newRes: any) => {
    // Reload calendar data to reflect new booking
    refetch();
    // Update local history
    setHistory(prev => [newRes, ...prev]);
    // Notify parent
    if (onReservationSuccess) {
      onReservationSuccess(newRes);
    }
  };

  if (!rules) return <LoadingScreen message="Cargando configuración del SUM..." />;

  const shiftLabels: Record<string, string> = {
    morning: 'Mañana',
    night: 'Noche',
    full_day: 'Día Completo'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Salón de Usos Múltiples
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Revisá la disponibilidad y reservá el SUM del edificio
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Column */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <SumCalendar
            currentDate={currentDate}
            onMonthChange={setCurrentDate}
            onDateSelect={handleDateSelect}
            getDayAvailability={getDayAvailability}
            isLoading={loading}
          />
          
          <div className="bg-info-50 border border-info-100 rounded-[--radius-md] p-4 text-sm text-info-700">
            <h4 className="font-semibold mb-1">Reglas importantes:</h4>
            <ul className="list-disc pl-4 space-y-1 text-info-600/90 text-xs">
              <li>Capacidad máxima: {rules.limits?.max_capacity || 25} personas.</li>
              <li>Se debe cancelar con {rules.limits?.min_cancel_hours || 24}hs de anticipación para evitar multas.</li>
              <li>Límite de {rules.limits?.max_per_month || 2} reservas por mes por unidad.</li>
            </ul>
          </div>
        </div>

        {/* History Column */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <h3 className="font-display font-semibold text-text-primary text-lg">
            Mis Reservas
          </h3>
          
          <div className="space-y-3">
            {history.length > 0 ? (
              history.map((res) => (
                <Card key={res.id} padding="md">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-text-primary">
                      {formatShortDate(res.reservation_date)}
                    </span>
                    <StatusBadge status={res.status} />
                  </div>
                  <div className="space-y-1 text-sm text-text-secondary">
                    <p>Turno: <span className="text-text-primary font-medium">{shiftLabels[res.shift_type]}</span></p>
                    <p>Horario: {res.start_time.slice(0, 5)} - {res.end_time.slice(0, 5)}</p>
                    <p>Costo total: {formatCurrency(res.price + res.deposit_amount)}</p>
                  </div>
                </Card>
              ))
            ) : (
              <Card padding="lg" className="text-center text-text-secondary">
                <p className="text-sm">No tenés reservas previas.</p>
                <p className="text-xs mt-1">Hacé clic en un día libre del calendario para empezar.</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {selectedDate && (
        <SumReservationModal
          isOpen={!!selectedDate}
          onClose={() => setSelectedDate(null)}
          selectedDate={selectedDate}
          rules={rules}
          availability={{
            hasMorning: getDayAvailability(selectedDate).hasMorning,
            hasNight: getDayAvailability(selectedDate).hasNight,
          }}
          userUnits={userUnits}
          onSuccess={handleReservationSuccess}
        />
      )}
    </div>
  );
}
