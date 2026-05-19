'use client';

import { useState, useEffect, useCallback } from 'react';
import { sumService } from '../services/sum.service';
import type { SumReservation } from '../types/sum.types';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';

export function useSum(currentYear: number, currentMonth: number) {
  const [reservations, setReservations] = useState<SumReservation[]>([]);
  const [rules, setRules] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [resData, rulesData] = await Promise.all([
        sumService.getReservationsByMonth(currentYear, currentMonth, DEFAULT_BUILDING_ID),
        sumService.getSumRules(DEFAULT_BUILDING_ID)
      ]);

      setReservations(resData);
      setRules(rulesData);
    } catch (err) {
      console.error('Error fetching SUM data:', err);
      setError('No se pudo cargar la información del SUM. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [currentYear, currentMonth]);

  useEffect(() => {
    fetchMonthData();
  }, [fetchMonthData]);

  // Helper to check day availability
  const getDayAvailability = (dateString: string) => {
    const dayReservations = reservations.filter(
      (r) => r.reservation_date === dateString
    );

    const hasMorning = dayReservations.some(
      (r) => r.shift_type === 'morning' || r.shift_type === 'full_day'
    );
    const hasNight = dayReservations.some(
      (r) => r.shift_type === 'night' || r.shift_type === 'full_day'
    );

    return {
      isFullyBooked: hasMorning && hasNight,
      isPartiallyBooked: hasMorning || hasNight,
      hasMorning,
      hasNight,
      reservations: dayReservations
    };
  };

  return {
    reservations,
    rules,
    loading,
    error,
    refetch: fetchMonthData,
    getDayAvailability
  };
}
