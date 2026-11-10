/* eslint-disable react-refresh/only-export-components */
import { createContext, useMemo, useState } from 'react'
import { users, roles } from '../data/seed.js'

export const AuthContext = createContext(null)
const SESSION_KEY = 'sc-session-user-id'

function roleName(roleId) {
  return roles.find((role) => role.id === roleId)?.name ?? 'athlete'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const id = Number(sessionStorage.getItem(SESSION_KEY))
    return users.find((row) => row.id === id) ?? null
  })

  const value = useMemo(() => {
    const login = (email, password) => {
      const match = users.find(
        (row) => row.email === email.trim().toLowerCase() && row.password === password,
      )
      if (!match) return false
      sessionStorage.setItem(SESSION_KEY, String(match.id))
      setUser(match)
      return true
    }

    const logout = () => {
      sessionStorage.removeItem(SESSION_KEY)
      setUser(null)
    }

    return {
      user,
      role: user ? roleName(user.roleId) : null,
      login,
      logout,
    }
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

