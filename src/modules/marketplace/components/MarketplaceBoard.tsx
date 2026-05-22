'use client';

import { Store, Car, Wrench, Search, Plus, ThumbsUp, X, Camera, Send, Sparkles, MessageCircle, Mail as MailIcon, CheckCircle2 } from 'lucide-react';
import type { MarketplacePost } from '../types/marketplace.types';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface MarketplaceBoardProps {
  posts: MarketplacePost[];
  currentProfile?: {
    first_name: string;
    last_name: string;
  };
}

export function MarketplaceBoard({ posts: initialPosts, currentProfile }: MarketplaceBoardProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Varios',
    image_url: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = ['Varios', 'Cocheras', 'Servicios', 'Sugerencias'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const post: any = {
      id: Math.random().toString(36).substr(2, 9),
      title: newPost.title,
      description: newPost.description,
      price: parseFloat(newPost.price),
      category: newPost.category,
      created_at: new Date().toISOString(),
      profiles: {
        first_name: currentProfile?.first_name || 'Patricio',
        last_name: currentProfile?.last_name || 'Kenny'
      },
      marketplace_images: newPost.image_url ? [{ image_url: newPost.image_url }] : []
    };

    setPosts([post, ...posts]);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setNewPost({ title: '', description: '', price: '', category: 'Varios', image_url: '' });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simular envío de email
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsEmailSent(true);
    setTimeout(() => {
      setIsEmailSent(false);
      setIsContactModalOpen(false);
      setSelectedPost(null);
    }, 2500);
  };

  const generateMockImage = () => {
    const urls = [
      'https://images.unsplash.com/photo-1540959733332-e94e270b2d42?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600'
    ];
    setNewPost({ ...newPost, image_url: urls[Math.floor(Math.random() * urls.length)] });
  };
  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case 'Cocheras': return <Car className="h-4 w-4" />;
      case 'Servicios': return <Wrench className="h-4 w-4" />;
      case 'Sugerencias': return <ThumbsUp className="h-4 w-4" />;
      default: return <Store className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'Cocheras': return 'neon-border-cyan';
      case 'Servicios': return 'neon-border-warning';
      case 'Sugerencias': return 'neon-border-emerald';
      default: return 'neon-border-violet';
    }
  };

  // Mock unit for demo purpose
  const getMockUnit = (id: string) => {
    const units = ['14B', '4C', '8A', '2D', '11F', '3E'];
    const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % units.length;
    return units[index];
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-primary-500 mb-2 text-glow">
            Marketplace Vecinal
          </h2>
          <p className="font-sans text-text-secondary max-w-2xl">
            Comprá, vendé y ofrecé servicios exclusivamente a tus vecinos de Directorio 1579.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glass-panel text-primary-400 border border-primary-500/30 px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-500/10 hover:shadow-neon-primary transition-all group shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Aviso</span>
        </button>
      </header>

      {/* Modal de Nuevo Aviso */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-lg border-primary-500/20 bg-surface shadow-2xl animate-scale-in max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden" padding="none">
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <h3 className="font-display font-bold text-xl text-primary-500">Publicar en Marketplace</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Título del Aviso</label>
                  <input 
                    required
                    type="text" 
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    placeholder="Ej: Alquiler de cochera 2SS"
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Precio (ARS)</label>
                    <input 
                      type="number" 
                      value={newPost.price}
                      onChange={e => setNewPost({...newPost, price: e.target.value})}
                      placeholder="0.00"
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Categoría</label>
                    <select 
                      value={newPost.category}
                      onChange={e => setNewPost({...newPost, category: e.target.value})}
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-white"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Descripción</label>
                  <textarea 
                    required
                    value={newPost.description}
                    onChange={e => setNewPost({...newPost, description: e.target.value})}
                    placeholder="Contanos los detalles..."
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-white h-24 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Fotos del Producto/Servicio</label>
                  <div className="flex flex-col gap-3">
                    {!newPost.image_url ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-primary-500/50 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-8 h-8 text-text-muted mb-2 group-hover:text-primary-500 transition-colors" />
                          <p className="text-xs text-text-muted font-medium">Hacé clic para subir una foto</p>
                          <p className="text-[10px] text-text-muted/60 mt-1 uppercase">PNG, JPG o WEBP</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-primary-500/30 h-48 w-full group">
                        <img src={newPost.image_url} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setNewPost({...newPost, image_url: ''})}
                          className="absolute top-2 right-2 bg-error-500 text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                           <label className="cursor-pointer bg-white text-primary-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                             <Camera className="h-4 w-4" /> Cambiar Foto
                             <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                           </label>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <div className="h-px bg-white/5 flex-1" />
                      <span className="text-[10px] text-text-muted font-bold uppercase">o usá una de ejemplo</span>
                      <div className="h-px bg-white/5 flex-1" />
                    </div>

                    <Button type="button" variant="secondary" onClick={generateMockImage} className="w-full gap-2 border border-white/5 bg-white/5 h-10">
                      <Sparkles className="h-4 w-4 text-amber-500" /> Generar con IA
                    </Button>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-white/5 bg-background-warm/50 flex justify-end gap-3 shrink-0">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-primary-600 hover:bg-primary-700 text-white min-w-[120px]">
                  {isSubmitting ? 'Publicando...' : 'Publicar Ahora'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Modal de Contacto (Simulación Email) */}
      {isContactModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-md border-primary-500/20 bg-surface shadow-2xl animate-scale-in max-h-[calc(100vh-2rem)] flex flex-col overflow-none" padding="none">
              {isEmailSent ? (
                <div className="p-10 text-center space-y-4 animate-scale-in overflow-y-auto flex-grow">
                  <div className="h-20 w-20 bg-success-500/10 text-success-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-white">¡Mensaje Enviado!</h3>
                  <p className="text-text-secondary text-sm">
                    Le enviamos un email a <span className="text-primary-400 font-semibold">{selectedPost?.profiles?.first_name}</span> con tus datos de contacto.
                  </p>
                  <div className="pt-4 text-[10px] text-text-muted uppercase tracking-widest font-bold opacity-50"></div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="flex flex-col flex-grow overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-primary-500/5 shrink-0">
                    <h3 className="font-display font-bold text-lg text-primary-400">Interés en: {selectedPost?.title}</h3>
                    <button type="button" onClick={() => setIsContactModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-5 overflow-y-auto flex-grow">
                    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="h-10 w-10 rounded-full bg-primary-900 flex items-center justify-center text-primary-400 font-bold">
                        {selectedPost?.profiles?.first_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs text-text-muted font-bold uppercase tracking-tighter">Vendedor</p>
                        <p className="text-sm font-semibold text-white">{selectedPost?.profiles?.first_name} {selectedPost?.profiles?.last_name}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Tu Mensaje</label>
                      <textarea
                        required
                        placeholder={`Hola ${selectedPost?.profiles?.first_name}, me interesa. ¿Sigue disponible?`}
                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-white h-32 resize-none"
                      />
                    </div>

                    <div className="bg-info-500/5 border border-info-500/10 p-3 rounded-lg flex gap-3 items-start">
                      <MailIcon className="h-4 w-4 text-info-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-info-200/70 leading-relaxed">
                        Al enviar, el vecino recibirá una notificación por email con tu nombre, unidad y datos de contacto para responderte.
                      </p>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-white/5 bg-background-warm/50 flex justify-end gap-3 shrink-0">
                    <Button type="button" variant="ghost" onClick={() => setIsContactModalOpen(false)}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-primary-600 hover:bg-primary-700 text-white min-w-[140px] gap-2">
                      {isSubmitting ? 'Enviando...' : <><Send className="h-4 w-4" /> Enviar Interés</>}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </Portal>
      )}

      {/* Filters (Mock) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button className="glass-panel px-4 py-2 rounded-full text-sm font-semibold border-primary-500/50 bg-primary-500/10 text-primary-400 whitespace-nowrap">
          Todos los avisos
        </button>
        <button className="glass-panel px-4 py-2 rounded-full text-sm font-semibold border-white/5 text-text-secondary hover:text-text-primary whitespace-nowrap transition-colors">
          Cocheras
        </button>
        <button className="glass-panel px-4 py-2 rounded-full text-sm font-semibold border-white/5 text-text-secondary hover:text-text-primary whitespace-nowrap transition-colors">
          Productos
        </button>
        <button className="glass-panel px-4 py-2 rounded-full text-sm font-semibold border-white/5 text-text-secondary hover:text-text-primary whitespace-nowrap transition-colors">
          Servicios
        </button>
        <button className="glass-panel px-4 py-2 rounded-full text-sm font-semibold border-white/5 text-text-secondary hover:text-text-primary whitespace-nowrap transition-colors">
          Sugerencias
        </button>
      </div>

      {/* Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-xl">
          <Store className="h-12 w-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary font-medium">No hay avisos publicados en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {posts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <div className={`glass-panel rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:bg-white/[0.06] hover:-translate-y-1 ${getCategoryColor(post.category)}`}>
                
                {/* Image Area */}
                <div className="h-48 w-full bg-background-warm relative overflow-hidden">
                  {post.marketplace_images && post.marketplace_images.length > 0 ? (
                    <img 
                      src={post.marketplace_images[0].image_url} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-bright to-background">
                      {getCategoryIcon(post.category)}
                    </div>
                  )}
                  {post.price && (
                    <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 font-display font-bold text-white shadow-lg">
                      ${post.price.toLocaleString('es-AR')}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-white/5 border border-white/10 text-text-secondary px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                      {getCategoryIcon(post.category)}
                      {post.category || 'Varios'}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-lg font-semibold text-text-primary mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="font-sans text-sm text-text-secondary mb-4 line-clamp-2 flex-grow">
                    {post.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-primary-700/20 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-xs shrink-0">
                        {post.profiles?.first_name.charAt(0)}{post.profiles?.last_name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-text-primary truncate">
                            {post.profiles?.first_name}
                          </p>
                          <Badge variant="accent" size="sm" className="px-1.5 py-0 text-[9px] shrink-0">
                            U. {getMockUnit(post.id)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(post);
                        setIsContactModalOpen(true);
                      }}
                      className="bg-primary-500/10 hover:bg-primary-500 text-primary-400 hover:text-white p-2 rounded-lg transition-all border border-primary-500/20"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
