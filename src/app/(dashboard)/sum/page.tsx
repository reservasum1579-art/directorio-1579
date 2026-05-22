'use client';

import { SumDashboard } from '@/modules/sum/components/SumDashboard';
import { MyReservations } from '@/modules/sum/components/MyReservations';
import { sumService } from '@/modules/sum/services/sum.service';
import { useEffect, useState } from 'react';

export default function SumPage() {
  const [initialHistory, setInitialHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // MOCK DATA FOR DEMO
  const profile = { id: 'mock-user' };
  const formattedUserUnits = [
    { unit_id: 'unit-1', units: { floor: '14', unit: 'B' } }
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await sumService.getMyReservations(profile.id);
        setInitialHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleReservationSuccess = (newRes: any) => {
    setInitialHistory(prev => [newRes, ...prev]);
  };

  if (loading) return <div className="p-10 text-center text-text-muted italic">Cargando disponibilidad...</div>;

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="font-display text-3xl font-bold text-primary-500 mb-2 text-glow">Reserva de SUM</h2>
        <p className="text-text-secondary">Seleccioná un día en el calendario para solicitar tu reserva.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SumDashboard 
            userUnits={formattedUserUnits} 
            initialHistory={initialHistory}
            onReservationSuccess={handleReservationSuccess}
          />
        </div>
        <div>
          <MyReservations reservations={initialHistory} />
        </div>
      </div>
    </div>
  );
}
