import React, { useEffect, useState } from 'react'
import { createProduct, deleteProduct, listProducts, updateProduct } from '@/services/api.js'

export default function MyProducts(){
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name:'', price:0, stock:0, image:'', description:'', categoryId:'' })

  const reload = async () => setProducts(await listProducts({ _sort:'name', _order:'asc' }))
  useEffect(()=>{ reload() }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await updateProduct(editing.id, form)
    } else {
      await createProduct(form)
    }
    setForm({ name:'', price:0, stock:0, image:'', description:'', categoryId:'' })
    setEditing(null); reload()
  }

  return (
    <section className="row" style={{alignItems:'flex-start'}}>
      <form onSubmit={onSubmit} className="card" style={{flex:1}}>
        <h3>{editing ? 'Editar' : 'Nueva'} publicación</h3>
        <input placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input placeholder="Precio" type="number" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value)})} required />
        <input placeholder="Stock" type="number" value={form.stock} onChange={e=>setForm({...form, stock:Number(e.target.value)})} required />
        <input placeholder="URL de imagen" value={form.image} onChange={e=>setForm({...form, image:e.target.value})} required />
        <textarea placeholder="Descripción" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <input placeholder="categoryId" value={form.categoryId} onChange={e=>setForm({...form, categoryId:e.target.value})} />
        <button>{editing ? 'Guardar cambios' : 'Publicar'}</button>
        {editing && <button type="button" onClick={()=>{setEditing(null); setForm({ name:'', price:0, stock:0, image:'', description:'', categoryId:'' })}}>Cancelar</button>}
      </form>

      <div style={{flex:1}}>
        <h3>Mis productos</h3>
        {products.map(p => (
          <article className="card" key={p.id}>
            <div className="row" style={{justifyContent:'space-between'}}>
              <div className="row">
                <img className="img" src={p.image} alt={p.name} style={{width:80, height:80}}/>
                <div>
                  <h4>{p.name}</h4>
                  <p>${'{'}p.price.toLocaleString(){'}'} · Stock: {p.stock}</p>
                </div>
              </div>
              <div className="row">
                <button onClick={()=>{setEditing(p); setForm({ name:p.name, price:p.price, stock:p.stock, image:p.image, description:p.description, categoryId:p.categoryId })}}>Editar</button>
                <button onClick={()=>deleteProduct(p.id).then(reload)}>Eliminar</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
