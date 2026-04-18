
import React, { useState } from 'react';
import { useAuth } from '../App';
import { Mail, Lock, Store, ArrowRight, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-bg">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface rounded-[40px] shadow-2xl p-10 md:p-14 border border-border-dim shadow-black/50"
      >
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center text-accent border border-border-dim">
            <Store className="w-8 h-8" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-text-main">Bienvenido.</h1>
          <p className="text-text-dim text-sm font-light">Ingresa a tu cuenta premium</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold p-4 rounded-xl mb-6 text-center uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input 
              type="email" 
              placeholder="Email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-border-dim rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-1 focus:ring-accent/30 outline-none transition-all text-text-main"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input 
              type="password" 
              placeholder="Contraseña" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-border-dim rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-1 focus:ring-accent/30 outline-none transition-all text-text-main"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="apple-button apple-button-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2"
          >
            {isLoading ? 'Iniciando sesión...' : 'Continuar'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-border-dim flex flex-col gap-4 text-center">
          <p className="text-sm text-text-dim font-light">
            ¿No tienes cuenta? <Link to="/register" className="text-accent font-bold hover:underline">Regístrate gratis</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
