
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  
  const currentCategory = searchParams.get('category') || '';

  // Synchronize searchTerm state with URL param when it changes externally (e.g., from Navbar)
  useEffect(() => {
    const search = searchParams.get('search') || '';
    if (search !== searchTerm) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (currentCategory) query.set('category', currentCategory);
    if (searchTerm) query.set('search', searchTerm);

    fetch(`/api/products?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, [currentCategory, searchTerm]);

  const categories = ['iPhone', 'Mac', 'iPad', 'Watch', 'Accessories'];

  return (
    <div className="bg-bg min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold tracking-tighter mb-4 text-text-main">La Tienda.</h1>
          <p className="text-text-dim max-w-xl font-light">Encuentra los dispositivos que transformarán tu día a día.</p>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 py-6 border-y border-border-dim sticky top-16 bg-bg/80 backdrop-blur-xl z-40">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            <button 
              onClick={() => setSearchParams({})}
              className={`apple-button whitespace-nowrap text-[12px] uppercase tracking-wider ${!currentCategory ? 'bg-accent text-bg font-bold' : 'bg-card text-text-dim border border-border-dim'}`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSearchParams({ category: cat })}
                className={`apple-button whitespace-nowrap text-[12px] uppercase tracking-wider ${currentCategory === cat ? 'bg-accent text-bg font-bold' : 'bg-card text-text-dim border border-border-dim'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border-dim rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-accent/30 outline-none transition-all text-text-main"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="aspect-square bg-card animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {products.map(product => (
                <div key={product.id}>
                  <ProductCard product={product as any} />
                </div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-xl text-text-dim font-light">No encontramos productos que coincidan con tu búsqueda.</p>
            <button onClick={() => { setSearchTerm(''); setSearchParams({}); }} className="mt-4 text-accent font-bold hover:underline">
              Mostrar todo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
