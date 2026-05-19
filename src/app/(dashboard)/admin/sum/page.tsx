'use client';

import { AdminSumDashboard } from '@/modules/sum/components/AdminSumDashboard';
import { sumService } from '@/modules/sum/services/sum.service';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';
import { useEffect, useState } from 'react';

export default function AdminSumPage() {
  const [pendingReservations, setPendingReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await sumService.getPendingReservations(DEFAULT_BUILDING_ID);
      setPendingReservations(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center text-text-muted">Cargando gestión...</div>;

  return (
    <AdminSumDashboard initialPending={pendingReservations} />
  );
}
