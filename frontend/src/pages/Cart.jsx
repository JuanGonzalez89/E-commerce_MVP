import React from 'react'
import { useCart } from '@/contexts/CartContext.jsx'

export default function Cart(){
  const { items, total, removeItem, clear } = useCart()
  if (!items.length) return <p>Tu carrito está vacío.</p>
  return (
    <section>
      {items.map(i => (
        <article className="card" key={i.id}>
          <div className="row" style={{justifyContent:'space-between'}}>
            <div className="row">
              <img className="img" src={i.image} alt={i.name} style={{width:100, height:100}}/>
              <div>
                <h3>{i.name}</h3>
                <p>Cantidad: {i.qty}</p>
              </div>
            </div>
            <button onClick={()=>removeItem(i.id)}>Eliminar</button>
          </div>
        </article>
      ))}
      <p><b>Total: ${'{'}total.toLocaleString(){'}'}</b></p>
      <button onClick={clear}>Vaciar carrito</button>
      <button onClick={()=>alert('Checkout simulado. Descuento de stock se realiza en backend/mock.')}>Checkout</button>
    </section>
  )
}
