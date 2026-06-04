'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { extractDataFromPdfAction, publishExpensesAction } from '@/modules/admin/expenses/actions/admin-expenses.actions';
import { createClient } from '@/lib/supabase/client';

const BUILDING_ID = process.env.NEXT_PUBLIC_BUILDING_ID || '';

export default function AdminExpensesUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processWithAI = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStep(2);

    try {
      // 1. Convert to Base64
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');

      // 2. Extract Data via Gemini
      const result = await extractDataFromPdfAction(base64);

      if (result.success) {
        setExtractedData(result.data);
        setStep(3);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Error procesando PDF:', error);
      alert('Error IA: ' + (error.message || String(error)));
      setStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmAndPublish = async () => {
    setIsProcessing(true);
    try {
      const supabase = createClient();
      
      // 1. Subir el PDF original a Storage
      const fileExt = file!.name.split('.').pop();
      const fileName = `liquidacion-${extractedData.period_year}-${extractedData.period_month}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('expenses-pdfs')
        .upload(fileName, file!);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error('Error subiendo PDF: ' + uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('expenses-pdfs')
        .getPublicUrl(fileName);

      if (!BUILDING_ID) {
        throw new Error('Error de configuración: NEXT_PUBLIC_BUILDING_ID no está definido');
      }

      // 2. Publicar a DB y prorratear entre unidades
      const result = await publishExpensesAction(publicUrl, extractedData, BUILDING_ID);

      if (result.success) {
        alert('Expensas publicadas exitosamente!');
        router.push('/admin/expenses');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error(error);
      alert('Error publicando las expensas: ' + (error.message || JSON.stringify(error)));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <header>
        <h1 className="font-display text-3xl font-bold text-text-primary tracking-tight">Nueva Liquidación</h1>
        <p className="text-text-secondary mt-1">Carga el PDF y la IA se encargará del resto.</p>
      </header>

      {step === 1 && (
        <Card padding="lg" className="text-center space-y-6">
          <div className="mx-auto h-24 w-24 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center">
            <Upload className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Subir PDF de Expensas</h2>
            <p className="text-sm text-text-muted mt-2">Arrastra el archivo generado por tu sistema contable.</p>
          </div>

          <div className="flex justify-center">
            <label className="cursor-pointer bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
              Seleccionar Archivo
              <input type="file" className="hidden" accept="application/pdf" onChange={handleFileSelect} />
            </label>
          </div>

          {file && (
            <div className="mt-8 flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-border-light max-w-sm mx-auto">
              <div className="flex items-center gap-3">
                <FileText className="text-primary-500" />
                <span className="font-medium text-sm truncate max-w-[200px]">{file.name}</span>
              </div>
              <Button onClick={processWithAI} disabled={isProcessing}>
                Procesar <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>
      )}

      {step === 2 && (
        <Card padding="lg" className="text-center space-y-6">
          <Loader2 className="h-16 w-16 text-primary-600 animate-spin mx-auto" />
          <h2 className="text-2xl font-display font-bold">La IA está leyendo el documento...</h2>
          <p className="text-text-muted">Extrayendo totales, categorías y variaciones (toma unos 5-10 segundos).</p>
        </Card>
      )}

      {step === 3 && extractedData && (
        <div className="space-y-6">
          <Badge variant="success" className="px-4 py-1">Extracción Exitosa</Badge>
          
          <Card padding="lg" className="border-primary-200 shadow-xl bg-gradient-to-br from-white to-primary-50/30">
            <h2 className="text-2xl font-bold mb-6">Revisión Final</h2>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-xs font-bold text-text-muted uppercase">Período Detectado</p>
                <p className="text-2xl font-black">{extractedData.period_month} / {extractedData.period_year}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase">Total Expensas</p>
                <p className="text-3xl font-black text-primary-600">${extractedData.total_expenses.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-bold border-b pb-2">Categorías Detectadas ({extractedData.categories.length})</p>
              {extractedData.categories.map((c: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-border-light">
                  <span className="font-medium">{c.name}</span>
                  <span className="font-bold">${c.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex gap-4 justify-end border-t pt-6">
              <Button variant="outline" onClick={() => setStep(1)}>Volver a subir</Button>
              <Button onClick={confirmAndPublish} disabled={isProcessing} className="bg-success-600 hover:bg-success-700 text-white px-8">
                {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
                Confirmar y Publicar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
