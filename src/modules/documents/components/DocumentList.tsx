'use client';

import { FileText, Download, Calendar, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { BuildingDocument } from '../types/document.types';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

interface DocumentListProps {
  documents: BuildingDocument[];
}

export function DocumentList({ documents }: DocumentListProps) {
  // Group by year and month
  const grouped = documents.reduce((acc, doc) => {
    const key = `${doc.period_year}-${doc.period_month}`;
    if (!acc[key]) {
      acc[key] = {
        year: doc.period_year,
        month: doc.period_month,
        docs: []
      };
    }
    acc[key].docs.push(doc);
    return acc;
  }, {} as Record<string, { year: number; month: number; docs: BuildingDocument[] }>);

  const groups = Object.values(grouped).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  if (documents.length === 0) {
    return (
      <Card padding="lg" className="text-center text-text-muted">
        No hay documentos disponibles.
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {groups.map((group) => (
        <div key={`${group.year}-${group.month}`} className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Calendar className="h-5 w-5 text-primary-600" />
            <h3 className="font-display font-bold text-lg text-text-primary">
              {MONTH_NAMES[group.month - 1]} {group.year}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.docs.map(doc => (
              <div 
                key={doc.id}
                className="group flex flex-col p-4 bg-surface border border-border-light rounded-2xl hover:border-primary-300 hover:shadow-lg hover:shadow-primary-500/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    <a 
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ver documento"
                      className="h-10 w-10 rounded-full hover:bg-slate-100 text-slate-400 hover:text-primary-600 flex items-center justify-center shrink-0 transition-colors"
                    >
                      <Eye className="h-5 w-5" />
                    </a>
                    <a 
                      href={`${doc.file_url}?download=`}
                      title="Descargar documento"
                      className="h-10 w-10 rounded-full hover:bg-slate-100 text-slate-400 hover:text-primary-600 flex items-center justify-center shrink-0 transition-colors"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-bold text-text-primary text-sm line-clamp-2">
                    {doc.title}
                  </h4>
                  <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest font-semibold">
                    Documento PDF
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
