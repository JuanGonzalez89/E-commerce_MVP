import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    const u = await login(email, password)
    if (!u) return setError('Credenciales inválidas')
    navigate('/')
  }

  return (
    <form onSubmit={onSubmit} className="card">
      <h2>Iniciar sesión</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      {error && <p style={{color:'tomato'}}>{error}</p>}
      <button>Entrar</button>
      <p>¿No tenés cuenta? <Link to="/register">Registrate</Link></p>
    </form>
  )
}
