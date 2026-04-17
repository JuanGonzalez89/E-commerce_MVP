import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext.jsx'

export const Navbar = () => {
  const { itemsCount } = useCart()
  return (
    <nav className="navbar">
      <Link to="/">UADE Shop</Link>
      <div className="row">
        <Link to="/my-products">Mis publicaciones</Link>
        <Link to="/cart">Carrito <span className="badge">{itemsCount}</span></Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  )
}
