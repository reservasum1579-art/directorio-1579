'use client';

import { Check, X, Eye, AlertCircle, Clock, ShieldCheck, ShieldX } from 'lucide-react';
import type { MarketplacePost, MarketplacePostStatus } from '../types/marketplace.types';
import { marketplaceAdminService } from '../services/marketplace.admin.service';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface AdminMarketplaceBoardProps {
  initialPosts: MarketplacePost[];
}

export function AdminMarketplaceBoard({ initialPosts }: AdminMarketplaceBoardProps) {
  const [posts, setPosts] = useState(initialPosts);

  const handleStatusUpdate = async (postId: string, status: MarketplacePostStatus) => {
    try {
      await marketplaceAdminService.updatePostStatus(postId, status, 'current-admin');
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, status } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const pendingPosts = posts.filter(p => p.status === 'pending');
  const otherPosts = posts.filter(p => p.status !== 'pending');

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="font-display text-3xl font-bold text-text-primary mb-2">
          Moderación de Marketplace
        </h2>
        <p className="text-text-secondary">
          Revisá y aprobá los anuncios publicados por los residentes.
        </p>
      </header>

      {/* Pending Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-warning-500 font-semibold mb-4">
          <Clock className="h-5 w-5" />
          <h3>Pendientes de Revisión ({pendingPosts.length})</h3>
        </div>

        {pendingPosts.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-xl border-dashed border-white/10">
            <ShieldCheck className="h-10 w-10 text-success-500/30 mx-auto mb-2" />
            <p className="text-text-muted">No hay anuncios pendientes de moderación.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingPosts.map(post => (
              <Card key={post.id} padding="none" className="overflow-hidden border-warning-500/20 bg-warning-500/[0.02]">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 h-32 md:h-auto bg-surface-bright flex items-center justify-center border-r border-white/5">
                    <AlertCircle className="h-8 w-8 text-warning-500/20" />
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-display font-bold text-text-primary">{post.title}</h4>
                        <p className="text-xs text-text-muted">Por {post.profiles?.first_name} {post.profiles?.last_name} • {post.category}</p>
                      </div>
                      <span className="font-display font-bold text-primary-400">
                        {post.price ? `$${post.price.toLocaleString()}` : 'A convenir'}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-4">{post.description}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStatusUpdate(post.id, 'approved')}
                        className="flex-1 bg-success-600 hover:bg-success-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Check className="h-4 w-4" /> Aprobar
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(post.id, 'rejected')}
                        className="flex-1 bg-error-600/10 hover:bg-error-600/20 text-error-400 text-xs font-bold py-2 rounded-lg border border-error-600/20 flex items-center justify-center gap-2 transition-colors"
                      >
                        <X className="h-4 w-4" /> Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* History Table */}
      <section className="space-y-4">
        <h3 className="font-display font-bold text-text-primary pt-8 border-t border-white/5">Historial de Moderación</h3>
        <div className="glass-panel rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-text-muted font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Anuncio</th>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {otherPosts.map(post => (
                <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-text-primary">{post.title}</p>
                    <p className="text-[10px] text-text-muted">{post.category}</p>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {post.profiles?.first_name} {post.profiles?.last_name}
                  </td>
                  <td className="px-6 py-4">
                    {post.status === 'approved' ? (
                      <Badge variant="success" size="sm">Aprobado</Badge>
                    ) : post.status === 'rejected' ? (
                      <Badge variant="error" size="sm">Rechazado</Badge>
                    ) : (
                      <Badge variant="warning" size="sm">{post.status}</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-primary-400 transition-all">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
