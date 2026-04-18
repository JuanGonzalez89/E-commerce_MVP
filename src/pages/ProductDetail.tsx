
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Shield, Truck, Package, ChevronRight, MessageSquare, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Review } from '../types';
import { useCart, useAuth } from '../App';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [reviewCount, setReviewCount] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setProduct(data);
          setMainImage(data.images[0]);
          
          // Fetch related products
          fetch('/api/products')
            .then(res => res.json())
            .then(allProducts => {
              const related = allProducts
                .filter((p: Product) => p.category === data.category && p.id !== data.id)
                .slice(0, 4);
              setRelatedProducts(related);
            });
        }
        setLoading(false);
      });
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment) return;

    const res = await fetch(`/api/products/${id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newReview,
        userName: user?.name || 'Cliente iStore'
      })
    });

    if (res.ok) {
      const updatedProduct = await res.json();
      setProduct(updatedProduct);
      setNewReview({ rating: 5, comment: '' });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Producto no encontrado</div>;

  return (
    <div className="bg-bg pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12 text-text-main">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-text-dim uppercase tracking-widest mb-12">
          <button onClick={() => navigate('/shop')} className="hover:text-accent transition-colors">Tienda</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-dim/60 font-light lowercase">{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-main">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="relative group overflow-hidden bg-card rounded-[40px] aspect-square border border-border-dim shadow-2xl shadow-black/40">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={mainImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full h-full cursor-zoom-in"
                >
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src={mainImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <button 
                  onClick={() => {
                    const idx = product.images.indexOf(mainImage);
                    const prevIdx = (idx - 1 + product.images.length) % product.images.length;
                    setMainImage(product.images[prevIdx]);
                  }}
                  className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 pointer-events-auto border border-white/10"
                >
                  <ArrowLeft className="w-5 h-5 -ml-0.5" />
                </button>
                <button 
                  onClick={() => {
                    const idx = product.images.indexOf(mainImage);
                    const nextIdx = (idx + 1) % product.images.length;
                    setMainImage(product.images[nextIdx]);
                  }}
                  className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 pointer-events-auto border border-white/10"
                >
                  <ArrowRight className="w-5 h-5 -mr-0.5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                {product.images.map((img, i) => (
                  <div 
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${mainImage === img ? 'w-4 bg-accent' : 'w-1 bg-white/20'}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {product.images.map((img, i) => (
                <motion.button 
                  key={i} 
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${mainImage === img ? 'border-accent ring-2 ring-accent/20' : 'border-border-dim opacity-40 hover:opacity-100'}`}
                >
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-card text-[10px] font-bold uppercase tracking-widest rounded-sm border border-border-dim text-accent">{product.category}</span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-gold">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{product.rating} ({product.reviews.length} opiniones)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-text-main">{product.name}</h1>
              <p className="text-3xl font-light text-text-main">${product.price.toLocaleString()}</p>
            </div>

            <p className="text-[22px] md:text-2xl font-sans italic text-text-dim/95 leading-relaxed font-light tracking-[0.01em]">
              {product.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="bg-card p-4 rounded-xl border border-border-dim">
                  <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest block mb-1">{key}</span>
                  <span className="text-sm font-semibold">{val}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-border-dim flex flex-col gap-4">
              <button 
                onClick={() => addToCart(product.id, 1)}
                disabled={product.stock === 0}
                className="apple-button apple-button-primary w-full py-4 text-lg"
              >
                {product.stock > 0 ? 'Añadir al carrito' : 'Sin stock'}
              </button>
              
              <div className="flex flex-col gap-4 py-6 border-y border-border-dim mt-4">
                <div className="flex items-center gap-4 text-sm text-text-dim">
                  <Truck className="w-5 h-5 text-accent" />
                  <span>Entrega gratuita mañana</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-dim">
                  <Shield className="w-5 h-5 text-accent" />
                  <span>2 años de garantía iStoreCare</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-dim">
                  <Package className="w-5 h-5 text-accent" />
                  <span>Devolución sin costo en 14 días</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 border-t border-border-dim pt-24">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-text-main">Productos relacionados.</h2>
                <p className="text-text-dim text-sm mt-2 font-light">Completa tu ecosistema con estos complementos.</p>
              </div>
              <button 
                onClick={() => navigate('/shop')}
                className="text-accent text-sm font-bold hover:underline mb-1"
              >
                Ver todo
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <div key={p.id}>
                  <ProductCard product={p as any} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-32">
          <h2 className="text-2xl font-bold tracking-tight mb-12 text-text-main">Opiniones.</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Reviews list */}
            <div className="lg:col-span-2 space-y-10">
              {product.reviews.length > 0 ? (
                product.reviews.map(review => (
                  <div key={review.id} className="border-b border-border-dim pb-10 last:border-0">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center font-bold text-accent border border-border-dim">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-text-main">{review.userName}</h4>
                          <span className="text-[9px] text-text-dim uppercase tracking-widest">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-0.5 text-gold">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-text-dim/20'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-lg md:text-xl font-sans text-text-dim/90 leading-relaxed font-light italic tracking-[0.01em]">
                      "{review.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-card p-10 rounded-3xl text-center border border-border-dim">
                  <p className="text-text-dim font-light">Sé el primero en calificar este producto.</p>
                </div>
              )}
            </div>

            {/* Add Review */}
            <div className="bg-surface p-8 rounded-3xl h-fit border border-border-dim shadow-2xl shadow-black/50">
              <h3 className="text-xl font-bold mb-6 text-text-main">Danos tu opinión</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest block mb-3">Calificación</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(i => (
                      <button 
                        key={i} type="button" 
                        onClick={() => setNewReview({ ...newReview, rating: i })}
                        className={`transition-colors ${i <= newReview.rating ? 'text-gold' : 'text-text-dim/20'}`}
                      >
                        <Star className={`w-8 h-8 ${i <= newReview.rating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest block mb-3">Comentario</label>
                  <textarea 
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4} 
                    className="w-full bg-card border border-border-dim rounded-2xl p-4 text-sm focus:ring-1 focus:ring-accent/30 outline-none text-text-main font-light"
                    placeholder="Cuéntanos tu experiencia..."
                  />
                </div>
                <button 
                  type="submit" 
                  className="apple-button apple-button-primary w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Enviar Opinión
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
