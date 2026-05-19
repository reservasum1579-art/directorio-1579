'use client';

import { Sparkles, Info, AlertTriangle, TrendingDown, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { ExpenseInsight } from '../types/expenses.types';

interface InsightsPanelProps {
  insights: ExpenseInsight[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <div className="p-1.5 bg-[#d4af37]/20 rounded-lg text-[#d4af37]">
          <Sparkles className="h-4 w-4" />
        </div>
        <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest">
          Insights de Inteligencia
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {insights.map((insight) => (
          <Card 
            key={insight.id} 
            padding="md" 
            className="bg-[#0f172a] border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all cursor-default group"
          >
            <div className="flex gap-4">
              <div className={`shrink-0 p-2 rounded-xl h-fit ${
                insight.type === 'warning' ? 'bg-red-500/10 text-red-400' :
                insight.type === 'trend' ? 'bg-emerald-500/10 text-emerald-400' :
                'bg-blue-500/10 text-blue-400'
              }`}>
                {insight.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                 insight.type === 'trend' ? <TrendingDown className="h-4 w-4" /> :
                 <Info className="h-4 w-4" />}
              </div>
              
              <div className="flex-1 space-y-2">
                <p className="text-sm text-slate-200 leading-relaxed">
                  {insight.message}
                </p>
                <button className="flex items-center gap-1.5 text-[10px] font-bold text-[#d4af37] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver detalle <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </Card>
        ))}

        {insights.length === 0 && (
          <div className="text-center py-8 text-slate-500 italic text-sm">
            No hay insights disponibles para este período.
          </div>
        )}
      </div>
    </div>
  );
}
