
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Store, Menu, X, ArrowRight, Star, Heart, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, User as UserType, CartItem } from './types';

// Contexts
interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | null>(null);

// Custom Hooks
export const useAuth = () => useContext(AuthContext)!;
export const useCart = () => useContext(CartContext)!;

// Components (Inline for MVP simplicity, will split if needed)
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/Cart';
import Checkout from './pages/Checkout';

function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out ${isScrolled ? 'glass-morphism py-3' : 'nav-idle py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Left Section: Logo & Link */}
        <div className="flex items-center gap-8 w-1/4">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <Store className="w-7 h-7 text-accent" />
            <span className="text-xl font-bold tracking-tight text-text-main hidden sm:block">iStore</span>
          </Link>
          <Link 
            to="/shop" 
            className={`hidden md:block text-[12px] font-bold uppercase tracking-widest transition-colors hover:text-accent ${location.pathname === '/shop' ? 'text-accent' : 'text-text-dim'}`}
          >
            Tienda
          </Link>
        </div>

        {/* Center Section: Search Bar */}
        <div className="hidden md:flex flex-1 justify-center max-w-xl">
          <form onSubmit={handleSearch} className="w-full relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar productos, modelos y más..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card/40 border border-border-dim/40 rounded-full py-2.5 pl-11 pr-4 text-xs focus:bg-card focus:border-accent/30 outline-none transition-all text-text-main font-light"
            />
          </form>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center justify-end gap-6 w-1/4">
          <Link to="/cart" className="relative group hover:text-accent transition-colors text-text-dim">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-bg text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden lg:block text-[11px] font-bold uppercase tracking-wider text-text-dim">{user.name.split(' ')[0]}</span>
              <button 
                onClick={logout}
                className="text-[11px] font-black text-accent hover:opacity-80 uppercase tracking-tighter"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-accent transition-colors text-text-dim">
              <User className="w-5 h-5" />
            </Link>
          )}
          <button className="md:hidden text-text-main" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-surface z-[60] p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-2">
                <Store className="w-8 h-8 text-accent" />
                <span className="text-xl font-bold tracking-tight text-text-main">iStore</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-text-main">
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="mb-12 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
              <input 
                type="text" 
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-border-dim rounded-2xl py-4 pl-12 pr-4 text-base focus:border-accent outline-none text-text-main"
              />
            </form>

            <div className="flex flex-col gap-6">
              <Link 
                to="/shop" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-3xl font-bold border-b border-border-dim pb-4 text-text-main hover:text-accent"
              >
                Tienda
              </Link>
              <Link 
                to="/cart" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-3xl font-bold border-b border-border-dim pb-4 text-text-main hover:text-accent"
              >
                Mi Carrito
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-surface pt-20 pb-10 border-t border-border-dim">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Store className="w-6 h-6 text-accent" />
            <span className="text-lg font-bold text-text-main">iStore</span>
          </div>
          <p className="text-text-dim text-sm leading-relaxed">
            Tu distribuidor premium de Apple en 2026. Innovación, tecnología y diseño en la palma de tu mano.
          </p>
        </div>
        <div>
          <h4 className="section-title-style">Productos</h4>
          <ul className="space-y-4 text-sm text-text-dim">
            <li><Link to="/shop?category=iPhone" className="hover:text-accent">iPhone</Link></li>
            <li><Link to="/shop?category=Mac" className="hover:text-accent">MacBook</Link></li>
            <li><Link to="/shop?category=iPad" className="hover:text-accent">iPad</Link></li>
            <li><Link to="/shop?category=Watch" className="hover:text-accent">Apple Watch</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="section-title-style">Servicio</h4>
          <ul className="space-y-4 text-sm text-text-dim">
            <li><a href="#" className="hover:text-accent">Soporte Técnico</a></li>
            <li><a href="#" className="hover:text-accent">Garantía Premium</a></li>
            <li><a href="#" className="hover:text-accent">Envíos Rápidos</a></li>
            <li><a href="#" className="hover:text-accent">Devoluciones</a></li>
          </ul>
        </div>
        <div>
          <h4 className="section-title-style">Newsletter</h4>
          <p className="text-sm text-text-dim mb-4">Recibe las últimas novedades y ofertas exclusivas.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Email" className="bg-card border border-border-dim rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:border-accent text-text-main" />
            <button className="bg-accent text-bg rounded-xl p-2 hover:opacity-80 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-border-dim flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-text-dim">
        <p>&copy; 2026 iStore Inc. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-text-main">Privacidad</a>
          <a href="#" className="hover:text-text-main">Términos de uso</a>
          <a href="#" className="hover:text-text-main">Ventas y reembolsos</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const login = async (credentials: any) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error('Credenciales inválidas');
    const data = await res.json();
    setUser(data.user);
  };

  const register = async (userData: any) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Error al registrar usuario');
    const data = await res.json();
    setUser(data.user);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const addToCart = (productId: string, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-24">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}
