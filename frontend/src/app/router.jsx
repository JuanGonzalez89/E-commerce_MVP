import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home.jsx'
import ProductDetail from '@/pages/ProductDetail.jsx'
import Cart from '@/pages/Cart.jsx'
import Login from '@/pages/Login.jsx'
import Register from '@/pages/Register.jsx'
import MyProducts from '@/pages/MyProducts.jsx'
import NotFound from '@/pages/NotFound.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/my-products" element={
      <ProtectedRoute>
        <MyProducts />
      </ProtectedRoute>
    } />
    <Route path="*" element={<NotFound />} />
  </Routes>
)
