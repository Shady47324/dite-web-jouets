import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
    navigate('/')
  }

  return (
    <form className="max-w-sm mx-auto bg-white rounded shadow p-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold mb-3">Login</h1>
      <input className="border p-2 w-full mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 w-full mb-3" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Login</button>
    </form>
  )
}