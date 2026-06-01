'use client';

import { Store, Car, Wrench, Search, Plus, ThumbsUp, X, Camera, Send, Sparkles, MessageCircle, Mail as MailIcon, CheckCircle2, Trash2, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MarketplacePost } from '../types/marketplace.types';
import { updateMarketplacePostStatusAction, createMarketplacePostAction } from '../actions/marketplace.actions';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Portal } from '@/components/Portal';

interface MarketplaceBoardProps {
  posts: MarketplacePost[];
  currentProfile?: {
    id?: string;
    role?: string;
    first_name: string;
    last_name: string;
    floor?: string;
    unit?: string;
  };
}

export function MarketplaceBoard({ posts: initialPosts, currentProfile }: MarketplaceBoardProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('Todos');
  
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Varios',
    images: [] as { file?: File, url: string }[]
  });

  const [activeImageIndex, setActiveImageIndex] = useState<Record<string, number>>({});

  const nextImage = (e: React.MouseEvent, postId: string, maxIndex: number) => {
    e.stopPropagation();
    setActiveImageIndex(prev => ({
      ...prev,
      [postId]: prev[postId] !== undefined ? Math.min(prev[postId] + 1, maxIndex) : 1
    }));
  };

  const prevImage = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setActiveImageIndex(prev => ({
      ...prev,
      [postId]: prev[postId] ? Math.max(prev[postId] - 1, 0) : 0
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && newPost.images.length < 5) {
      const url = URL.createObjectURL(file);
      setNewPost({ ...newPost, images: [...newPost.images, { file, url }] });
    }
  };

  const handleDelete = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (!confirm('¿Seguro que querés eliminar esta publicación?')) return;
    
    // Optistic update
    setPosts(posts.filter(p => p.id !== postId));
    await updateMarketplacePostStatusAction(postId, 'rejected');
  };

  const handleMarkSold = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (!confirm('¿Marcar como vendido? Quedará visible por 15 días.')) return;
    
    // Optistic update
    setPosts(posts.map(p => p.id === postId ? { ...p, status: 'sold' as any } : p));
    await updateMarketplacePostStatusAction(postId, 'sold');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const categories = ['Varios', 'Cocheras', 'Servicios', 'Sugerencias'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const supabase = createClient();
    const finalImageUrls: string[] = [];

    // Subir imágenes a Supabase Storage
    for (const img of newPost.images) {
      if (img.file) {
        const fileExt = img.file.name.split('.').pop();
        const fileName = `${currentProfile?.id || 'anon'}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('marketplace')
          .upload(fileName, img.file);
        
        if (error) {
          console.error('Error uploading image:', error);
          alert(`No se pudo subir una de las imágenes: ${error.message}. Verifica que el bucket "marketplace" exista y tenga permisos.`);
          continue; // Si falla una, seguimos con las demás
        }
        
        if (data) {
          const { data: publicUrlData } = supabase.storage
            .from('marketplace')
            .getPublicUrl(data.path);
          finalImageUrls.push(publicUrlData.publicUrl);
        }
      } else {
        // Es un mock o imagen externa
        finalImageUrls.push(img.url);
      }
    }

    const postData = {
      user_id: currentProfile?.id,
      title: newPost.title,
      description: newPost.description,
      price: newPost.price ? parseFloat(newPost.price) : null,
      category: newPost.category,
    };

    const result = await createMarketplacePostAction(postData, finalImageUrls);
    
    if (result.success && result.post) {
      // Agregar datos del perfil y fotos para mostrarlo optimísticamente
      const fullPost = {
        ...result.post,
        profiles: {
          first_name: currentProfile?.first_name || 'Vecino',
          last_name: currentProfile?.last_name || '',
          floor: currentProfile?.floor || '',
          unit: currentProfile?.unit || ''
        },
        marketplace_images: finalImageUrls.map(url => ({ image_url: url }))
      };
      
      setPosts([fullPost, ...posts]);
      setIsModalOpen(false);
      setNewPost({ title: '', description: '', price: '', category: 'Varios', images: [] });
    } else {
      alert(result.error || 'Ocurrió un error al publicar el aviso.');
    }
    
    setIsSubmitting(false);
  };

  const handleWhatsAppClick = (post: any) => {
    const rawPhone = post.profiles?.phone;
    
    if (!rawPhone) {
      alert("El vecino aún no ha registrado su número de teléfono en su perfil.");
      return;
    }
    
    // Limpiamos para quedarnos solo con números
    const cleanPhone = rawPhone.replace(/\D/g, '');
    
    const message = `Hola ${post.profiles?.first_name}, vi tu publicación "${post.title}" en el Marketplace del consorcio y me interesa.`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const generateMockImage = () => {
    if (newPost.images.length >= 5) return;
    const urls = [
      'https://images.unsplash.com/photo-1540959733332-e94e270b2d42?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1524289286702-f07229da36f5?auto=format&fit=crop&q=80&w=600'
    ];
    setNewPost({ ...newPost, images: [...newPost.images, { url: urls[Math.floor(Math.random() * urls.length)] }] });
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

  const filterCategories = ['Todos', 'Cocheras', 'Varios', 'Servicios', 'Sugerencias'];
  const filteredPosts = activeFilter === 'Todos' ? posts : posts.filter(post => post.category === activeFilter || (activeFilter === 'Varios' && (!post.category || post.category === 'Varios')));

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
                    {newPost.images.length === 0 ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-primary-500/50 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-8 h-8 text-text-muted mb-2 group-hover:text-primary-500 transition-colors" />
                          <p className="text-xs text-text-muted font-medium">Hacé clic para subir una foto</p>
                          <p className="text-[10px] text-text-muted/60 mt-1 uppercase">PNG, JPG o WEBP (máx. 5)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {newPost.images.map((img, idx) => (
                          <div key={idx} className="relative rounded-xl overflow-hidden border border-primary-500/30 h-24 w-full group">
                            <img src={img.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => setNewPost({...newPost, images: newPost.images.filter((_, i) => i !== idx)})}
                              className="absolute top-1 right-1 bg-error-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {newPost.images.length < 5 && (
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/5 hover:border-primary-500/50 transition-all group">
                            <Camera className="w-6 h-6 text-text-muted mb-1 group-hover:text-primary-500 transition-colors" />
                            <p className="text-[10px] text-text-muted font-medium text-center leading-tight">Agregar<br/>({newPost.images.length}/5)</p>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                          </label>
                        )}
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



      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filterCategories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`glass-panel px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeFilter === cat 
                ? 'border-primary-500/50 bg-primary-500/10 text-primary-400' 
                : 'border-white/5 text-text-secondary hover:text-text-primary'
            }`}
          >
            {cat === 'Todos' ? 'Todos los avisos' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-xl">
          <Store className="h-12 w-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary font-medium">No hay avisos publicados en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {filteredPosts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <div className={`glass-panel rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:bg-white/[0.06] hover:-translate-y-1 ${getCategoryColor(post.category)}`}>
                
                {/* Image Area */}
                <div className="h-48 w-full bg-background-warm relative overflow-hidden">
                  {post.marketplace_images && post.marketplace_images.length > 0 && post.marketplace_images[0].image_url ? (
                    <div className="relative w-full h-full group">
                      <img 
                        src={post.marketplace_images[activeImageIndex[post.id] || 0]?.image_url} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                      {post.marketplace_images.length > 1 && (
                        <>
                          <button 
                            onClick={(e) => prevImage(e, post.id)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 z-20"
                            disabled={(activeImageIndex[post.id] || 0) === 0}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={(e) => nextImage(e, post.id, post.marketplace_images!.length - 1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 z-20"
                            disabled={(activeImageIndex[post.id] || 0) === post.marketplace_images!.length - 1}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[10px] font-bold text-white flex items-center gap-1.5 shadow-lg z-20">
                            <Camera className="h-3 w-3" />
                            {(activeImageIndex[post.id] || 0) + 1}/{post.marketplace_images.length}
                          </div>
                        </>
                      )}
                    </div>
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
                  {post.status === 'sold' && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="bg-success-500/90 text-white px-6 py-2 rounded-xl font-display font-bold text-xl tracking-widest uppercase border border-success-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] transform -rotate-12 flex items-center gap-2">
                        <CheckCircle className="h-6 w-6" />
                        Vendido
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-3 right-3 flex gap-2 z-20">
                    {(currentProfile?.role === 'admin' || currentProfile?.id === post.user_id) && post.status !== 'sold' && (
                      <button 
                        onClick={(e) => handleDelete(e, post.id)}
                        className="bg-background/80 hover:bg-error-500 text-error-500 hover:text-white p-2 rounded-full backdrop-blur-md transition-colors shadow-lg border border-white/10"
                        title="Eliminar publicación"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    {currentProfile?.id === post.user_id && post.status !== 'sold' && (
                      <button 
                        onClick={(e) => handleMarkSold(e, post.id)}
                        className="bg-background/80 hover:bg-success-500 text-success-500 hover:text-white p-2 rounded-full backdrop-blur-md transition-colors shadow-lg border border-white/10"
                        title="Marcar como Vendido"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-white/5 border border-white/10 text-text-secondary px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                      {getCategoryIcon(post.category)}
                      {post.category || 'Varios'}
                    </span>
                    <span className="text-[10px] text-text-muted font-medium ml-auto">
                      Publicado el {formatDate(post.created_at)}
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
                        <div className="flex flex-col">
                          <p className="text-xs font-semibold text-text-primary truncate">
                            {post.profiles?.first_name}
                          </p>
                          <p className="text-[10px] text-text-muted">
                            Piso {post.profiles?.floor || '1'} Depto {post.profiles?.unit || getMockUnit(post.id)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppClick(post);
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
