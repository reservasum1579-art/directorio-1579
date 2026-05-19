'use client';

import { Calendar, ArrowRight, Bell, Zap, Construction, ShieldAlert, Image as ImageIcon } from 'lucide-react';
import type { Announcement } from '../types/news.types';
import { formatShortDate } from '@/lib/utils';

interface NewsFeedProps {
  announcements: Announcement[];
}

export function NewsFeed({ announcements }: NewsFeedProps) {
  if (!announcements.length) {
    return (
      <div className="text-center py-20 glass-panel rounded-xl">
        <Bell className="h-12 w-12 text-text-muted mx-auto mb-3" />
        <p className="text-text-secondary font-medium">No hay novedades por el momento.</p>
      </div>
    );
  }

  // The first important announcement becomes the "Featured" hero card.
  // The rest fall into the grid.
  const featured = announcements.find(a => a.is_important) || announcements[0];
  const others = announcements.filter(a => a.id !== featured.id);

  const getBorderColor = (index: number) => {
    const colors = ['neon-border-lime', 'neon-border-violet', 'neon-border-warning'];
    return colors[index % colors.length];
  };

  const getIcon = (index: number) => {
    const icons = [Calendar, Zap, Construction, Bell];
    const Icon = icons[index % icons.length];
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-8">
        <h2 className="font-display text-3xl font-bold text-primary-500 mb-2 text-glow">
          Noticias y Anuncios
        </h2>
        <p className="font-sans text-text-secondary max-w-2xl">
          Mantenete informado con los últimos comunicados de la administración, reglas de convivencia y eventos del consorcio.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 stagger-children">
        {/* Featured Card (Wide) */}
        {featured && (
          <article className="md:col-span-8 group">
            <div className="glass-panel rounded-xl overflow-hidden neon-border-cyan flex flex-col md:flex-row transition-all duration-300 hover:bg-white/[0.06] hover:shadow-neon-primary h-full">
              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden bg-background-warm flex items-center justify-center">
                {featured.announcement_attachments?.[0]?.file_url ? (
                  <img 
                    src={featured.announcement_attachments[0].file_url} 
                    alt="Featured" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900/50 to-background">
                     <ShieldAlert className="h-20 w-20 text-primary-500/20" />
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col justify-between md:w-1/2">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {featured.is_important ? (
                      <span className="bg-error-500/10 text-error-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-error-500/20 shadow-neon-error">
                        Urgente
                      </span>
                    ) : (
                      <span className="bg-primary-500/10 text-primary-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-primary-500/20">
                        Destacado
                      </span>
                    )}
                    <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase">
                      {formatShortDate(featured.published_at || featured.created_at)}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-text-primary mb-3">
                    {featured.title}
                  </h3>
                  <p className="font-sans text-sm text-text-secondary mb-6 line-clamp-3">
                    {featured.content}
                  </p>
                </div>
                <button className="flex items-center gap-2 text-primary-500 font-semibold hover:translate-x-2 transition-transform text-sm group/btn">
                  Leer comunicado <ArrowRight className="h-4 w-4 group-hover/btn:text-primary-400" />
                </button>
              </div>
            </div>
          </article>
        )}

        {/* Side / Grid Cards */}
        {others.map((announcement, index) => (
          <article key={announcement.id} className="md:col-span-4 group">
            <div className={`glass-panel p-6 rounded-xl ${getBorderColor(index)} h-full transition-all duration-300 hover:bg-white/[0.06] flex flex-col`}>
              <div className="mb-4">
                <span className="bg-surface-bright text-text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-border-light">
                  Anuncio
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                {announcement.title}
              </h3>
              <p className="font-sans text-sm text-text-secondary flex-grow mb-6 line-clamp-4">
                {announcement.content}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase">
                  {formatShortDate(announcement.published_at || announcement.created_at)}
                </span>
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-text-secondary hover:text-text-primary">
                  {getIcon(index)}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
