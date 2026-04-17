import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '@/services/api.js'
import { useCart } from '@/contexts/CartContext.jsx'

export default function ProductDetail(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addItem } = useCart()

  useEffect(() => {
    getProduct(id).then(setProduct).catch(()=>setError('No se pudo cargar')).finally(()=>setLoading(false))
  }, [id])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>
  if (!product) return <p>No encontrado</p>

  return (
    <section className="row">
      <img className="img" src={product.image} alt={product.name} style={{maxWidth: 320}}/>
      <div>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>
        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
          .format(product.price)}
        </p>
        <button disabled={product.stock === 0} onClick={()=>addItem(product)}>
          {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </section>
  )
}
