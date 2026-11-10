import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { users, roles } from '../data/seed.js'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(users[0].email)
  const [password, setPassword] = useState(users[0].password)
  const [error, setError] = useState('')

  if (user) return <Navigate to="/schedule" replace />

  const onSubmit = (event) => {
    event.preventDefault()
    const ok = login(email, password)
    if (!ok) {
      setError('Email or password does not match a seeded demo account.')
      return
    }
    navigate('/schedule')
  }

  return (
    <section className="panel narrow">
      <h1>Sign in</h1>
      <p>Use a seeded demo account. No Azure auth yet.</p>
      <form onSubmit={onSubmit} className="stack">
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" className="primary">
          Continue
        </button>
      </form>
      <ul className="account-list">
        {users.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              onClick={() => {
                setEmail(row.email)
                setPassword(row.password)
                setError('')
              }}
            >
              {row.name} · {roles.find((role) => role.id === row.roleId)?.name}
              <span>{row.email}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
