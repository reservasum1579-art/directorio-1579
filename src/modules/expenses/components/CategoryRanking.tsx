'use client';

import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import type { ExpenseCategory } from '../types/expenses.types';

interface CategoryRankingProps {
  categories: ExpenseCategory[];
}

export function CategoryRanking({ categories }: CategoryRankingProps) {
  // Sort by amount descending
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);

  return (
    <Card padding="none" className="bg-[#0f172a] border-[#d4af37]/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#d4af37]/10 bg-[#d4af37]/5">
        <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest flex items-center gap-2">
          Ranking por Categorías
        </h3>
      </div>
      <div className="divide-y divide-[#d4af37]/5">
        {sortedCategories.map((category) => (
          <div key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors">
                  {category.name}
                </span>
                {category.is_extraordinary && (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/20 uppercase tracking-tighter">
                    Extraordinario
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-tight">
                Anterior: {formatCurrency(category.previous_amount)}
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-bold text-white">
                  {formatCurrency(category.amount)}
                </p>
                <div className={`flex items-center justify-end gap-1 text-[10px] font-bold ${
                  category.variation > 10 ? 'text-red-400' : category.variation > 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {category.variation > 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : category.variation < 0 ? (
                    <ArrowDownRight className="h-3 w-3" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                  {Math.abs(category.variation).toFixed(1)}%
                </div>
              </div>
              
              {category.variation > 15 && !category.is_extraordinary && (
                <div className="text-amber-500 animate-pulse" title="Aumento significativo detectado">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
