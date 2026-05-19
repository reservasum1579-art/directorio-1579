import { ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-text-primary">Mantenimiento</h1>
        <p className="text-text-secondary mt-1">
          Gestión de tareas preventivas y reparaciones del edificio.
        </p>
      </div>

      <Card className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Módulo en construcción</h2>
        <p className="text-text-secondary max-w-md mx-auto mb-8">
          La base de datos y la automatización del módulo de mantenimiento ya están listas, pero la interfaz gráfica aún se encuentra en desarrollo.
        </p>
        <Button variant="primary">
          Contactar Soporte
        </Button>
      </Card>
    </div>
  );
}
