// ============================================
// Global Type Definitions
// ============================================

export type UserRole = 'super_admin' | 'admin' | 'consejo' | 'admin_consorcio' | 'propietario' | 'inquilino';

export type RelationshipType = 'owner' | 'tenant' | 'family' | 'authorized';

export interface Profile {
  id: string;
  auth_user_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  show_phone: boolean;
  show_email: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Building {
  id: string;
  name: string;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  building_id: string;
  floor: string;
  unit: string;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  slug: UserRole;
  name: string;
  description: string | null;
  is_system: boolean;
  created_at: string;
}

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  building_id: string;
  assigned_by: string | null;
  created_at: string;
  role?: Role;
  profile?: Profile;
}

export interface UserUnit {
  id: string;
  user_id: string;
  unit_id: string;
  relationship_type: RelationshipType;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  unit?: Unit;
  profile?: Profile;
}

export interface SystemSetting {
  id: string;
  building_id: string;
  key: string;
  value: unknown;
  description: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeatureFlag {
  id: string;
  building_id: string;
  flag_key: string;
  is_enabled: boolean;
  metadata: unknown | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  building_id: string | null;
  user_id: string | null;
  type: 'email' | 'whatsapp' | 'push' | 'system';
  title: string;
  message: string | null;
  status: 'pending' | 'sent' | 'failed' | 'read';
  read_at: string | null;
  created_at: string;
}

// Utility types
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: string;
}
