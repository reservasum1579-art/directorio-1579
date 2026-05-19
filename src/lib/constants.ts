// ============================================
// Application Constants
// ============================================

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Directorio 1579';
export const DEFAULT_BUILDING_ID = process.env.NEXT_PUBLIC_BUILDING_ID || '';

// Role hierarchy (higher index = more permissions)
export const ROLE_HIERARCHY: Record<string, number> = {
  inquilino: 0,
  propietario: 1,
  consejo: 2,
  admin_consorcio: 3,
  admin: 4,
  super_admin: 5,
};

export const ADMIN_ROLES = ['super_admin', 'admin', 'admin_consorcio', 'consejo'] as const;

// SUM defaults (overridden by system_settings)
export const SUM_DEFAULTS = {
  MAX_RESERVAS_MES: 2,
  PRECIO: 25000,
  GARANTIA: 25000,
  CANCELACION_HORAS: 24,
  MAX_DEUDA_MESES: 2,
  CAPACIDAD: 25,
} as const;

// File upload limits
export const UPLOAD_LIMITS = {
  AVATAR_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  PHOTO_MAX_SIZE: 5 * 1024 * 1024,  // 5MB
  PDF_MAX_SIZE: 10 * 1024 * 1024,   // 10MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ACCEPTED_PDF_TYPES: ['application/pdf'],
} as const;

// Navigation items
export const NAV_ITEMS = [
  { label: 'Inicio', href: '/dashboard', icon: 'home' },
  { label: 'SUM', href: '/dashboard/sum', icon: 'calendar' },
  { label: 'Marketplace', href: '/dashboard/marketplace', icon: 'store' },
  { label: 'Noticias', href: '/dashboard/news', icon: 'newspaper' },
  { label: 'Perfil', href: '/dashboard/profile', icon: 'user' },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: 'layout' },
  { label: 'Usuarios', href: '/dashboard/admin/users', icon: 'users' },
  { label: 'Departamentos', href: '/dashboard/admin/units', icon: 'building' },
  { label: 'SUM', href: '/dashboard/admin/sum', icon: 'settings' },
  { label: 'Marketplace', href: '/dashboard/admin/marketplace', icon: 'shield' },
  { label: 'Noticias', href: '/dashboard/admin/news', icon: 'edit' },
  { label: 'Mantenimiento', href: '/dashboard/maintenance', icon: 'wrench' },
  { label: 'Configuración', href: '/dashboard/admin/settings', icon: 'sliders' },
] as const;
