import React, { useEffect, useState } from 'react'
import { listProducts, listCategories } from '@/services/api.js'
import ProductCard from '@/components/ProductCard.jsx'
import CategoryFilter from '@/components/CategoryFilter.jsx'

export default function Home(){
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [q, setQ] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [order, setOrder] = useState('asc')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          listCategories(),
          listProducts({ _sort:'name', _order:order, name_like:q || undefined, categoryId: categoryId || undefined })
        ])
        setCategories(cats); setProducts(prods)
      } catch (e){ setError('No se pudieron cargar datos') }
      finally { setLoading(false) }
    }
    fetchData()
  }, [q, categoryId, order])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <section>
      <header className="row">
        <input placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} />
        <CategoryFilter categories={categories} value={categoryId} onChange={setCategoryId} />
        <select value={order} onChange={e=>setOrder(e.target.value)}>
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
      </header>
      {products.length === 0 ? <p>Sin resultados</p> : (
        <div className="grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  )
}
