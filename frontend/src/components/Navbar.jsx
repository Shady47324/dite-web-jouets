import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { useCart } from '../state/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">Shop</Link>
        <nav className="flex gap-4 items-center">
          <Link to="/cart" className="text-sm">Cart ({items.length})</Link>
          {user ? (
            <>
              {user.isAdmin && <Link to="/admin" className="text-sm">Admin</Link>}
              <button className="text-sm" onClick={() => { logout(); navigate('/')}}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/register" className="text-sm">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}