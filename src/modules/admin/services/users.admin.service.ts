'use client';

export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  roles: string[];
  status: 'active' | 'pending' | 'suspended';
  last_login: string | null;
}

const MOCK_USERS: AdminUser[] = [
  { id: '1', first_name: 'Alex', last_name: 'Sterling', email: 'alex@example.com', phone: '11 2233-4455', avatar_url: null, roles: ['admin', 'resident'], status: 'active', last_login: new Date().toISOString() },
  { id: '2', first_name: 'Elena', last_name: 'Pérez', email: 'elena@example.com', phone: '11 5566-7788', avatar_url: null, roles: ['resident'], status: 'active', last_login: new Date().toISOString() },
  { id: '3', first_name: 'Martín', last_name: 'Gómez', email: 'martin@example.com', phone: '11 9900-1122', avatar_url: null, roles: ['resident'], status: 'active', last_login: null },
  { id: '4', first_name: 'Juan', last_name: 'García', email: 'juan@example.com', phone: '11 4455-6677', avatar_url: null, roles: ['resident'], status: 'pending', last_login: null },
  { id: '5', first_name: 'Admin', last_name: 'Directorio', email: 'admin@directorio.com', phone: '', avatar_url: null, roles: ['admin'], status: 'active', last_login: new Date().toISOString() }
];

export const usersAdminService = {
  async getAllUsers(): Promise<AdminUser[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_USERS;
  }
};
