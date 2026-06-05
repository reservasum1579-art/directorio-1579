'use client';

import { X, Calendar, Clock, User, AlertCircle, Pencil } from 'lucide-react';
import { Portal } from '@/components/Portal';
import type { Announcement } from '../types/news.types';
import { formatShortDate, formatDateTime } from '@/lib/utils';

interface AnnouncementDetailModalProps {
  announcement: Announcement | null;
  onClose: () => void;
  isAdmin?: boolean;
  onEdit?: (announcement: Announcement) => void;
}

export function AnnouncementDetailModal({ announcement, onClose, isAdmin, onEdit }: AnnouncementDetailModalProps) {
  if (!announcement) return null;

  const authorName = announcement.profiles
    ? `${announcement.profiles.first_name} ${announcement.profiles.last_name}`
    : 'Administración';

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        <div
          className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero Image */}
          {announcement.announcement_attachments?.[0]?.file_url && (
            <div className="w-full h-56 overflow-hidden shrink-0">
              <img
                src={announcement.announcement_attachments[0].file_url}
                alt="Portada"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-border shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              {announcement.is_important && (
                <span className="bg-error-500/10 text-error-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-error-500/20 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Urgente
                </span>
              )}
              {announcement.event_date && (
                <span suppressHydrationWarning className="bg-primary-500/10 text-primary-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-primary-500/20 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Evento: {formatDateTime(announcement.event_date)}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:bg-background-warm hover:text-text-primary transition-colors shrink-0 ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 overflow-y-auto flex-grow space-y-4">
            <h2 className="font-display text-2xl font-bold text-text-primary leading-snug">
              {announcement.title}
            </h2>

            <div className="flex items-center gap-4 text-[11px] text-text-muted font-medium uppercase tracking-wide">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> {authorName}
              </span>
              <span suppressHydrationWarning className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {formatShortDate(announcement.published_at || announcement.created_at)}
              </span>
            </div>

            <p className="font-sans text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {announcement.content}
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-background-warm shrink-0 flex items-center justify-between">
            <div>
              {isAdmin && onEdit && (
                <button
                  onClick={() => { onEdit(announcement); onClose(); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600/10 hover:bg-primary-600/20 text-primary-400 text-sm font-semibold transition-colors border border-primary-500/20"
                >
                  <Pencil className="h-4 w-4" /> Editar comunicado
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-border text-text-secondary hover:bg-white/10 text-sm font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
