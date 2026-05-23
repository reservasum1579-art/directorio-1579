'use client';

import { useState } from 'react';
import { X, Send, Save, AlertCircle, Eye, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Portal } from '@/components/Portal';
import type { Announcement } from '../types/news.types';

interface NewsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (announcement: Partial<Announcement>) => void;
  editingAnnouncement?: Announcement | null;
}

export function NewsEditorModal({ isOpen, onClose, onSave, editingAnnouncement }: NewsEditorModalProps) {
  const [formData, setFormData] = useState<Partial<Announcement & { image_url?: string }>>(
    editingAnnouncement || {
      title: '',
      content: '',
      is_important: false,
      status: 'draft'
    }
  );

  if (!isOpen) return null;

  const generateMockImage = () => {
    const topics = ['building', 'architecture', 'city', 'maintenance', 'meeting'];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    setFormData({ ...formData, image_url: `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800` });
  };

  const handleSubmit = (status: 'published' | 'draft') => {
    onSave({ ...formData, status, published_at: status === 'published' ? new Date().toISOString() : undefined });
    onClose();
  };

  return (
    <Portal><div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in max-h-[calc(100vh-2rem)] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="font-display text-lg font-bold text-text-primary">
            {editingAnnouncement ? 'Editar Comunicado' : 'Nuevo Comunicado Oficial'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:bg-background-warm hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-grow">
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-primary">Título del Anuncio</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
              placeholder="Ej: Mantenimiento de Ascensores"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-primary">Imagen de Portada (Opcional)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input 
                  type="text" 
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                  placeholder="Pegar URL de imagen..."
                />
              </div>
              <Button variant="secondary" onClick={generateMockImage} className="gap-2 shrink-0">
                <Sparkles className="h-4 w-4 text-amber-500" /> Demo IA
              </Button>
            </div>
            {formData.image_url && (
              <div className="mt-2 relative rounded-xl overflow-hidden border border-border h-32 w-full">
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setFormData({ ...formData, image_url: '' })}
                  className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-primary">Contenido del Mensaje</label>
            <textarea 
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none h-40 resize-none"
              placeholder="Escribí los detalles del comunicado aquí..."
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-background-warm rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${formData.is_important ? 'bg-error-500/10 text-error-500' : 'bg-primary-500/10 text-primary-500'}`}>
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">Marcar como Importante</p>
                <p className="text-xs text-text-muted">Aparecerá destacado en el Dashboard del vecino.</p>
              </div>
            </div>
            <button 
              onClick={() => setFormData({ ...formData, is_important: !formData.is_important })}
              className={`w-12 h-6 rounded-full transition-all relative ${formData.is_important ? 'bg-error-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${formData.is_important ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-background-warm flex items-center justify-between gap-3 shrink-0">
          <Button variant="secondary" onClick={() => handleSubmit('draft')} className="gap-2">
            <Save className="h-4 w-4" /> Guardar Borrador
          </Button>
          
          <div className="flex items-center gap-3">
             <Button variant="secondary" className="gap-2 hidden sm:flex">
              <Eye className="h-4 w-4" /> Previsualizar
            </Button>
            <Button onClick={() => handleSubmit('published')} className="gap-2 bg-primary-600 hover:bg-primary-700">
              <Send className="h-4 w-4" /> Publicar Ahora
            </Button>
          </div>
        </div>
      </div>
    </div>
    </Portal>
  );
}
