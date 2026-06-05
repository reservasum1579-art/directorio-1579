'use client';

import { useState } from 'react';
import { Calendar, ArrowRight, Bell, Zap, Construction, ShieldAlert, Archive, Plus } from 'lucide-react';
import type { Announcement } from '../types/news.types';
import { formatShortDate, formatDateTime } from '@/lib/utils';
import { newsService } from '../services/news.service';
import { Badge } from '@/components/ui/badge';
import { NewsEditorModal } from './NewsEditorModal';
import { createNewsAction, updateNewsAction } from '../actions/news.actions';
import { AnnouncementDetailModal } from './AnnouncementDetailModal';

interface NewsFeedProps {
  initialAnnouncements: Announcement[];
  totalCount: number;
  buildingId: string;
  isAdmin: boolean;
}

export function NewsFeed({ initialAnnouncements, totalCount, buildingId, isAdmin }: NewsFeedProps) {
  const [activeTab, setActiveTab] = useState<'published' | 'archived'>('published');
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(10);
  const [hasMore, setHasMore] = useState(totalCount > 10);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const loadMore = async () => {
    setIsLoadingMore(true);
    try {
      const { data } = await newsService.getAnnouncements(buildingId, {
        status: activeTab,
        limit: 10,
        offset: offset
      });
      setAnnouncements(prev => [...prev, ...data]);
      setOffset(prev => prev + 10);
      if (data.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more news:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleTabChange = async (tab: 'published' | 'archived') => {
    setActiveTab(tab);
    setOffset(0);
    setAnnouncements([]); // Clear while loading
    try {
      const { data, count } = await newsService.getAnnouncements(buildingId, {
        status: tab,
        limit: 10,
        offset: 0
      });
      setAnnouncements(data);
      setOffset(10);
      setHasMore(count > 10);
    } catch (error) {
      console.error('Error changing tab:', error);
    }
  };

  const getBorderColor = (index: number) => {
    const colors = ['neon-border-lime', 'neon-border-violet', 'neon-border-warning'];
    return colors[index % colors.length];
  };

  const getIcon = (index: number) => {
    const icons = [Calendar, Zap, Construction, Bell];
    const Icon = icons[index % icons.length];
    return <Icon className="h-5 w-5" />;
  };

  // Filter the loaded announcements by the active tab if they were loaded in the initial SSR batch
  const displayedAnnouncements = announcements.filter(a => a.status === activeTab);

  const featured = displayedAnnouncements.find(a => a.is_important) || displayedAnnouncements[0];
  const others = displayedAnnouncements.filter(a => a.id !== featured?.id);

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-8">
        <h2 className="font-display text-3xl font-bold text-primary-500 mb-2 text-glow">
          Noticias y Anuncios
        </h2>
        <p className="font-sans text-text-secondary max-w-2xl mb-6">
          Mantenete informado con los últimos comunicados de la administración, reglas de convivencia y eventos del consorcio.
        </p>

        {/* Tabs and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 gap-4 pb-2">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => handleTabChange('published')}
              className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'published'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-text-muted hover:text-text-primary hover:border-white/20'
              }`}
            >
              Activas
            </button>
            <button
              onClick={() => handleTabChange('archived')}
              className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === 'archived'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-text-muted hover:text-text-primary hover:border-white/20'
              }`}
            >
              <Archive className="h-4 w-4" /> Archivadas
            </button>
          </div>
          
          <button 
            onClick={() => setIsEditorOpen(true)}
            className="flex items-center gap-2 bg-primary-600/10 hover:bg-primary-600/20 text-primary-400 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-primary-500/20 shrink-0"
          >
            <Plus className="h-4 w-4" /> 
            {isAdmin ? 'Nueva Noticia' : 'Sugerir Noticia'}
          </button>
        </div>
      </header>

      <NewsEditorModal 
        isOpen={isEditorOpen}
        onClose={() => { setIsEditorOpen(false); setEditingAnnouncement(null); }}
        isAdmin={isAdmin}
        editingAnnouncement={editingAnnouncement}
        onSave={async (announcement) => {
          try {
            if (editingAnnouncement) {
              // Update existing
              const updated = await updateNewsAction(editingAnnouncement.id, announcement);
              setAnnouncements(prev =>
                prev.map(a => a.id === editingAnnouncement.id ? { ...a, ...updated } : a)
              );
            } else {
              // Create new
              await createNewsAction({ ...announcement, building_id: buildingId });
              if (isAdmin && announcement.status === 'published' && activeTab === 'published') {
                handleTabChange('published');
              } else if (!isAdmin) {
                alert('Tu noticia ha sido enviada para su revisión.');
              }
            }
            setIsEditorOpen(false);
            setEditingAnnouncement(null);
          } catch(e) {
            console.error(e);
            alert('Hubo un error al guardar.');
          }
        }}
      />

      <AnnouncementDetailModal
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        isAdmin={isAdmin}
        onEdit={(a) => {
          setEditingAnnouncement(a);
          setIsEditorOpen(true);
        }}
      />

      {!displayedAnnouncements.length ? (
        <div className="text-center py-20 glass-panel rounded-xl">
          <Bell className="h-12 w-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary font-medium">No hay noticias en esta sección.</p>
        </div>
      ) : (
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
                      <span suppressHydrationWarning className="text-text-muted text-[10px] font-bold tracking-wider uppercase">
                        Publicado: {formatShortDate(featured.published_at || featured.created_at)}
                      </span>
                      {featured.event_date && (
                        <span suppressHydrationWarning className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-primary-500/30 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Evento: {formatDateTime(featured.event_date)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-text-primary mb-3">
                      {featured.title}
                    </h3>
                    <p className="font-sans text-sm text-text-secondary mb-6 line-clamp-3">
                      {featured.content}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedAnnouncement(featured)}
                    className="flex items-center gap-2 text-primary-500 font-semibold hover:translate-x-2 transition-transform text-sm group/btn"
                  >
                    Leer más <ArrowRight className="h-4 w-4 group-hover/btn:text-primary-400" />
                  </button>
                </div>
              </div>
            </article>
          )}

          {/* Side / Grid Cards */}
          {others.map((announcement, index) => (
            <article key={announcement.id} className="md:col-span-4 group">
              <div className={`glass-panel p-6 rounded-xl ${getBorderColor(index)} h-full transition-all duration-300 hover:bg-white/[0.06] flex flex-col`}>
                <div className="mb-4 flex gap-2 flex-wrap">
                  <span className="bg-surface-bright text-text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-border-light">
                    Anuncio
                  </span>
                  {announcement.event_date && (
                    <span suppressHydrationWarning className="bg-primary-500/10 text-primary-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-primary-500/20 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Evento: {formatDateTime(announcement.event_date)}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                  {announcement.title}
                </h3>
                <p className="font-sans text-sm text-text-secondary flex-grow mb-6 line-clamp-4">
                  {announcement.content}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span suppressHydrationWarning className="text-text-muted text-[10px] font-bold tracking-wider uppercase">
                    {formatShortDate(announcement.published_at || announcement.created_at)}
                  </span>
                  <button
                    onClick={() => setSelectedAnnouncement(announcement)}
                    className="flex items-center gap-1 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors group/btn"
                  >
                    Leer más <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 rounded-xl bg-surface-bright border border-white/10 text-text-primary hover:bg-white/10 transition-colors font-medium flex items-center gap-2"
          >
            {isLoadingMore ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}
    </div>
  );
}
