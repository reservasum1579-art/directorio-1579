'use client';

import { Plus, Newspaper, Megaphone, FileText, Trash2, Edit, Bell, Archive } from 'lucide-react';
import type { Announcement } from '../types/news.types';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NewsEditorModal } from './NewsEditorModal';
import { newsAdminService } from '../services/news.admin.service';
import { updateNewsStatusAction, deleteNewsAction, createNewsAction, updateNewsAction } from '../actions/news.actions';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';


interface AdminNewsManagerProps {
  initialNews: Announcement[];
}

export function AdminNewsManager({ initialNews }: AdminNewsManagerProps) {
  const [news, setNews] = useState(initialNews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const handleCreate = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<Announcement>) => {
    try {
      if (editingAnnouncement) {
        const updated = await updateNewsAction(editingAnnouncement.id, data);
        setNews(prev => prev.map(n => n.id === editingAnnouncement.id ? { ...n, ...updated } as Announcement : n));
      } else {
        const result = await createNewsAction({ ...data, building_id: DEFAULT_BUILDING_ID });
        setNews(prev => [result as Announcement, ...prev]);
      }
      setIsModalOpen(false);
      setEditingAnnouncement(null);
    } catch (error) {
      console.error(error);
      alert('Error al guardar la noticia.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este comunicado?')) {
      try {
        await deleteNewsAction(id);
        setNews(prev => prev.filter(n => n.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateNewsStatusAction(id, 'published');
      setNews(prev => prev.map(n => n.id === id ? { ...n, status: 'published', published_at: new Date().toISOString() } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('¿Archivar este comunicado? Quedará visible en la pestaña de Archivadas.')) return;
    try {
      await updateNewsStatusAction(id, 'archived');
      setNews(prev => prev.map(n => n.id === id ? { ...n, status: 'archived' } : n));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-text-primary mb-2">
            Gestión de Noticias
          </h2>
          <p className="text-text-secondary">
            Publicá comunicados oficiales y novedades para los residentes.
          </p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-600/20 active:scale-95 shrink-0"
        >
          <Plus className="h-5 w-5" />
          Nueva Noticia
        </button>
      </header>

      <NewsEditorModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingAnnouncement(null); }}
        onSave={handleSave}
        editingAnnouncement={editingAnnouncement}
      />

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card padding="md" className="flex items-center gap-4 bg-primary-500/5 border-primary-500/10">
          <div className="h-10 w-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Publicadas</p>
            <p className="text-xl font-display font-bold text-text-primary">{news.filter(n => n.status === 'published').length}</p>
          </div>
        </Card>
        <Card padding="md" className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-warning-500/10 flex items-center justify-center text-warning-500">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Borradores</p>
            <p className="text-xl font-display font-bold text-text-primary">{news.filter(n => n.status === 'draft').length}</p>
          </div>
        </Card>
        <Card padding="md" className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-error-500/10 flex items-center justify-center text-error-500">
            <Newspaper className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Urgentes</p>
            <p className="text-xl font-display font-bold text-text-primary">{news.filter(n => n.is_important).length}</p>
          </div>
        </Card>
        <Card padding="md" className="flex items-center gap-4 border-warning-500/20">
          <div className="h-10 w-10 rounded-lg bg-warning-500/10 flex items-center justify-center text-warning-500">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Pendientes</p>
            <p className="text-xl font-display font-bold text-warning-500">{news.filter(n => n.status === 'pending').length}</p>
          </div>
        </Card>
      </div>

      {/* News List */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-background-warm text-text-muted font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-6 py-4">Comunicado</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {news.map(item => (
              <tr key={item.id} className="hover:bg-background-warm transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${item.is_important ? 'bg-error-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-success-500'}`} />
                    <div>
                      <p className="font-bold text-text-primary leading-tight">{item.title}</p>
                      <p className="text-[10px] text-text-muted mt-0.5 uppercase">{item.is_important ? 'Urgente' : 'Normal'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <Badge 
                    variant={item.status === 'published' ? 'success' : item.status === 'pending' ? 'warning' : 'accent'} 
                    size="sm"
                  >
                    {item.status === 'published' ? 'Publicado' : item.status === 'pending' ? 'Pendiente' : 'Borrador'}
                  </Badge>
                </td>
                <td className="px-6 py-5 text-text-secondary">
                  {item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Pendiente'}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-1">
                    {item.status === 'pending' && (
                      <button 
                        onClick={() => handleApprove(item.id)}
                        className="p-2 hover:bg-success-50 rounded-lg text-success-500 hover:text-success-600 transition-all font-bold text-xs"
                        title="Aprobar y Publicar"
                      >
                        Aprobar
                      </button>
                    )}
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-2 hover:bg-primary-50 rounded-lg text-text-muted hover:text-primary-600 transition-all"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {item.status === 'published' && (
                      <button 
                        onClick={() => handleArchive(item.id)}
                        className="p-2 hover:bg-warning-50 rounded-lg text-text-muted hover:text-warning-600 transition-all"
                        title="Archivar"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-error-50 rounded-lg text-text-muted hover:text-error-600 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
