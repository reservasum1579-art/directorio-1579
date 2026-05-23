'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ResolveIncidentModal } from './ResolveIncidentModal';
import { Badge } from '@/components/ui/Badge';
import { MaintenanceTask, MaintenanceIncident } from '../types/maintenance.types';
import { Bug, Droplet, ArrowUpDown, Flame, Wrench, AlertTriangle, Clock } from 'lucide-react';

interface MaintenanceTimelineProps {
  tasks: MaintenanceTask[];
  incidents: MaintenanceIncident[];
  onIncidentResolved?: (incident: MaintenanceIncident) => void;
}

type FilterType = 'semestral' | 'anual' | 'total';

interface TimelineEvent {
  id: string;
  type: 'task' | 'incident' | 'today' | 'month-marker';
  title: string;
  date: Date;
  description: string | null;
  status: string;
  priorityOrFrequency: string;
}

// Function to choose the best icon based on title or type
function getEventIcon(event: TimelineEvent, className: string = "w-5 h-5") {
  if (event.type === 'incident') return <AlertTriangle className={className} />;
  
  const lowerTitle = event.title.toLowerCase();
  if (lowerTitle.includes('fumigaci')) return <Bug className={className} />;
  if (lowerTitle.includes('tanque') || lowerTitle.includes('agua')) return <Droplet className={className} />;
  if (lowerTitle.includes('ascensor')) return <ArrowUpDown className={className} />;
  if (lowerTitle.includes('matafuego')) return <Flame className={className} />;
  
  return <Wrench className={className} />;
}

