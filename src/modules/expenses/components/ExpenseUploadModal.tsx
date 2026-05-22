'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  BarChart,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';
import { Portal } from '@/components/Portal';

interface ExpenseUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExpenseUploadModal({ isOpen, onClose, onSuccess }: ExpenseUploadModalProps) {
  const [step, setStep] = useState<'upload' | 'processing' | 'success'>('upload');
  const [processingStep, setProcessingStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const processingLabels = [
    'Iniciando carga de archivo...',
    'Extrayendo texto y tablas mediante OCR...',
    'Identificando categorías de gastos...',
    'Analizando variaciones vs. mes anterior...',
    'Generando insights inteligentes con IA...',
    'Finalizando estructura de datos...'
  ];

  useEffect(() => {
    if (step === 'processing') {
      const interval = setInterval(() => {
        setProcessingStep(prev => {
          if (prev < processingLabels.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => setStep('success'), 800);
            return prev;
          }
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startProcessing = () => {
    if (file) {
      setStep('processing');
    }
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
    // Reset for next time
    setTimeout(() => {
      setStep('upload');
      setProcessingStep(0);
      setFile(null);
    }, 500);
  };

  return (
<Portal>
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#020617]/80 backdrop-blur-md animate-fade-in">>
      <div className="bg-[#0f172a] border border-[#d4af37]/20 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in max-h-[calc(100vh-2rem)] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4af37]/10 bg-[#d4af37]/5 shrink-0">
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <Upload className="h-5 w-5 text-[#d4af37]" /> 
            Nueva Liquidación Mensual
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-grow">
          {step === 'upload' && (
            <div className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all ${
                  file ? 'border-[#d4af37]/50 bg-[#d4af37]/5' : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className={`p-4 rounded-full mb-4 ${file ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-slate-800 text-slate-400'}`}>
                  {file ? <FileText className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
                </div>
                {file ? (
                  <div className="text-center">
                    <p className="text-white font-bold mb-1">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-white font-bold mb-1">Arrastrá el PDF de expensas aquí</p>
                    <p className="text-sm text-slate-400 mb-4 text-balance">O hacé clic para seleccionar el archivo desde tu computadora.</p>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="hidden" 
                      id="file-upload" 
                      onChange={handleFileChange}
                    />
                    <label 
                      htmlFor="file-upload"
                      className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors"
                    >
                      Seleccionar Archivo
                    </label>
                  </div>
                )}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                <Sparkles className="h-5 w-5 text-blue-400 shrink-0" />
                <p className="text-xs text-blue-200 leading-relaxed">
                  <span className="font-bold">IA Ready:</span> Al subir el archivo, nuestro motor de OCR extraerá automáticamente las categorías, montos y variaciones para generar el dashboard comparativo.
                </p>
              </div>

              <Button 
                className="w-full bg-[#d4af37] hover:bg-[#b4942e] text-[#0f172a] font-black h-12 text-md" 
                disabled={!file}
                onClick={startProcessing}
              >
                Procesar Liquidación
              </Button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-10 flex flex-col items-center text-center">
              <div className="relative mb-10">
                <div className="h-24 w-24 border-4 border-[#d4af37]/10 border-t-[#d4af37] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BrainCircuit className="h-8 w-8 text-[#d4af37] animate-pulse" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Procesando Datos</h3>
              <p className="text-[#d4af37] font-display text-sm h-6 mb-8 transition-all duration-500 animate-fade-in" key={processingStep}>
                {processingLabels[processingStep]}
              </p>

              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
                <div 
                  className="h-full bg-gradient-to-r from-[#d4af37] to-[#fefce8] transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                  style={{ width: `${((processingStep + 1) / processingLabels.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 flex flex-col items-center text-center">
              <div className="h-20 w-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 italic tracking-tight">¡Análisis Completado!</h3>
              <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto">
                La liquidación de Mayo 2024 ha sido procesada exitosamente. El dashboard comparativo ya está disponible.
              </p>

              <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-[#d4af37]/5 border border-[#d4af37]/10 p-3 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-[#d4af37] mb-1">Categorías</p>
                  <p className="text-xl font-bold text-white">12</p>
                </div>
                <div className="bg-[#d4af37]/5 border border-[#d4af37]/10 p-3 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-[#d4af37] mb-1">Insights</p>
                  <p className="text-xl font-bold text-white">3</p>
                </div>
              </div>

              <Button 
                className="w-full bg-white text-black font-black flex items-center justify-center gap-2"
                onClick={handleFinish}
              >
                Ver Resultado <ArrowRight className="h-4 w-4" />
              </Button>
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all ${
                    file ? 'border-[#d4af37]/50 bg-[#d4af37]/5' : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className={`p-4 rounded-full mb-4 ${file ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-slate-800 text-slate-400'}`}>
                    {file ? <FileText className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
                  </div>
                  {file ? (
                    <div className="text-center">
                      <p className="text-white font-bold mb-1">{file.name}</p>
                      <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-white font-bold mb-1">Arrastrá el PDF de expensas aquí</p>
                      <p className="text-sm text-slate-400 mb-4 text-balance">O hacé clic para seleccionar el archivo desde tu computadora.</p>
                      <input 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        id="file-upload" 
                        onChange={handleFileChange}
                      />
                      <label 
                        htmlFor="file-upload"
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors"
                      >
                        Seleccionar Archivo
                      </label>
                    </div>
                  )}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                  <Sparkles className="h-5 w-5 text-blue-400 shrink-0" />
                  <p className="text-xs text-blue-200 leading-relaxed">
                    <span className="font-bold">IA Ready:</span> Al subir el archivo, nuestro motor de OCR extraerá automáticamente las categorías, montos y variaciones para generar el dashboard comparativo.
                  </p>
                </div>

                <Button 
                  className="w-full bg-[#d4af37] hover:bg-[#b4942e] text-[#0f172a] font-black h-12 text-md" 
                  disabled={!file}
                  onClick={startProcessing}
                >
                  Procesar Liquidación
                </Button>
              </div>
            )}

            {step === 'processing' && (
              <div className="py-10 flex flex-col items-center text-center">
                <div className="relative mb-10">
                  <div className="h-24 w-24 border-4 border-[#d4af37]/10 border-t-[#d4af37] rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BrainCircuit className="h-8 w-8 text-[#d4af37] animate-pulse" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Procesando Datos</h3>
                <p className="text-[#d4af37] font-display text-sm h-6 mb-8 transition-all duration-500 animate-fade-in" key={processingStep}>
                  {processingLabels[processingStep]}
                </p>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div 
                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#fefce8] transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                    style={{ width: `${((processingStep + 1) / processingLabels.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="py-6 flex flex-col items-center text-center">
                <div className="h-20 w-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 italic tracking-tight">¡Análisis Completado!</h3>
                <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto">
                  La liquidación de Mayo 2024 ha sido procesada exitosamente. El dashboard comparativo ya está disponible.
                </p>

                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                  <div className="bg-[#d4af37]/5 border border-[#d4af37]/10 p-3 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-[#d4af37] mb-1">Categorías</p>
                    <p className="text-xl font-bold text-white">12</p>
                  </div>
                  <div className="bg-[#d4af37]/5 border border-[#d4af37]/10 p-3 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-[#d4af37] mb-1">Insights</p>
                    <p className="text-xl font-bold text-white">3</p>
                  </div>
                </div>

                <Button 
                  className="w-full bg-white text-black font-black flex items-center justify-center gap-2"
                  onClick={handleFinish}
                >
                  Ver Resultado <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
