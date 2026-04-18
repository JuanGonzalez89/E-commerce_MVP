
import React, { useState } from 'react';
import { useCart, useAuth } from '../App';
import { CreditCard, CheckCircle2, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Checkout() {
  const { cart, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    cvv: '',
    expiry: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0 && step !== 3) return <Navigate to="/shop" />;
  if (!user) return <Navigate to="/login" />;

  const handleProcessOrder = async () => {
    setIsProcessing(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 2000));
    
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart,
        paymentMethod: 'credit_card'
      })
    });

    if (res.ok) {
      clearCart();
      setStep(3);
    } else {
      alert('Error al procesar pedido. Revisa el stock.');
    }
    setIsProcessing(false);
  };

  return (
    <div className="bg-bg min-h-screen pt-20 pb-40">
      <div className="max-w-4xl mx-auto px-6">
        {/* Progress Tracker */}
        <div className="flex items-center justify-center gap-4 mb-20">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-accent' : 'bg-card'}`}></div>
          <div className={`h-0.5 w-12 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-card'}`}></div>
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-card'}`}></div>
          <div className={`h-0.5 w-12 rounded-full ${step >= 3 ? 'bg-accent' : 'bg-card'}`}></div>
          <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-accent' : 'bg-card'}`}></div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-surface rounded-[40px] p-10 md:p-16 border border-border-dim shadow-2xl shadow-black/50"
            >
              <h1 className="text-3xl font-bold mb-8 text-text-main">¿A dónde enviamos tu iStore?</h1>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest block mb-2">Dirección de Envío</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-card border border-border-dim rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-accent/30 outline-none text-text-main" 
                    placeholder="Calle, Número, Depto"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest block mb-2">Ciudad</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-card border border-border-dim rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-accent/30 outline-none text-text-main" 
                    placeholder="Buenos Aires"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest block mb-2">Código Postal</label>
                  <input 
                    type="text" 
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full bg-card border border-border-dim rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-accent/30 outline-none text-text-main" 
                    placeholder="1000"
                  />
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!formData.address || !formData.city}
                className="apple-button apple-button-primary mt-12 w-full py-4 text-sm font-bold flex items-center justify-center gap-2"
              >
                Continuar al Pago <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-surface rounded-[40px] p-10 md:p-16 border border-border-dim shadow-2xl shadow-black/50"
            >
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-text-main">Pago Seguro.</h1>
                <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest">
                  <Lock className="w-4 h-4" /> Encriptado SSL
                </div>
              </div>
              
              <div className="bg-bg text-text-main rounded-[32px] p-8 mb-12 relative overflow-hidden border border-border-dim/50">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
                <CreditCard className="w-10 h-10 mb-8 text-accent opacity-50" />
                <div className="space-y-6">
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000"
                    className="bg-transparent border-none p-0 text-2xl tracking-widest placeholder:text-text-dim/20 outline-none w-full font-light"
                    maxLength={16}
                  />
                  <div className="flex gap-12">
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      className="bg-transparent border-none p-0 text-sm tracking-widest placeholder:text-text-dim/20 outline-none w-20"
                    />
                    <input 
                      type="text" 
                      placeholder="CVV"
                      className="bg-transparent border-none p-0 text-sm tracking-widest placeholder:text-text-dim/20 outline-none w-12"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-card border border-border-dim rounded-3xl mb-12">
                <ShieldCheck className="w-8 h-8 text-accent" />
                <div>
                  <h4 className="font-bold text-sm text-text-main">Tu pedido está protegido</h4>
                  <p className="text-xs text-text-dim">iStore Care garantiza el reembolso total en caso de daños o pérdida.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="apple-button apple-button-secondary flex-grow"
                >
                  Volver
                </button>
                <button 
                  onClick={handleProcessOrder}
                  disabled={isProcessing}
                  className="apple-button apple-button-primary flex-[2] py-4"
                >
                  {isProcessing ? 'Procesando...' : 'Pagar Ahora'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface rounded-[40px] p-16 border border-border-dim shadow-2xl shadow-black/50 text-center"
            >
              <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-10 border border-accent/20">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h1 className="text-5xl font-extrabold tracking-tighter mb-4 text-text-main">¡Gracias por <br /> tu compra!</h1>
              <p className="text-text-dim text-lg mb-12 max-w-sm mx-auto font-light">Tu pedido ha sido procesado con éxito. Pronto recibirás un email con los detalles del envío.</p>
              <button 
                onClick={() => navigate('/')}
                className="apple-button apple-button-primary px-12"
              >
                Volver al inicio
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