export function MaintenanceTimeline({ tasks, incidents, onIncidentResolved }: MaintenanceTimelineProps & { onIncidentResolved?: (incident: MaintenanceIncident) => void }) {
  const [filter, setFilter] = useState<FilterType>('semestral');
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<MaintenanceIncident | null>(null);

  // Combine and format events
  const allEvents: TimelineEvent[] = [
    ...tasks
      .filter((t) => t.next_due_date)
      .map((t) => ({
        id: `task-${t.id}`,
        type: 'task' as const,
        title: t.title,
        date: new Date(t.next_due_date!),
        description: t.vendor ? `Proveedor: ${t.vendor}` : t.description,
        status: new Date(t.next_due_date!) < new Date() ? 'overdue' : 'pending',
        priorityOrFrequency: t.frequency,
      })),
    ...incidents.map((i) => ({
      id: `inc-${i.id}`,
      type: 'incident' as const,
      title: i.title,
      date: new Date(i.created_at),
      description: i.location ? `Ubicación: ${i.location}` : i.description,
      status: i.status,
      priorityOrFrequency: i.priority,
    })),
  ];

  // Inject Today marker
  allEvents.push({
    id: 'today-marker',
    type: 'today' as any,
    title: 'Hoy',
    date: new Date(),
    description: null,
    status: 'today',
    priorityOrFrequency: '',
  });

  // Sort chronologically
  allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Filter based on selected time range
  const filteredEvents = allEvents.filter((event) => {
    if (filter === 'total') return true;
    
    const now = new Date();
    const eventDate = event.date;
    const diffMonths = (eventDate.getFullYear() - now.getFullYear()) * 12 + (eventDate.getMonth() - now.getMonth());

    if (filter === 'semestral') {
      return diffMonths >= -1 && diffMonths <= 6;
    }
    if (filter === 'anual') {
      return diffMonths >= -2 && diffMonths <= 12;
    }
    return true;
  });

  // Inject month markers
  const eventsWithMarkers: TimelineEvent[] = [];
  let currentMonthYear = '';

  filteredEvents.forEach((event) => {
    if (event.type === 'today') {
      eventsWithMarkers.push(event);
      return;
    }
    
    const eventMonthYear = `${event.date.getMonth()}-${event.date.getFullYear()}`;
    if (eventMonthYear !== currentMonthYear) {
      currentMonthYear = eventMonthYear;
      eventsWithMarkers.push({
        id: `month-marker-${currentMonthYear}`,
        type: 'month-marker' as any,
        title: event.date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        date: event.date,
        description: null,
        status: 'marker',
        priorityOrFrequency: '',
      });
    }
    eventsWithMarkers.push(event);
  });

  return (
    <Card className="p-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Línea de Tiempo</h3>
          <p className="text-sm text-text-secondary">Cronograma de mantenimientos e incidentes</p>
        </div>
        
        <div className="flex bg-surface border border-border-light rounded-[--radius-md] p-1">
          {(['semestral', 'anual', 'total'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-[--radius-sm] transition-all capitalize ${
                filter === f
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-text-secondary hover:bg-background-warm'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Timeline Container */}
      <div className="relative w-full overflow-x-auto pb-12 pt-6 custom-scrollbar">
        {filteredEvents.length === 0 ? (
          <div className="text-text-muted text-sm italic text-center py-8">
            No hay eventos para el período seleccionado.
          </div>
        ) : (
          <div className="relative min-w-max flex gap-8 px-8 items-center min-h-[200px]">
            {/* The horizontal connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-border-light -translate-y-1/2 z-0 rounded-full" />
            
            {eventsWithMarkers.map((event, index) => {
              if (event.type === 'today') {
                return (
                  <div key={event.id} className="relative flex flex-col items-center w-12 shrink-0 group">
                    {/* Vertical Dashed Line for Today */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-0 h-48 border-l-2 border-dashed border-primary-400/60 z-0" />
                    
                    {/* Main Icon on the Line */}
                    <div className={`relative z-10 w-6 h-6 rounded-full border-4 border-surface bg-primary-500 shadow-sm`} />
                    <div className="absolute top-1/2 mt-4 bg-primary-100 text-primary-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                      HOY
                    </div>
                  </div>
                );
              }

              if (event.type === 'month-marker') {
                return (
                  <div key={event.id} className="relative flex flex-col items-center w-16 shrink-0">
                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-border-light z-0" />
                    <div className="absolute top-1/2 mt-3 text-text-muted text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">
                      {event.title}
                    </div>
                  </div>
                );
              }

              const isTask = event.type === 'task';
              const isPast = event.date < new Date();
              const isTop = index % 2 === 0; // Alternate above and below the line
              
              // Icon color logic
              let iconBgClass = 'bg-primary-500';
              if (isTask && isPast) iconBgClass = 'bg-error-500';
              if (!isTask) {
                iconBgClass = event.status === 'resolved' ? 'bg-success-500' : 'bg-warning-500';
              }

              return (
                <div key={event.id} className="relative flex flex-col items-center group w-56 shrink-0" onClick={() => {
                  if (!isTask) {
                    setSelectedIncident(event as any);
                    setIsResolveOpen(true);
                  }
                }} style={{ cursor: !isTask ? 'pointer' : 'default' }}>
                  
                  {/* Card Container - Positioning Alternates */}
                  <div className={`absolute ${isTop ? 'bottom-12' : 'top-12'} w-full transition-transform group-hover:-translate-y-1`}>
                    <div className="bg-surface border border-border-light rounded-[--radius-md] p-3 shadow-sm hover:border-primary-200 hover:shadow-md transition-all">
                      
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <Badge variant={isTask ? 'info' : 'warning'} className="text-[9px] px-1.5 py-0.5 leading-tight uppercase">
                          {isTask ? 'Mant' : 'Incid'}
                        </Badge>
                        <span className="text-[10px] font-medium text-text-secondary flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.date.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-text-primary text-sm leading-tight mb-1">
                        {event.title}
                      </h4>
                      
                      {event.description && (
                        <p className="text-xs text-text-secondary line-clamp-2 leading-snug">
                          {event.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Connecting dot line to the main line */}
                    <div className={`absolute left-1/2 -translate-x-1/2 w-0.5 h-6 bg-border-light z-0 ${isTop ? '-bottom-6' : '-top-6'}`} />
                  </div>

                  {/* Main Icon on the Line */}
                  <div className={`relative z-10 w-12 h-12 rounded-full border-4 border-surface shadow-sm flex items-center justify-center text-white transition-transform group-hover:scale-110 ${iconBgClass}`}>
                    {getEventIcon(event)}
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolve Incident Modal */}
      {isResolveOpen && selectedIncident && (
        <ResolveIncidentModal
          incident={selectedIncident}
          onClose={() => setIsResolveOpen(false)}
          onSuccess={(updated) => {
            setIsResolveOpen(false);
            setSelectedIncident(null);
            if (onIncidentResolved) onIncidentResolved(updated);
          }}
        />
      )}
    </Card>
  );
}
