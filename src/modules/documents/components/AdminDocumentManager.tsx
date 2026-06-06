'use client';

import { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DocumentList } from './DocumentList';
import type { BuildingDocument } from '../types/document.types';
import { createDocumentRecordAction, deleteDocumentRecordAction } from '../actions/document.actions';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

interface AdminDocumentManagerProps {
  initialDocuments: BuildingDocument[];
}

export function AdminDocumentManager({ initialDocuments }: AdminDocumentManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const handleUpload = async () => {
    if (!file || !title) return;
    
    setLoading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(uniqueName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(uniqueName);

      await createDocumentRecordAction({
        building_id: DEFAULT_BUILDING_ID,
        title,
        file_url: publicUrlData.publicUrl,
        file_name: uniqueName,
        period_month: month,
        period_year: year
      });

      alert('Documento subido correctamente.');
      setIsModalOpen(false);
      setFile(null);
      setTitle('');
    } catch (err: any) {
      console.error('Error uploading document:', err);
      alert(`Error al subir documento: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-4xl font-black text-text-primary tracking-tight">
            Gestión de Documentos
          </h2>
          <p className="text-text-secondary mt-1 text-lg">
            Sube expensas, actas y otros archivos para el consorcio.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-2xl h-12 px-6 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/20"
        >
          <Plus className="h-4 w-4 mr-2" /> Subir Documento
        </Button>
      </header>

      <DocumentList documents={initialDocuments} />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-md border-primary-500/20 bg-surface shadow-2xl animate-scale-in max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden" padding="none">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-primary-600 text-white shrink-0">
              <h3 className="font-display font-bold text-lg">Nuevo Documento</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Título del documento</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Liquidación de Expensas"
                  className="w-full bg-background border border-border-light rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Mes</label>
                  <select 
                    value={month} 
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="w-full bg-background border border-border-light rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('es', { month: 'long' })}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Año</label>
                  <input 
                    type="number" 
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-background border border-border-light rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Archivo</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border-light border-dashed rounded-xl hover:border-primary-300 transition-colors bg-slate-50/50">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-8 w-8 text-slate-400" />
                    <div className="flex text-sm text-text-secondary justify-center">
                      <label className="relative cursor-pointer rounded-md font-semibold text-primary-600 hover:text-primary-500">
                        <span>{file ? file.name : 'Seleccionar archivo'}</span>
                        <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                      </label>
                    </div>
                    <p className="text-xs text-text-muted uppercase tracking-tighter font-bold">PDF, Word, Excel, Imagen</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border-light bg-background-warm flex justify-end gap-3 shrink-0">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button 
                onClick={handleUpload} 
                loading={loading}
                disabled={!file || !title}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 rounded-xl font-black text-xs uppercase"
              >
                Subir y Guardar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
