
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, ShieldCheck, Truck, HeadphonesIcon, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setFeatured(data.slice(0, 4)));
  }, []);

  const benefits = [
    { icon: ShieldCheck, title: 'Garantía Oficial', desc: 'Soporte directo de Apple y garantía extendida iStore.' },
    { icon: Truck, title: 'Envío Express', desc: 'Entrega en 24 horas en las principales ciudades.' },
    { icon: Zap, title: 'Trade In', desc: 'Entrega tu iPhone viejo y llévate uno nuevo al mejor precio.' },
    { icon: HeadphonesIcon, title: 'Soporte 24/7', desc: 'Expertos certificados listos para ayudarte.' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center bg-bg text-text-main pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-iphone-portada.jpg" 
            className="w-full h-full object-cover object-center opacity-50"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/85 via-bg/55 to-bg"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title-style"
          >
            Novedad 2026
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-text-main"
          >
            iPhone 18 <br /> Pro Max.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-text-dim font-light mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            La nueva arquitectura Neural-X diseñada para la inteligencia espacial. Más rápido, más ligero, más tú.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/shop" className="apple-button apple-button-primary px-10 py-4">
              Comprar Ahora
            </Link>
            <div className="flex gap-4">
              <span className="text-[10px] px-3 py-1 bg-white/5 rounded-sm text-text-dim uppercase tracking-wider">Envío Gratis</span>
              <span className="text-[10px] px-3 py-1 bg-white/5 rounded-sm text-text-dim uppercase tracking-wider">36 Cuotas</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-bg border-y border-border-dim">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {benefits.map((b, i) => (
            <motion.div 
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center mb-6 transition-all border border-transparent group-hover:border-border-dim">
                <b.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-text-main">{b.title}</h3>
              <p className="text-text-dim text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-text-main">Explora la Gama.</h2>
              <p className="text-text-dim">Selección exclusiva de nuestros productos estrella.</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-accent text-sm font-bold hover:underline">
              Ver todo el catálogo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map(product => (
              <div key={product.id}>
                <ProductCard product={product as any} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-32 bg-bg overflow-hidden border-t border-border-dim">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-title-style block">Ecosistema Apple</span>
            <h2 className="text-5xl font-bold tracking-tighter mb-8 text-text-main">Poderosamente Conectado.</h2>
            <p className="text-lg text-text-dim leading-relaxed mb-10 font-light">
              No es solo un dispositivo, es una extensión de tu vida. Tus fotos, recordatorios y archivos se sincronizan mágicamente. Entra en el mundo donde todo funciona porque si.
            </p>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-card border border-border-dim rounded-lg flex items-center justify-center text-accent text-[10px] font-bold">01</div>
                <div>
                  <h4 className="font-bold mb-1 text-text-main">Privacidad Extrema</h4>
                  <p className="text-sm text-text-dim">Tus datos nunca salen de tus dispositivos sin tu permiso explícito.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-card border border-border-dim rounded-lg flex items-center justify-center text-accent text-[10px] font-bold">02</div>
                <div>
                  <h4 className="font-bold mb-1 text-text-main">Durabilidad Legendaria</h4>
                  <p className="text-sm text-text-dim">Diseñados con materiales reciclados y resistencia de grado aeroespacial.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-accent/5 blur-[100px] rounded-full"></div>
            <img 
              src="/macbook_seccion_landing.jpg" 
              alt="Apple Design" 
              className="relative rounded-3xl opacity-80 shadow-2xl object-cover aspect-square border border-border-dim"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Nuestros Clientes Section */}
      <section className="py-32 bg-surface overflow-hidden border-t border-border-dim">
        <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
          <span className="section-title-style block">Comunidad iStore</span>
          <h2 className="text-5xl font-bold tracking-tighter mb-4 text-text-main">Nuestros clientes.</h2>
          <p className="text-text-dim text-lg font-light">Lo que dicen los expertos y apasionados de Apple.</p>
        </div>

        <div className="relative w-full">
          <motion.div 
            animate={{ 
              x: [0, -1500],
            }}
            transition={{ 
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            className="flex gap-8 w-max px-4"
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-8">
                {[
                  { name: 'Ricardo Alarcón', role: 'Fotógrafo Profesional', comment: 'El iPhone 15 Pro ha cambiado mi flujo de trabajo. El ProRes directo a SSD es magia.', rating: 5 },
                  { name: 'Ana Sofía', role: 'Estudiante de Diseño', comment: 'Mi iPad Pro es mi lienzo. La precisión del Apple Pencil es inigualable en 2026.', rating: 5 },
                  { name: 'Marco Ruíz', role: 'Desarrollador Senior', comment: 'La MacBook Pro con M3 Max no conoce límites. Compilar es cuestión de segundos.', rating: 5 },
                  { name: 'Lucía Méndez', role: 'Corredora de Maratón', comment: 'El Apple Watch Ultra 2 me acompaña en cada kilómetro. Resistente y preciso.', rating: 5 },
                  { name: 'Daniel Kim', role: 'Productor Musical', comment: 'Los AirPods Pro 2 filtran todo el ruido de la ciudad. Audio puro y cristalino.', rating: 5 },
                ].map((review, idx) => (
                  <div 
                    key={idx} 
                    className="w-[350px] md:w-[450px] bg-card p-10 rounded-[40px] border border-border-dim shadow-2xl flex flex-col"
                  >
                    <div className="flex gap-1 text-gold mb-6">
                      {[...Array(review.rating)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-[28px] font-sans italic text-text-main/95 mb-12 leading-relaxed font-light tracking-[0.01em]">"{review.comment}"</p>
                    <div className="mt-auto flex items-center gap-4 pt-8 border-t border-border-dim/30">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center font-bold text-bg text-base shrink-0">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-text-main">{review.name}</h4>
                        <span className="text-[11px] text-text-dim uppercase tracking-widest font-medium">{review.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
          
          {/* Subtle edge fades instead of dark boxes */}
          <div className="absolute inset-y-0 left-0 w-20 md:w-64 bg-gradient-to-r from-surface via-surface/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-20 md:w-64 bg-gradient-to-l from-surface via-surface/80 to-transparent z-10 pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
}
