import React, { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser } from '@/services/api.js'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('uade_user')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const login = async (email, password) => {
    const u = await loginUser({ email, password })
    if (u) { setUser(u); localStorage.setItem('uade_user', JSON.stringify(u)) }
    return u
  }
  const register = async (payload) => {
    const u = await registerUser(payload)
    setUser(u); localStorage.setItem('uade_user', JSON.stringify(u))
    return u
  }
  const logout = () => { setUser(null); localStorage.removeItem('uade_user') }

  return <AuthCtx.Provider value={{ user, login, logout, register }}>{children}</AuthCtx.Provider>
}
