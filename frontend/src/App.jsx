import React from 'react'
import { Navbar } from './components/Navbar.jsx'
import { AppRouter } from './app/router.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './assets/base.css'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <main className="container">
          <AppRouter />
        </main>
        <footer className="footer">© 2025 UADE · TPO</footer>
      </CartProvider>
    </AuthProvider>
  )
}
