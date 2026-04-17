import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }){
  return (
    <article className="card">
      <img className="img" src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>
      {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
        .format(product.price)}
      </p>

      <p><span className="badge">{product.stock > 0 ? 'En stock' : 'Sin stock'}</span></p>
      <Link to={`/product/${product.id}`}>Ver detalle</Link>
    </article>
  )
}
