import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from './AuthContext'

const CartCtx = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  const refresh = async () => {
    if (!user) { setItems([]); return }
    const { data } = await api.get('/api/cart')
    setItems(data)
  }

  useEffect(() => { refresh() }, [user])

  const add = async (productVariantId, quantity = 1) => {
    await api.post('/api/cart', { productVariantId, quantity })
    await refresh()
  }

  const update = async (id, quantity) => {
    await api.put(`/api/cart/${id}`, { quantity })
    await refresh()
  }

  const remove = async (id) => {
    await api.delete(`/api/cart/${id}`)
    await refresh()
  }

  return (
    <CartCtx.Provider value={{ items, refresh, add, update, remove }}>
      {children}
    </CartCtx.Provider>
  )
}

export function useCart() {
  return useContext(CartCtx)
}