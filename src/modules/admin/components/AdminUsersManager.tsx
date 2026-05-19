'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Mail, 
  Shield, 
  UserCheck, 
  UserX,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { usersAdminService, AdminUser } from '../services/users.admin.service';

export function AdminUsersManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadUsers() {
      const data = await usersAdminService.getAllUsers();
      setUsers(data);
      setLoading(false);
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Cargando usuarios...</div>;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-text-primary mb-2">Usuarios</h2>
          <p className="text-text-secondary">Control de acceso, roles y perfiles de residentes y personal.</p>
        </div>
        <Button className="gap-2 bg-primary-600 hover:bg-primary-700">
          <UserPlus className="h-5 w-5" /> Invitar Usuario
        </Button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="md" className="flex items-center gap-4 bg-primary-500/5 border-primary-500/10">
          <div className="h-10 w-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-600">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Activos</p>
            <p className="text-xl font-display font-bold text-text-primary">{users.filter(u => u.status === 'active').length}</p>
          </div>
        </Card>
        <Card padding="md" className="flex items-center gap-4 bg-amber-500/5 border-amber-500/10">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Pendientes</p>
            <p className="text-xl font-display font-bold text-text-primary">{users.filter(u => u.status === 'pending').length}</p>
          </div>
        </Card>
        <Card padding="md" className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-text-muted/10 flex items-center justify-center text-text-muted">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Admins</p>
            <p className="text-xl font-display font-bold text-text-primary">{users.filter(u => u.roles.includes('admin')).length}</p>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card padding="none" className="overflow-hidden border-border-light">
        <div className="p-4 border-b border-border-light bg-background-warm/50 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background-warm text-text-muted font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Roles</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Último Acceso</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-background-warm transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar 
                        src={user.avatar_url} 
                        firstName={user.first_name} 
                        lastName={user.last_name} 
                        size="sm" 
                      />
                      <div>
                        <p className="font-bold text-text-primary leading-tight">{user.first_name} {user.last_name}</p>
                        <p className="text-[11px] text-text-muted lowercase flex items-center gap-1">
                          <Mail className="h-2.5 w-2.5" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map(role => (
                        <Badge key={role} variant={role === 'admin' ? 'error' : 'accent'} size="sm" className="uppercase text-[9px]">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'default'} size="sm">
                      {user.status === 'active' ? 'Activo' : user.status === 'pending' ? 'Pendiente' : 'Suspendido'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-xs">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Nunca'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-primary-50 rounded-lg text-text-muted hover:text-primary-600 transition-all">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-error-50 rounded-lg text-text-muted hover:text-error-600 transition-all">
                        <UserX className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-background-warm rounded-lg text-text-muted">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
