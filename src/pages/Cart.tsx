
import React, { useEffect, useState } from 'react';
import { useCart } from '../App';
import { Trash2, Plus, Minus, ArrowLeft, Store, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const productMap = data.reduce((acc: any, prod: Product) => {
          acc[prod.id] = prod;
          return acc;
        }, {});
        setProducts(productMap);
      });
  }, []);

  const cartItems = cart.map(item => ({
    ...item,
    product: products[item.productId]
  })).filter(item => item.product);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.16; // 16% IVA
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <Store className="w-24 h-24 text-apple-gray mb-8" />
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-center">Bolsa vacía.</h1>
        <p className="text-gray-500 mb-12 text-center max-w-sm">Parece que aún no has añadido nada a tu carrito de compras.</p>
        <Link to="/shop" className="apple-button apple-button-primary">
          Empezar a comprar
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen pb-40">
      <div className="max-w-7xl mx-auto px-6 py-12 text-text-main">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Cart List */}
          <div className="flex-grow">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Tu bolsa.</h1>
            <p className="text-text-dim mb-12 font-light">Envío gratuito en todos los productos.</p>

            <div className="space-y-10">
              <AnimatePresence>
                {cartItems.map(item => (
                  <motion.div 
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col sm:flex-row gap-8 py-10 border-b border-border-dim last:border-0"
                  >
                    <div className="w-40 h-40 bg-card rounded-3xl overflow-hidden shadow-inner group shrink-0 border border-border-dim">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{item.product.name}</h3>
                          <p className="text-[10px] text-text-dim uppercase tracking-widest">{item.product.category}</p>
                        </div>
                          <p className="text-xl font-light">
                            <motion.span
                              key={item.quantity}
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="inline-block"
                            >
                              ${(item.product.price * item.quantity).toLocaleString()}
                            </motion.span>
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-6 flex-wrap gap-4">
                          <div className="flex items-center gap-4 bg-card p-1.5 rounded-xl border border-border-dim">
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors text-text-dim hover:text-text-main"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <AnimatePresence mode="wait">
                            <motion.span 
                              key={item.quantity}
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="font-bold text-sm min-w-[20px] text-center"
                            >
                              {item.quantity}
                            </motion.span>
                          </AnimatePresence>
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors text-text-dim hover:text-text-main"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeFromCart(item.productId)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors border border-red-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Link to="/shop" className="inline-flex items-center gap-2 text-accent font-bold mt-12 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Seguir comprando
            </Link>
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-surface rounded-[40px] p-10 sticky top-32 border border-border-dim shadow-2xl shadow-black/50">
              <h3 className="text-2xl font-bold mb-8">Resumen.</h3>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-text-dim text-sm font-light">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-text-dim text-sm font-light">
                  <span>Impuestos (16%)</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-text-dim text-sm font-light">
                  <span>Envío</span>
                  <span className="text-accent font-bold uppercase tracking-widest text-[10px]">Gratis</span>
                </div>
                <div className="pt-6 border-t border-border-dim flex justify-between items-end">
                  <span className="font-bold text-lg">Total</span>
                  <span className="text-3xl font-extrabold tracking-tighter">${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/checkout')}
                  className="apple-button apple-button-primary w-full py-4 flex items-center justify-center gap-3"
                >
                   Finalizar Compra
                </button>
                <div className="flex items-center justify-center gap-6 mt-8">
                  <div className="w-8 h-5 bg-text-dim/10 rounded flex items-center justify-center text-[8px] font-bold text-text-dim uppercase">Visa</div>
                  <div className="w-8 h-5 bg-text-dim/10 rounded flex items-center justify-center text-[8px] font-bold text-text-dim uppercase">MC</div>
                  <div className="w-8 h-5 bg-text-dim/10 rounded flex items-center justify-center text-[8px] font-bold text-text-dim uppercase">Pay</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
