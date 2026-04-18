
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useCart } from '../App';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group product-card-style"
    >
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden rounded-xl bg-surface aspect-square">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        {product.stock < 5 && (
          <span className="absolute top-3 left-3 bg-red-500/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            Últimas unidades
          </span>
        )}
      </Link>

      <div className="mt-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[10px] font-semibold text-text-dim uppercase tracking-widest">{product.category}</span>
            <Link to={`/product/${product.id}`} className="block text-base font-medium text-text-main hover:text-accent transition-colors truncate">
              {product.name}
            </Link>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-gold">
            <Star className="w-3 h-3 fill-current" />
            <span>{product.rating}</span>
          </div>
        </div>

        <p className="text-[11px] leading-[1.65] text-text-dim/85 font-light font-sans italic tracking-[0.01em] mb-6 line-clamp-2 min-h-[36px]">
          {product.description}
        </p>

        {/* Specs Summary */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
            <div key={key} className="bg-surface/50 border border-border-dim/50 px-2 py-1 rounded-md">
              <span className="text-[8px] text-text-dim uppercase tracking-wider block">{key}</span>
              <span className="text-[10px] text-text-main font-medium">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-dim">
          <span className="text-lg font-light text-text-main">
            ${product.price.toLocaleString()}
          </span>
          <button 
            onClick={() => addToCart(product.id, 1)}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-lg transition-all duration-300 ${product.stock === 0 ? 'bg-surface text-text-dim cursor-not-allowed' : 'bg-surface text-text-main hover:bg-accent hover:text-bg'}`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
