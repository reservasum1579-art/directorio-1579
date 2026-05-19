import { Card, CardDescription, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { Users, Building2, Shield, Settings, FileEdit, Newspaper, Receipt } from 'lucide-react';

const adminModules = [
  {
    title: 'Usuarios y Roles',
    description: 'Gestionar perfiles, permisos y acceso a la plataforma.',
    href: '/admin/users',
    icon: Users,
    color: 'text-primary-600 bg-primary-50',
  },
  {
    title: 'Departamentos',
    description: 'Administrar unidades funcionales y sus ocupantes.',
    href: '/admin/units',
    icon: Building2,
    color: 'text-accent-700 bg-accent-50',
  },
  {
    title: 'Gestión SUM',
    description: 'Administrar reservas, multas y reglas del salón.',
    href: '/admin/sum',
    icon: Shield,
    color: 'text-warning-700 bg-warning-50',
  },
  {
    title: 'Expensas',
    description: 'Control de liquidaciones y auditoría de cobranzas.',
    href: '/admin/expenses',
    icon: Receipt,
    color: 'text-success-700 bg-success-50',
  },
  {
    title: 'Marketplace',
    description: 'Revisar publicaciones de marketplace.',
    href: '/admin/marketplace',
    icon: FileEdit,
    color: 'text-info-600 bg-info-50',
  },
  {
    title: 'Noticias',
    description: 'Publicar comunicados y novedades.',
    href: '/admin/news',
    icon: Newspaper,
    color: 'text-error-600 bg-error-50',
  },
  {
    title: 'Configuración',
    description: 'Ajustes del edificio e identidad.',
    href: '/admin/settings',
    icon: Settings,
    color: 'text-text-secondary bg-background-warm',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Panel de Administración
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Gestioná todos los aspectos operativos del edificio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {adminModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link key={mod.href} href={mod.href}>
              <Card hoverable padding="md" className="h-full flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-[--radius-md] flex items-center justify-center shrink-0 ${mod.color}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <CardTitle className="text-base">{mod.title}</CardTitle>
                </div>
                <CardDescription className="flex-1">
                  {mod.description}
                </CardDescription>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
