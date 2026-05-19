'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SumReservation } from '../types/sum.types';

interface SumCalendarProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  onDateSelect: (date: string) => void;
  getDayAvailability: (dateString: string) => {
    isFullyBooked: boolean;
    isPartiallyBooked: boolean;
    hasMorning: boolean;
    hasNight: boolean;
    reservations: SumReservation[];
  };
  isLoading?: boolean;
}

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function SumCalendar({
  currentDate,
  onMonthChange,
  onDateSelect,
  getDayAvailability,
  isLoading = false
}: SumCalendarProps) {
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create calendar grid
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  const isPast = (day: number) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="bg-surface rounded-[--radius-lg] border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-light bg-background-warm">
        <button 
          onClick={handlePrevMonth}
          className="p-1.5 rounded-[--radius-sm] hover:bg-border text-text-secondary transition-colors"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-display font-semibold text-text-primary capitalize">
          {currentDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
        </h3>
        <button 
          onClick={handleNextMonth}
          className="p-1.5 rounded-[--radius-sm] hover:bg-border text-text-secondary transition-colors"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 border-b border-border-light">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-text-muted">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className={cn("grid grid-cols-7 relative", isLoading && "opacity-50 pointer-events-none")}>
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="min-h-[80px] p-1 sm:p-2 border-b border-r border-border-light/50 bg-background/50" />;
          }

          const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const past = isPast(day);
          const availability = getDayAvailability(dateString);

          return (
            <button
              key={day}
              onClick={() => !past && onDateSelect(dateString)}
              disabled={past || availability.isFullyBooked}
              className={cn(
                "min-h-[80px] p-1 sm:p-2 border-b border-r border-border-light/50 transition-colors flex flex-col items-center justify-start gap-1 relative",
                !past && !availability.isFullyBooked && "hover:bg-primary-50 cursor-pointer active:bg-primary-100",
                past && "bg-background-warm text-text-muted cursor-not-allowed",
                availability.isFullyBooked && !past && "bg-error-50/30 cursor-not-allowed"
              )}
            >
              <span className={cn(
                "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium",
                isToday(day) && "bg-primary-700 text-white shadow-sm"
              )}>
                {day}
              </span>
              
              {/* Availability indicators */}
              <div className="w-full flex flex-col gap-1 px-1 mt-auto">
                <div className={cn(
                  "h-4 w-full rounded-sm text-[8px] flex items-center justify-center leading-none font-bold transition-all",
                  availability.hasMorning 
                    ? (past ? "bg-slate-300 text-slate-600" : "bg-error-500/80 text-white")
                    : (past ? "bg-transparent text-slate-400" : "bg-success-500/10 text-success-600 border border-success-500/20")
                )}>
                  {availability.hasMorning 
                    ? (availability.reservations.find(r => r.shift_type === 'morning' || r.shift_type === 'full_day')?.units?.floor || '') + (availability.reservations.find(r => r.shift_type === 'morning' || r.shift_type === 'full_day')?.units?.unit || '')
                    : (past ? "-" : "LIBRE")}
                </div>
                
                <div className={cn(
                  "h-4 w-full rounded-sm text-[8px] flex items-center justify-center leading-none font-bold transition-all",
                  availability.hasNight 
                    ? (past ? "bg-slate-300 text-slate-600" : "bg-error-500/80 text-white")
                    : (past ? "bg-transparent text-slate-400" : "bg-success-500/10 text-success-600 border border-success-500/20")
                )}>
                  {availability.hasNight 
                    ? (availability.reservations.find(r => r.shift_type === 'night' || r.shift_type === 'full_day')?.units?.floor || '') + (availability.reservations.find(r => r.shift_type === 'night' || r.shift_type === 'full_day')?.units?.unit || '')
                    : (past ? "-" : "LIBRE")}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="p-3 border-t border-border-light bg-background-warm flex items-center justify-center gap-4 text-xs text-text-secondary">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-success-500" /> Libre
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-error-500" /> Ocupado
        </div>
      </div>
    </div>
  );
}
