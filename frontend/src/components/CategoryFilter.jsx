import React from 'react'
export default function CategoryFilter({ categories, value, onChange }){
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}>
      <option value="">Todas las categorías</option>
      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
    </select>
  )
}
